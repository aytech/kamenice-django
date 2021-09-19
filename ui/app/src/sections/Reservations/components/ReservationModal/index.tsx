import { useEffect, useState } from "react"
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Select, Spin, Typography } from "antd"
import { Moment } from "moment"
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client"
import { Store } from "rc-field-form/lib/interface"
import { CalculatorOutlined, CloseOutlined, EyeInvisibleOutlined, EyeOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import "./styles.css"
import { IReservation, OptionsType, ReservationInputExtended, ReservationTypeKey } from "../../../../lib/Types"
import { ReservationFormHelper } from "../../../../lib/components/ReservationFormHelper"
import { FormHelper } from "../../../../lib/components/FormHelper"
import { ReservationInput } from "../../../../lib/graphql/globalTypes"
import { dateFormat } from "../../../../lib/Constants"
import { GuestDrawer } from "../../../Guests/components/GuestDrawer"
import { Guests, Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { GUESTS } from "../../../../lib/graphql/queries/Guests"
import { CreateReservation, CreateReservationVariables } from "../../../../lib/graphql/mutations/Reservation/__generated__/CreateReservation"
import { CREATE_RESERVATION, DELETE_RESERVATION, SEND_CONFIRMATION, UPDATE_RESERVATION } from "../../../../lib/graphql/mutations/Reservation"
import { UpdateReservation, UpdateReservationVariables } from "../../../../lib/graphql/mutations/Reservation/__generated__/UpdateReservation"
import { DeleteReservation, DeleteReservationVariables } from "../../../../lib/graphql/mutations/Reservation/__generated__/DeleteReservation"
import { SuitesWithReservations_reservations } from "../../../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations"
import { useTranslation } from "react-i18next"
import { Suites_suites } from "../../../../lib/graphql/queries/Suites/__generated__/Suites"
import { Prices } from "../../../../lib/Prices"
import moment from "moment"
import { Roommates, RoommatesVariables, Roommates_roommates } from "../../../../lib/graphql/queries/Roommates/__generated__/Roommates"
import { ROOMMATES } from "../../../../lib/graphql/queries/Roommates"
import { RoommatesDrawer } from "../../../Guests/components/RoommatesDrawer"
import { Roommates as RoommatesItem } from "./components/Roommates"
import { AddGuestButton, RemoveButton, SendConfirmationButton, SubmitButton } from "./components/FooterActions"
import { Confirmation } from "./components/Confirmation"
import { SendConfirmation, SendConfirmationVariables } from "../../../../lib/graphql/mutations/Reservation/__generated__/SendConfirmation"

interface Props {
  addOrUpdateReservation: (reservation?: SuitesWithReservations_reservations | null) => void
  close: () => void
  isOpen: boolean
  clearReservation: (reservationId?: string | null) => void
  reservation?: IReservation
  suite?: Suites_suites
}

export const ReservationModal = ({
  addOrUpdateReservation,
  close,
  isOpen,
  clearReservation,
  reservation,
  suite
}: Props) => {

  const { t } = useTranslation()

  const [ form ] = Form.useForm()

  const [ additionalInfoVisible, setAdditionalInfoVisible ] = useState<boolean>(false)
  const [ deleteConfirmVisible, setDeleteConfirmVisible ] = useState<boolean>(false)
  const [ guestDrawerOpen, setGuestDrawerOpen ] = useState<boolean>(false)
  const [ guestOptions, setGuestOptions ] = useState<OptionsType[]>([])
  const [ pricesVisible, setPricesVisible ] = useState<boolean>(false)
  const [ reservationConfirmationMessage, setReservationConfirmationMessage ] = useState<string>()
  const [ reservationConfirmationVisible, setReservationConfirmationVisible ] = useState<boolean>(false)
  const [ roommateDrawerOpen, setRoommateDrawerOpen ] = useState<boolean>(false)
  const [ selectedGuest, setSelectedGuest ] = useState<Guests_guests>()

  const networkErrorHandler = (reason: ApolloError) => message.error(reason.message)

  const [ createReservation, { loading: createLoading } ] = useMutation<CreateReservation, CreateReservationVariables>(CREATE_RESERVATION, {
    onCompleted: (data: CreateReservation) => {
      addOrUpdateReservation(data.createReservation?.reservation)
      setReservationConfirmationMessage(t("reservations.updated-info", { email: data.createReservation?.reservation?.guest.email }))
      setReservationConfirmationVisible(true)
      message.success(t("reservations.created"))
    },
    onError: networkErrorHandler
  })
  const [ deleteReservation, { loading: deleteLoading } ] = useMutation<DeleteReservation, DeleteReservationVariables>(DELETE_RESERVATION, {
    onCompleted: (data: DeleteReservation) => {
      clearReservation(data.deleteReservation?.reservation?.id)
      message.success(t("reservations.deleted"))
      close()
    },
    onError: networkErrorHandler
  })
  const [ updateReservation, { loading: updateLoading } ] = useMutation<UpdateReservation, UpdateReservationVariables>(UPDATE_RESERVATION, {
    onCompleted: (data: UpdateReservation) => {
      addOrUpdateReservation(data.updateReservation?.reservation)
      setReservationConfirmationMessage(t("reservations.updated-info", { email: data.updateReservation?.reservation?.guest.email }))
      setReservationConfirmationVisible(true)
      message.success(t("reservations.updated"))
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

  const getGuestOption = (guest: Guests_guests | Roommates_roommates) => {
    return {
      label: `${ guest.name } ${ guest.surname }`,
      value: guest.id
    }
  }

  const initialValues: Store & { type?: ReservationTypeKey } = reservation !== undefined ? {
    dates: [ reservation.fromDate, reservation.toDate ],
    guest: reservation.guest === undefined ? null : reservation.guest.id,
    meal: reservation.meal,
    notes: reservation.notes,
    priceAccommodation: reservation.priceAccommodation,
    priceExtra: reservation.priceAccommodation,
    priceMeal: reservation.priceMeal,
    priceMunicipality: reservation.priceMunicipality,
    priceTotal: reservation.priceTotal,
    purpose: reservation.purpose,
    roommates: [],
    type: reservation.type
  } : { type: "NONBINDING" }

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
    const roommates = formData.roommates === undefined ? [] :
      Array.from(formData.roommates, (data: { id: number }) => data.id)
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
      roommatesIds: roommates,
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
          setReservationConfirmationVisible(false)
          close()
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
    setGuestOptions(guestOptions.concat(getGuestOption(guest)))
  }

  const calculatePrices = () => {
    if (suite !== undefined && reservation !== undefined) {
      const input: ReservationInput & ReservationInputExtended = getReservationInput()
      input.suite = suite
      input.roommates = []
      if (input.guestId !== undefined && input.guestId !== null) {
        input.guest = guestsData?.guests?.find(guest => guest?.id === input.guestId)
      }
      if (input.roommatesIds !== undefined && input.roommatesIds !== null && input.roommatesIds.length > 0) {
        input.roommatesIds.forEach(id => {
          const roommate = guestsData?.guests?.find(guest => guest?.id === String(id))
          if (roommate !== undefined && roommate !== null) {
            input.roommates?.push(roommate)
          }
        })
      }
      form.setFieldsValue(Prices.calculatePrice(input))
    }
  }

  useEffect(() => {
    // Form instance is created on page load (before modal is open),
    // but the component is rendered only when modal is opened
    if (isOpen === true) {
      form.resetFields()
      getGuests()
      if (reservation?.guest?.id !== undefined) {
        getRoommates({ variables: { guestId: String(reservation.guest.id) } })
      }
    }
  }, [ form, getGuests, getRoommates, isOpen, reservation ])

  useEffect(() => {
    if (guestsData !== undefined && guestsData.guests !== null) {
      const options: OptionsType[] = []
      guestsData.guests.forEach((guest: Guests_guests | null) => {
        if (guest !== null) {
          options.push(getGuestOption(guest))
        }
      })
      setGuestOptions(options)
    }
  }, [ guestsData ])

  const formLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 16
    }
  }

  return (
    <>
      <Modal
        className="reservation-modal"
        closeIcon={ (
          <Popconfirm
            onCancel={ () => setDeleteConfirmVisible(false) }
            onConfirm={ () => {
              setDeleteConfirmVisible(false)
              setTimeout(close)
            } }
            title={ t("forms.close-dirty") }
            visible={ deleteConfirmVisible }>
            <CloseOutlined onClick={ () => {
              if (form.isFieldsTouched()) {
                setDeleteConfirmVisible(true)
              } else {
                close()
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
            cancel={ () => {
              setReservationConfirmationMessage(undefined)
              setReservationConfirmationVisible(false)
              close()
            } }
            message={ reservationConfirmationMessage }
            reservation={ reservation }
            send={ sendReservationConfirmation }
            visible={ reservationConfirmationVisible } />
          <Form
            form={ form }
            initialValues={ initialValues }
            { ...formLayout }>
            <Form.Item
              label={ t("reservations.date") }
              name="dates"
              required>
              <DatePicker.RangePicker
                format={ dateFormat }
                showTime />
            </Form.Item>
            <Form.Item
              hasFeedback
              label={ t("guests.name") }
              name="guest"
              required
              rules={ [
                {
                  message: t("forms.choose-guest"),
                  required: true
                }
              ] }>
              <Select
                filterOption={ (input, option): boolean => {
                  const match = option?.label?.toString().toLowerCase().indexOf(input.toLowerCase())
                  return match !== undefined && match >= 0
                } }
                onChange={ (guestId: string) => {
                  selectGuest(guestId)
                } }
                options={ guestOptions }
                showSearch />
            </Form.Item>
            <RoommatesItem
              roommates={ roommatesData } />
            <Form.Item wrapperCol={ { offset: 8, span: 16 } }>
              <Button
                block
                disabled={ selectedGuest === undefined }
                icon={ <UsergroupAddOutlined /> }
                onClick={ () => setRoommateDrawerOpen(true) }
                type="dashed">
                { t("guests.roommate") }
              </Button>
            </Form.Item>
            <Form.Item
              hasFeedback
              label={ t("reservations.type") }
              name="type"
              required
              rules={ [ ReservationFormHelper.getRequiredRule(t("reservations.choose-type")) ] }>
              <Select
                options={ ReservationFormHelper.reservationOptions } />
            </Form.Item>
            <Form.Item
              hasFeedback
              label={ t("reservations.meal") }
              name="meal"
              required
              rules={ [ FormHelper.requiredRule(t("forms.field-required")) ] }>
              <Select options={ ReservationFormHelper.mealOptions } />
            </Form.Item>
            <Form.Item
              hidden={ !additionalInfoVisible }
              label={ t("reservations.purpose") }
              name="purpose">
              <Input placeholder={ t("reservations.purpose") } />
            </Form.Item>
            <Form.Item
              hidden={ !additionalInfoVisible }
              label={ t("reservations.notes") }
              name="notes">
              <Input.TextArea
                placeholder={ t("forms.enter-text") }
                allowClear />
            </Form.Item>
            <Form.Item wrapperCol={ { offset: 8, span: 16 } }>
              <Button
                block
                onClick={ () => setAdditionalInfoVisible(!additionalInfoVisible) }
                type="dashed"
                icon={ additionalInfoVisible ? <EyeInvisibleOutlined /> : <EyeOutlined /> }>
                { additionalInfoVisible ? t("reservations.hide-info") : t("reservations.show-info") }
              </Button>
            </Form.Item>
            {/* @TODO: add tooltips explaining price calculation */ }
            <Form.Item
              hidden={ !pricesVisible }
              label={ t("reservations.price-room") }>
              <Typography.Text>
                <strong>
                  { suite?.priceBase } { t("rooms.currency") }
                </strong>
              </Typography.Text>
            </Form.Item>
            <Form.Item
              hidden={ !pricesVisible }
              label={ t("reservations.price-accommodation") }
              name="priceAccommodation">
              <Input addonBefore={ t("rooms.currency") } type="number" />
            </Form.Item>
            <Form.Item
              hidden={ !pricesVisible }
              label={ t("reservations.price-extra") }
              name="priceExtra">
              <Input addonBefore={ t("rooms.currency") } type="number" />
            </Form.Item>
            <Form.Item
              hidden={ !pricesVisible }
              label={ t("reservations.price-meal") }
              name="priceMeal">
              <Input addonBefore={ t("rooms.currency") } type="number" />
            </Form.Item>
            <Form.Item
              hidden={ !pricesVisible }
              label={ t("reservations.price-municipality") }
              name="priceMunicipality">
              <Input addonBefore={ t("rooms.currency") } type="number" />
            </Form.Item>
            <Form.Item
              hidden={ !pricesVisible }
              label={ <strong>{ t("reservations.price-total") }</strong> }
              name="priceTotal">
              <Input addonBefore={ t("rooms.currency") } type="number" />
            </Form.Item>
            <Form.Item
              hidden={ !pricesVisible }
              wrapperCol={ { offset: 8, span: 16 } }>
              <Button
                block
                icon={ <CalculatorOutlined /> }
                onClick={ calculatePrices }>
                Calculate prices
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={ { offset: 8, span: 16 } }>
              <Button
                block
                onClick={ () => setPricesVisible(!pricesVisible) }
                type="dashed"
                icon={ pricesVisible ? <EyeInvisibleOutlined /> : <EyeOutlined /> }>
                { pricesVisible ? t("reservations.hide-prices") : t("reservations.show-prices") }
              </Button>
            </Form.Item>
          </Form>
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