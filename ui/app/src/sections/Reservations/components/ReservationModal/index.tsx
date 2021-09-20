import { useEffect, useState } from "react"
import { Form, message, Modal, Popconfirm, Spin } from "antd"
import { Moment } from "moment"
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client"
import { CloseOutlined } from "@ant-design/icons"
import "./styles.css"
import { GuestOption, IReservation, OptionsType } from "../../../../lib/Types"
import { ReservationInput } from "../../../../lib/graphql/globalTypes"
import { dateFormat } from "../../../../lib/Constants"
import { GuestDrawer } from "../../../Guests/components/GuestDrawer"
import { Guests, Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { GUESTS } from "../../../../lib/graphql/queries/Guests"
import { CreateReservation, CreateReservationVariables, CreateReservation_createReservation_reservation } from "../../../../lib/graphql/mutations/Reservation/__generated__/CreateReservation"
import { CREATE_RESERVATION, DELETE_RESERVATION, SEND_CONFIRMATION, UPDATE_RESERVATION } from "../../../../lib/graphql/mutations/Reservation"
import { UpdateReservation, UpdateReservationVariables, UpdateReservation_updateReservation_reservation } from "../../../../lib/graphql/mutations/Reservation/__generated__/UpdateReservation"
import { DeleteReservation, DeleteReservationVariables } from "../../../../lib/graphql/mutations/Reservation/__generated__/DeleteReservation"
import { useTranslation } from "react-i18next"
import { Suites_suites } from "../../../../lib/graphql/queries/Suites/__generated__/Suites"
import moment from "moment"
import { Roommates, RoommatesVariables } from "../../../../lib/graphql/queries/Roommates/__generated__/Roommates"
import { ROOMMATES } from "../../../../lib/graphql/queries/Roommates"
import { RoommatesDrawer } from "../../../Guests/components/RoommatesDrawer"
import { AddGuestButton, RemoveButton, SendConfirmationButton, SubmitButton } from "./components/FooterActions"
import { Confirmation } from "./components/Confirmation"
import { SendConfirmation, SendConfirmationVariables } from "../../../../lib/graphql/mutations/Reservation/__generated__/SendConfirmation"
import { ReservationForm } from "./components/ReservationForm"

interface Props {
  close: () => void
  isOpen: boolean
  refetch?: (selected?: IReservation) => void
  reservation?: IReservation
  suite?: Suites_suites
}

export const ReservationModal = ({
  close,
  isOpen,
  refetch,
  reservation,
  suite
}: Props) => {

  const { t } = useTranslation()

  const [ form ] = Form.useForm()

  const [ deleteConfirmVisible, setDeleteConfirmVisible ] = useState<boolean>(false)
  const [ guestDrawerOpen, setGuestDrawerOpen ] = useState<boolean>(false)
  const [ guestOptions, setGuestOptions ] = useState<OptionsType[]>([])
  const [ reservationConfirmationMessage, setReservationConfirmationMessage ] = useState<string>()
  const [ reservationConfirmationVisible, setReservationConfirmationVisible ] = useState<boolean>(false)
  const [ roommateDrawerOpen, setRoommateDrawerOpen ] = useState<boolean>(false)
  const [ selectedGuest, setSelectedGuest ] = useState<GuestOption>()

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
    onError: (reason: ApolloError) => message.error(reason.message)
  })
  const [ getGuests, { loading: guestsLoading, data: guestsData } ] = useLazyQuery<Guests>(GUESTS, {
    onError: networkErrorHandler
  })
  const [ getRoommates, { loading: roommatesLoading, data: roommatesData, refetch: refetchRoommates } ] = useLazyQuery<Roommates, RoommatesVariables>(ROOMMATES, {
    onError: networkErrorHandler
  })

  const getReservationInput = (): ReservationInput => {
    const formData = form.getFieldsValue(true)
    const formDates: Array<Moment> = form.getFieldValue("dates")
    let from, to: Moment

    if (formDates === null) {
      from = moment()
      to = moment()
    } else {
      from = formDates[ 0 ]
      to = formDates[ 1 ]
    }
    return {
      fromDate: from.format(dateFormat),
      guestId: formData.guest,
      meal: formData.meal,
      notes: formData.notes,
      priceAccommodation: formData.priceAccommodation,
      priceExtra: formData.priceExtra,
      priceMeal: formData.priceMeal,
      priceMunicipality: formData.priceMunicipality,
      priceTotal: formData.priceTotal,
      purpose: formData.purpose,
      suiteId: reservation !== undefined ? +reservation.suite.id : null,
      toDate: to.format(dateFormat),
      type: formData.type
    }
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
        .then(() => {
          message.success(t("reservations.confirmation-sent", { email: reservation?.guest?.email }))
          closeModal()
        })
    }
  }

  const selectGuest = (guestId: string) => {
    const guest = guestsData?.guests?.find(guest => guest?.id === guestId)
    if (guest !== undefined && guest !== null) {
      setSelectedGuest(guest)
      getRoommates({ variables: { guestId: guest.id } })
    }
  }

  const addGuestOption = (guest: Guests_guests) => {
    setGuestOptions(guestOptions.concat({
      label: `${ guest.name } ${ guest.surname }`,
      value: guest.id
    }))
  }

  useEffect(() => {
    // Form instance is created on page load (before modal is open),
    // but the component is rendered only when modal is opened
    if (isOpen === true) {
      form.resetFields()
      setSelectedGuest(undefined)
      getGuests()
      if (reservation?.guest?.id !== undefined) {
        getRoommates({ variables: { guestId: String(reservation.guest.id) } })
      }
    }
  }, [ form, getGuests, getRoommates, isOpen, reservation ])

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
        footer={ [
          <RemoveButton
            deleteReservation={ (reservationId: string) => {
              deleteReservation({ variables: { reservationId } })
            } }
            key="remove"
            reservation={ reservation } />,
          <SendConfirmationButton
            key="confirmation"
            reservation={ reservation }
            send={ sendReservationConfirmation } />,
          <AddGuestButton
            key="guest"
            openGuestDrawer={ () => setGuestDrawerOpen(true) } />,
          <SubmitButton
            key="create"
            reservation={ reservation }
            submit={ () => {
              form.validateFields().then(submitForm)
            } } />
        ] }
        title={ t("reservations.form") }
        visible={ isOpen }>
        <Spin
          spinning={
            confirmationLoading
            || createLoading
            || deleteLoading
            || guestsLoading
            || roommatesLoading
            || updateLoading
          }
          tip={ `${ t("loading") }...` }>
          <Confirmation
            cancel={ closeModal }
            message={ reservationConfirmationMessage }
            reservation={ reservation }
            send={ sendReservationConfirmation }
            visible={ reservationConfirmationVisible } />
          <ReservationForm
            form={ form }
            guest={ selectedGuest }
            guestsData={ guestsData }
            openRoommateDrawer={ (guest: GuestOption) => {
              setSelectedGuest(guest)
              setRoommateDrawerOpen(true)
            } }
            reservation={ reservation }
            roommatesData={ roommatesData }
            selectGuest={ selectGuest }
            suite={ suite } />
        </Spin>
      </Modal>
      <GuestDrawer
        close={ () => setGuestDrawerOpen(false) }
        refetch={ (guest: Guests_guests) => addGuestOption(guest) }
        visible={ guestDrawerOpen } />
      <RoommatesDrawer
        close={ () => setRoommateDrawerOpen(false) }
        guest={ selectedGuest }
        refetch={ refetchRoommates }
        visible={ roommateDrawerOpen } />
    </>
  )
}