import { useEffect, useState } from "react"
import { Col, Form, message, Modal, Popconfirm, Row, Spin } from "antd"
import { Moment } from "moment"
import { ApolloError, useLazyQuery, useMutation, useReactiveVar } from "@apollo/client"
import { CloseOutlined } from "@ant-design/icons"
import "./styles.css"
import { IReservation, PriceInfo } from "../../../../lib/Types"
import { ReservationInput } from "../../../../lib/graphql/globalTypes"
import { dateFormat, dateFormatShort } from "../../../../lib/Constants"
import { GuestDrawer } from "../../../Guests/components/GuestDrawer"
import { Guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { GUESTS } from "../../../../lib/graphql/queries/Guests"
import { CreateReservation, CreateReservationVariables, CreateReservation_createReservation_reservation } from "../../../../lib/graphql/mutations/Reservation/__generated__/CreateReservation"
import { CREATE_RESERVATION, DELETE_RESERVATION, SEND_CONFIRMATION, UPDATE_RESERVATION } from "../../../../lib/graphql/mutations/Reservation"
import { UpdateReservation, UpdateReservationVariables, UpdateReservation_updateReservation_reservation } from "../../../../lib/graphql/mutations/Reservation/__generated__/UpdateReservation"
import { DeleteReservation, DeleteReservationVariables } from "../../../../lib/graphql/mutations/Reservation/__generated__/DeleteReservation"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { AddGuestButton, RemoveButton, SendConfirmationButton, SubmitButton } from "./components/FooterActions"
import { Confirmation } from "./components/Confirmation"
import { SendConfirmation, SendConfirmationVariables } from "../../../../lib/graphql/mutations/Reservation/__generated__/SendConfirmation"
import { ReservationForm } from "./components/ReservationForm"
import { ExpirationConfirmation } from "./components/ExpirationConfirmation"
import { reservationModalOpen } from "../../../../cache"

interface Props {
  close: () => void
  refetch?: (selected?: IReservation) => void
  reservation?: IReservation
}

export const ReservationModal = ({
  close,
  refetch,
  reservation
}: Props) => {

  const { t } = useTranslation()
  const [ form ] = Form.useForm()
  const visible = useReactiveVar(reservationModalOpen)

  const [ deleteConfirmVisible, setDeleteConfirmVisible ] = useState<boolean>(false)
  const [ priceInfo, setPriceInfo ] = useState<PriceInfo>({
    priceAccommodation: 0,
    priceMeal: 0,
    priceMunicipality: 0,
    priceTotal: 0
  })
  const [ reservationConfirmationMessage, setReservationConfirmationMessage ] = useState<string>()
  const [ reservationConfirmationVisible, setReservationConfirmationVisible ] = useState<boolean>(false)

  const networkErrorHandler = (reason: ApolloError) => message.error(reason.message)

  const closeModal = () => {
    setReservationConfirmationMessage(undefined)
    setReservationConfirmationVisible(false)
    close()
  }

  const actionCallback = (callback: (newReservation: any) => void, newReservation?: any | null) => {
    if (newReservation !== undefined && newReservation !== null) {
      callback(newReservation)
    }
    if (refetch !== undefined) {
      refetch(newReservation)
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
  const [ deleteReservation, { loading: deleteLoading } ] = useMutation<DeleteReservation, DeleteReservationVariables>(DELETE_RESERVATION, {
    onCompleted: () => {
      actionCallback(() => message.success(t("reservations.deleted")))
      closeModal()
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
    onCompleted: () => {
      message.success(t("reservations.confirmation-sent", { email: reservation?.guest?.email }))
      closeModal()
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })
  const [ getGuests, { loading: guestsLoading, data: guestsData, refetch: refetchGuests } ] = useLazyQuery<Guests>(GUESTS, {
    onError: networkErrorHandler
  })

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
      fromDate: from.format(dateFormat),
      guestId: formData.guest,
      meal: formData.meal,
      notes: formData.notes,
      payingGuestId: formData.paying,
      priceAccommodation: priceInfo.priceAccommodation,
      priceMeal: priceInfo.priceMeal,
      priceMunicipality: priceInfo.priceMunicipality,
      priceTotal: priceInfo.priceTotal,
      purpose: formData.purpose,
      roommateIds: roommates,
      suiteId: reservation !== undefined ? +reservation.suite.id : null,
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

  const sendReservationConfirmation = (reservation?: IReservation) => {
    if (reservation !== undefined && reservation.id !== undefined) {
      sendConfirmation({ variables: { reservationId: String(reservation.id) } })
    }
  }

  useEffect(() => {
    // Form instance is created on page load (before modal is open),
    // but the component is rendered only when modal is opened
    if (reservationModalOpen() === true) {
      form.resetFields()
      getGuests()
    }
  }, [ form, getGuests, reservation ])

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
                  deleteReservation({ variables: { reservationId } })
                } }
                key="remove"
                reservation={ reservation } />
            </Col>
            <Col
              sm={ { offset: 6, span: 4 } }
              xs={ { span: 24 } }>
              <SendConfirmationButton
                key="confirmation"
                reservation={ reservation }
                send={ sendReservationConfirmation } />
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
            || deleteLoading
            || guestsLoading
            || updateLoading
          }
          tip={ `${ t("loading") }...` }>
          <Confirmation
            cancel={ closeModal }
            message={ reservationConfirmationMessage }
            reservation={ reservation }
            send={ sendReservationConfirmation }
            visible={ reservationConfirmationVisible } />
          <ExpirationConfirmation
            reservation={ reservation } />
          <ReservationForm
            form={ form }
            guestsData={ guestsData }
            reservation={ reservation }
            setPriceInfo={ setPriceInfo } />
        </Spin>
      </Modal>
      <GuestDrawer refetch={ refetchGuests } />
    </>
  )
}