import { useEffect, useState } from "react"
import { Col, Form, message, Modal, Popconfirm, Row, Spin } from "antd"
import { Moment } from "moment"
import { ApolloError, useLazyQuery, useMutation, useReactiveVar } from "@apollo/client"
import { CloseOutlined } from "@ant-design/icons"
import "./styles.css"
import { IReservation } from "../../../../lib/Types"
import { ReservationInput } from "../../../../lib/graphql/graphql"
import { dateFormat, dateFormatShort } from "../../../../lib/Constants"
import { GuestDrawer } from "../../../Guests/components/GuestDrawer"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { AddGuestButton, RemoveButton, SendConfirmationButton, SubmitButton } from "./components/FooterActions"
import { Confirmation } from "./components/Confirmation"
import { ReservationForm } from "./components/ReservationForm"
import { ExpirationConfirmation } from "./components/ExpirationConfirmation"
import { appSettings, reservationModalOpen } from "../../../../cache"
import { TimelineData } from "../../data"
import { NumberHelper } from "../../../../lib/components/NumberHelper"
import { CreateReservationDocument, CreateReservationMutation, CreateReservationMutationVariables, GuestsDocument, GuestsQuery, SendConfirmationDocument, SendConfirmationMutation, SendConfirmationMutationVariables, UpdateReservationDocument, UpdateReservationMutation, UpdateReservationMutationVariables } from "../../../../lib/graphql/graphql"

interface Props {
  close: () => void
  refetch?: (selected?: IReservation) => void
  remove: (id: string) => void
  removing: boolean,
  reservation?: IReservation
}

export const ReservationModal = ({
  close,
  refetch,
  remove,
  removing,
  reservation
}: Props) => {

  const { t } = useTranslation()
  const [ form ] = Form.useForm()
  const visible = useReactiveVar(reservationModalOpen)
  const settings = useReactiveVar(appSettings)

  const [ deleteConfirmVisible, setDeleteConfirmVisible ] = useState<boolean>(false)
  const [ reservationConfirmationMessage, setReservationConfirmationMessage ] = useState<string>()
  const [ reservationConfirmationNote, setReservationConfirmationNote ] = useState<string>()
  const [ reservationConfirmationVisible, setReservationConfirmationVisible ] = useState<boolean>(false)

  const networkErrorHandler = (reason: ApolloError) => message.error(reason.message)

  const closeModal = () => {
    setReservationConfirmationMessage(undefined)
    setReservationConfirmationVisible(false)
    close()
  }

  // @todo: replace any type with specific types 
  const actionCallback = (callback: (newReservation: any) => void, newReservation?: any | null) => {
    if (newReservation !== undefined && newReservation !== null) {
      callback(newReservation)
    }
    if (refetch !== undefined) {
      if (newReservation === undefined || newReservation == null) {
        refetch()
      } else {
        refetch(TimelineData.getAppReservation(newReservation, newReservation?.priceSet, newReservation.suite.id))
      }
    }
  }

  const [ createReservation, { loading: createLoading } ] = useMutation<CreateReservationMutation, CreateReservationMutationVariables>(CreateReservationDocument, {
    onCompleted: (data: CreateReservationMutation) => {
      actionCallback((newReservation: IReservation) => {
        setReservationConfirmationMessage(t("reservations.updated-info", { email: newReservation.guest?.email }))
        setReservationConfirmationVisible(true)
        message.success(t("reservations.created"))
      }, data.createReservation?.reservation)
    },
    onError: networkErrorHandler
  })
  const [ updateReservation, { loading: updateLoading } ] = useMutation<UpdateReservationMutation, UpdateReservationMutationVariables>(UpdateReservationDocument, {
    onCompleted: (data: UpdateReservationMutation) => {
      actionCallback((newReservation: IReservation) => {
        setReservationConfirmationMessage(t("reservations.updated-info", { email: newReservation.guest?.email }))
        setReservationConfirmationVisible(true)
        message.success(t("reservations.updated"))
      }, data.updateReservation?.reservation)
    },
    onError: networkErrorHandler
  })
  const [ sendConfirmation, { loading: confirmationLoading } ] = useMutation<SendConfirmationMutation, SendConfirmationMutationVariables>(SendConfirmationDocument, {
    onCompleted: (value: SendConfirmationMutation) => {
      const email = value.sendConfirmation?.reservation?.guest.email
      message.success(t("reservations.confirmation-sent", { email: (email === undefined || email === null) ? "" : email }))
      setReservationConfirmationNote("")
      closeModal()
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })
  const [ getGuests, { loading: guestsLoading, data: guestsData, refetch: refetchGuests } ] = useLazyQuery<GuestsQuery>(GuestsDocument, {
    onError: networkErrorHandler
  })

  const getReservationDays = (): number => {
    const formDates: Array<Moment> = form.getFieldValue("dates")
    if (formDates !== null) {
      const startDate = moment(formDates[ 0 ])
      const endDate = moment(formDates[ 1 ])
      return Math.ceil(moment.duration(endDate.diff(startDate)).asDays())
    }
    // @todo: replace with default constant 
    return 1
  }

  const getReservationInput = (): ReservationInput => {
    const formData = form.getFieldsValue(true)
    const formDates: Array<Moment> = form.getFieldValue("dates")
    const expired: Moment = form.getFieldValue("expired")
    let from: Moment
    let to: Moment
    let roommates: { id: string, fromDate: string, toDate: string }[] = []

    if (formDates === null) {
      from = moment()
      to = moment()
    } else {
      from = formDates[ 0 ]
        .hours(settings?.defaultArrivalTime.substring(0, 2))
        .minutes(settings?.defaultArrivalTime.substring(3, 5))
        .seconds(0)
      to = formDates[ 1 ]
        .hours(settings?.defaultDepartureTime.substring(0, 2))
        .minutes(settings?.defaultArrivalTime.substring(3, 5))
        .seconds(0)
    }

    if (formData.roommates !== undefined) {
      roommates = formData.roommates.map((roommateData: { id: string, fromDate: Moment }) => {
        const roommate = { id: roommateData.id, fromDate: '', toDate: '' }
        if (roommateData.fromDate !== undefined) {
          roommate.fromDate = roommateData.fromDate.hour(15).minute(0).format(dateFormat)
        }
        return roommate
      })
    }

    const input: ReservationInput = {
      extraSuitesIds: formData.suites?.map((suite: { id: string }) => suite.id),
      fromDate: from.format(dateFormat),
      guestId: formData.guest,
      meal: formData.meal,
      notes: formData.notes,
      numberDays: getReservationDays(),
      payingGuestId: formData.paying,
      price: {
        accommodation: NumberHelper.decodeCurrency(formData.priceAccommodation),
        meal: NumberHelper.decodeCurrency(formData.priceMeal),
        municipality: NumberHelper.decodeCurrency(formData.priceMunicipality),
        suiteId: NumberHelper.decodeCurrency(reservation?.price?.suite?.id),
        total: NumberHelper.decodeCurrency(formData.priceTotal)
      },
      purpose: formData.purpose,
      roommates: roommates,
      suiteId: formData.suite,
      toDate: to.format(dateFormat),
      type: formData.type
    }

    if (expired !== undefined && expired !== null) {
      input.expired = expired.format(dateFormatShort)
    }

    return input
  }

  const submitForm = (): void => {
    const variables: ReservationInput = getReservationInput()
    if (reservation !== undefined && reservation.id !== undefined) {
      updateReservation({ variables: { data: { id: String(reservation.id), ...variables } } })
    } else {
      createReservation({ variables: { data: { ...variables } } })
    }
  }

  const sendReservationConfirmation = (reservation?: IReservation, note?: string) => {
    if (reservation !== undefined && reservation.id !== undefined) {
      sendConfirmation({
        variables: {
          data: { note, reservationId: String(reservation.id) }
        }
      })
    }
  }

  useEffect(() => {
    // Form instance is created on page load (before modal is open),
    // but the component is rendered only when modal is opened
    if (visible === true) {
      form.resetFields()
      getGuests()
    }
  }, [ form, getGuests, reservation, visible ])

  return (
    <>
      <Modal
        className="reservation-modal"
        closeIcon={ (
          <Popconfirm
            onCancel={ () => setDeleteConfirmVisible(false) }
            onConfirm={ () => {
              setDeleteConfirmVisible(false)
              setTimeout(closeModal)
            } }
            title={ t("forms.close-dirty") }
            visible={ deleteConfirmVisible }>
            <CloseOutlined onClick={ () => {
              if (form.isFieldsTouched()) {
                setDeleteConfirmVisible(true)
              } else {
                closeModal()
              }
            } } />
          </Popconfirm>
        ) }
        footer={
          <Row>
            <Col
              sm={ { span: 4 } }
              xs={ { span: 24 } }>
              <RemoveButton
                deleteReservation={ (reservationId: string) => {
                  setReservationConfirmationVisible(false)
                  remove(reservationId)
                } }
                key="remove"
                reservation={ reservation } />
            </Col>
            <Col
              sm={ { offset: 6, span: 4 } }
              xs={ { span: 24 } }>
              <SendConfirmationButton
                key="confirmation"
                note={ reservationConfirmationNote }
                reservation={ reservation }
                send={ sendReservationConfirmation }
                setNote={ setReservationConfirmationNote } />
            </Col>
            <Col
              sm={ { offset: 1, span: 4 } }
              xs={ { span: 24 } }>
              <AddGuestButton key="guest" />
            </Col>
            <Col
              sm={ { offset: 1, span: 4 } }
              xs={ { span: 24 } }>
              <SubmitButton
                key="create"
                reservation={ reservation }
                submit={ () => {
                  form.validateFields().then(submitForm)
                } } />
            </Col>
          </Row>
        }
        title={ t("reservations.form") }
        visible={ visible }>
        <Spin
          spinning={
            confirmationLoading
            || createLoading
            || removing
            || guestsLoading
            || updateLoading
          }
          tip={ `${ t("loading") }...` }>
          <Confirmation
            cancel={ closeModal }
            message={ reservationConfirmationMessage }
            note={ reservationConfirmationNote }
            reservation={ reservation }
            send={ sendReservationConfirmation }
            setNote={ setReservationConfirmationNote }
            visible={ reservationConfirmationVisible } />
          <ExpirationConfirmation
            reservation={ reservation } />
          <ReservationForm
            form={ form }
            getReservationDays={ getReservationDays }
            guestsData={ guestsData }
            reservation={ reservation } />
        </Spin>
      </Modal>
      <GuestDrawer refetch={ refetchGuests } />
    </>
  )
}