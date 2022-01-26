import { useEffect, useState } from "react"
import { Col, Form, message, Modal, Popconfirm, Row, Spin } from "antd"
import { Moment } from "moment"
import { ApolloError, useLazyQuery, useMutation, useReactiveVar } from "@apollo/client"
import { CloseOutlined } from "@ant-design/icons"
import "./styles.css"
import { IReservation } from "../../../../lib/Types"
import { ReservationInput } from "../../../../lib/graphql/globalTypes"
import { dateFormat, dateFormatShort } from "../../../../lib/Constants"
import { GuestDrawer } from "../../../Guests/components/GuestDrawer"
import { Guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { GUESTS } from "../../../../lib/graphql/queries/Guests"
import { CreateReservation, CreateReservationVariables, CreateReservation_createReservation_reservation } from "../../../../lib/graphql/mutations/Reservation/__generated__/CreateReservation"
import { CREATE_RESERVATION, SEND_CONFIRMATION, UPDATE_RESERVATION } from "../../../../lib/graphql/mutations/Reservation"
import { UpdateReservation, UpdateReservationVariables, UpdateReservation_updateReservation_reservation } from "../../../../lib/graphql/mutations/Reservation/__generated__/UpdateReservation"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { AddGuestButton, RemoveButton, SendConfirmationButton, SubmitButton } from "./components/FooterActions"
import { Confirmation } from "./components/Confirmation"
import { SendConfirmation, SendConfirmationVariables } from "../../../../lib/graphql/mutations/Reservation/__generated__/SendConfirmation"
import { ReservationForm } from "./components/ReservationForm"
import { ExpirationConfirmation } from "./components/ExpirationConfirmation"
import { reservationModalOpen } from "../../../../cache"
import { TimelineData } from "../../data"
import { NumberHelper } from "../../../../lib/components/NumberHelper"

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

  const [ deleteConfirmVisible, setDeleteConfirmVisible ] = useState<boolean>(false)
  const [ reservationConfirmationMessage, setReservationConfirmationMessage ] = useState<string>()
  const [ reservationConfirmationNote, setReservationConfirmationNote ] = useState<string>()
  const [ reservationConfirmationVisible, setReservationConfirmationVisible ] = useState<boolean>(false)
  const [ reservationPriceSuiteId, setReservationPriceSuiteId ] = useState<string>()

  const networkErrorHandler = (reason: ApolloError) => message.error(reason.message)

  const closeModal = () => {
    setReservationConfirmationMessage(undefined)
    setReservationConfirmationVisible(false)
    close()
  }

  const actionCallback = (callback: (newReservation: any) => void, newReservation?: CreateReservation_createReservation_reservation | UpdateReservation_updateReservation_reservation | null) => {
    if (newReservation !== undefined && newReservation !== null) {
      callback(newReservation)
    }
    if (refetch !== undefined) {
      if (newReservation === undefined || newReservation == null) {
        refetch()
      } else {
        refetch(TimelineData.getAppReservation(newReservation, newReservation?.priceSet, reservationPriceSuiteId))
      }
    }
  }

  const [ createReservation, { loading: createLoading } ] = useMutation<CreateReservation, CreateReservationVariables>(CREATE_RESERVATION, {
    onCompleted: (data: CreateReservation) => {
      actionCallback((newReservation: CreateReservation_createReservation_reservation) => {
        setReservationConfirmationMessage(t("reservations.updated-info", { email: newReservation.guest.email }))
        setReservationConfirmationVisible(true)
        message.success(t("reservations.created"))
      }, data.createReservation?.reservation)
    },
    onError: networkErrorHandler
  })
  const [ updateReservation, { loading: updateLoading } ] = useMutation<UpdateReservation, UpdateReservationVariables>(UPDATE_RESERVATION, {
    onCompleted: (data: UpdateReservation) => {
      actionCallback((newReservation: UpdateReservation_updateReservation_reservation) => {
        setReservationConfirmationMessage(t("reservations.updated-info", { email: newReservation.guest.email }))
        setReservationConfirmationVisible(true)
        message.success(t("reservations.updated"))
      }, data.updateReservation?.reservation)
    },
    onError: networkErrorHandler
  })
  const [ sendConfirmation, { loading: confirmationLoading } ] = useMutation<SendConfirmation, SendConfirmationVariables>(SEND_CONFIRMATION, {
    onCompleted: (value: SendConfirmation) => {
      const email = value.sendConfirmation?.reservation?.guest.email
      message.success(t("reservations.confirmation-sent", { email: (email === undefined || email === null) ? "" : email }))
      setReservationConfirmationNote("")
      closeModal()
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })
  const [ getGuests, { loading: guestsLoading, data: guestsData, refetch: refetchGuests } ] = useLazyQuery<Guests>(GUESTS, {
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
    let roommates = []

    if (formDates === null) {
      from = moment()
      to = moment()
    } else {
      from = formDates[ 0 ]
      to = formDates[ 1 ]
    }

    if (formData.roommates !== undefined) {
      roommates = formData.roommates.map((roommate: { id: string }) => roommate.id)
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
        suiteId: NumberHelper.decodeCurrency(reservation?.price?.suite.id),
        total: NumberHelper.decodeCurrency(formData.priceTotal)
      },
      purpose: formData.purpose,
      roommateIds: roommates,
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
      setReservationPriceSuiteId(reservation.price?.suite.id)
      updateReservation({ variables: { data: { id: String(reservation.id), ...variables } } })
    } else {
      setReservationPriceSuiteId(form.getFieldValue("suite"))
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