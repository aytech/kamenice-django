import { useEffect, useState } from "react"
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Select, Space, Spin } from "antd"
import { Moment } from "moment"
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client"
import { Store } from "rc-field-form/lib/interface"
import { CloseCircleOutlined, CloseOutlined, EditOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import "./styles.css"
import { IReservation, OptionsType, ReservationTypeKey } from "../../lib/Types"
import { ReservationFormHelper } from "../../lib/components/ReservationFormHelper"
import { FormHelper } from "../../lib/components/FormHelper"
import { ReservationInput } from "../../lib/graphql/globalTypes"
import { dateFormat } from "../../lib/Constants"
import { GuestDrawer } from "../GuestDrawer"
import { Guests, Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { GUESTS } from "../../lib/graphql/queries/Guests"
import { CreateReservation, CreateReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/CreateReservation"
import { CREATE_RESERVATION, DELETE_RESERVATION, UPDATE_RESERVATION } from "../../lib/graphql/mutations/Reservation"
import { UpdateReservation, UpdateReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/UpdateReservation"
import { DeleteReservation, DeleteReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/DeleteReservation"
import { SuitesWithReservations_reservations } from "../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations"
import { useTranslation } from "react-i18next"

interface Props {
  addOrUpdateReservation: (reservation?: SuitesWithReservations_reservations | null) => void
  close: () => void
  isOpen: boolean
  clearReservation: (reservationId?: string | null) => void
  reservation?: IReservation
}

export const ReservationModal = ({
  addOrUpdateReservation,
  close,
  isOpen,
  clearReservation,
  reservation,
}: Props) => {

  const { t } = useTranslation()

  const networkErrorHandler = (reason: ApolloError) => message.error(reason.message)

  const [ createReservation, { loading: createLoading } ] = useMutation<CreateReservation, CreateReservationVariables>(CREATE_RESERVATION, {
    onCompleted: (data: CreateReservation) => {
      addOrUpdateReservation(data.createReservation?.reservation)
      message.success(t("reservation-created"))
      close()
    },
    onError: networkErrorHandler
  })
  const [ deleteReservation, { loading: deleteLoading } ] = useMutation<DeleteReservation, DeleteReservationVariables>(DELETE_RESERVATION, {
    onCompleted: (data: DeleteReservation) => {
      clearReservation(data.deleteReservation?.reservation?.id)
      message.success(t("reservation-deleted"))
      close()
    },
    onError: networkErrorHandler
  })
  const [ updateReservation, { loading: updateLoading } ] = useMutation<UpdateReservation, UpdateReservationVariables>(UPDATE_RESERVATION, {
    onCompleted: (data: UpdateReservation) => {
      addOrUpdateReservation(data.updateReservation?.reservation)
      message.success(t("reservation-updated"))
      close()
    },
    onError: networkErrorHandler
  })
  const [ getGuests, { loading: guestsLoading, data: guestsData } ] = useLazyQuery<Guests>(GUESTS, {
    onError: networkErrorHandler
  })

  const [ deleteConfirmVisible, setDeleteConfirmVisible ] = useState<boolean>(false)
  const [ guestDrawerOpen, setGuestDrawerOpen ] = useState<boolean>(false)
  const [ guestOptions, setGuestOptions ] = useState<OptionsType[]>([])

  const [ form ] = Form.useForm()

  const initialValues: Store & { type?: ReservationTypeKey } = reservation !== undefined ? {
    dates: [ reservation.fromDate, reservation.toDate ],
    guest: reservation.guest === undefined ? null : reservation.guest.id,
    meal: reservation.meal,
    notes: reservation.notes,
    purpose: reservation.purpose,
    roommates: Array.from(reservation.roommates, roommate => {
      return { id: roommate.id }
    }),
    type: reservation.type
  } : { type: "NONBINDING" }

  const getGuestOption = (guest: Guests_guests) => {
    return {
      label: `${ guest.name } ${ guest.surname }`,
      value: guest.id
    }
  }

  const addGuestOption = (guest: Guests_guests) => {
    setGuestOptions(guestOptions.concat(getGuestOption(guest)))
  }

  const submitForm = (): void => {
    const formData = form.getFieldsValue(true)
    const [ from, to ]: Array<Moment> = form.getFieldValue("dates")
    const roommates = formData.roommates === undefined ? [] :
      Array.from(formData.roommates, (data: { id: number }) => data.id)

    const variables: ReservationInput = {
      fromDate: from.format(dateFormat),
      guest: formData.guest,
      meal: formData.meal,
      notes: formData.notes,
      purpose: formData.purpose,
      roommates: roommates,
      suite: reservation !== undefined ? +reservation.suite.id : null,
      toDate: to.format(dateFormat),
      type: formData.type
    }
    if (reservation !== undefined && reservation.id !== undefined) {
      updateReservation({ variables: { data: { id: String(reservation.id), ...variables } } })
    } else {
      createReservation({ variables: { data: { ...variables } } })
    }
  }

  const getRemoveButton = () => {
    return reservation !== undefined && reservation.id !== undefined ? (
      <Popconfirm
        cancelText="Ne"
        key="remove"
        okText="Ano"
        onConfirm={ () => {
          if (reservation.id !== undefined) {
            deleteReservation({ variables: { reservationId: String(reservation.id) } })
          }
        } }
        title="Odstranit rezervaci?">
        <Button
          className="cancel-button"
          danger
          icon={ <CloseCircleOutlined /> }>
          Odstranit
        </Button>
      </Popconfirm>
    ) : null
  }

  const footerButtons = [
    getRemoveButton(),
    <Button
      key="guest"
      onClick={ () => setGuestDrawerOpen(true) }>
      Přidat hosta
    </Button>,
    <Button
      key="create"
      icon={ reservation === undefined ? <PlusCircleOutlined /> : <EditOutlined /> }
      onClick={ () => {
        form.validateFields()
          .then(submitForm)
      } }
      type="primary">
      { (reservation !== undefined && reservation.id !== undefined) ? "Upravit" : "Uložit" }
    </Button>
  ]

  useEffect(() => {
    // Form instance is created on page load (before modal is open),
    // but the component is rendered only when modal is opened
    if (isOpen === true) {
      form.resetFields()
      getGuests()
    }
  }, [ form, getGuests, isOpen, reservation ])

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

  return (
    <>
      <Modal
        closeIcon={ (
          <Popconfirm
            onCancel={ () => setDeleteConfirmVisible(false) }
            onConfirm={ close }
            title="Zavřít formulář? Data ve formuláři budou ztracena"
            visible={ deleteConfirmVisible }>
            <CloseOutlined onClick={ () => {
              if (form.isFieldsTouched()) {
                setDeleteConfirmVisible(true)
              } else {
                setDeleteConfirmVisible(false)
                close()
              }
            } } />
          </Popconfirm>
        ) }
        footer={ footerButtons }
        title="Rezervační formulář"
        visible={ isOpen }>
        <Spin
          spinning={ guestsLoading || createLoading || deleteLoading || updateLoading }
          tip={ `${ t("loading") }...` }>
          <Form
            form={ form }
            initialValues={ initialValues }
            layout="vertical">
            <Form.Item
              label="Datum Rezervace"
              name="dates"
              required>
              <DatePicker.RangePicker
                format={ dateFormat }
                showTime />
            </Form.Item>
            <Form.Item
              hasFeedback
              label="Host"
              name="guest"
              required
              rules={ ReservationFormHelper.guestValidators(form) }>
              <Select
                filterOption={ (input, option): boolean => {
                  const match = option?.label?.toString().toLowerCase().indexOf(input.toLowerCase())
                  return match !== undefined && match >= 0
                } }
                options={ guestOptions }
                showSearch />
            </Form.Item>
            <Form.List name="roommates">
              { (fields, { add, remove }) => (
                <>
                  { fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      align="baseline"
                      className="roommate-list"
                      key={ key }>
                      <Form.Item
                        hasFeedback
                        { ...restField }
                        fieldKey={ [ fieldKey, 'first' ] }
                        name={ [ name, "id" ] }
                        rules={ ReservationFormHelper.roommateValidators(form) }>
                        <Select
                          options={ guestOptions }
                          showSearch />
                      </Form.Item>
                      <MinusCircleOutlined onClick={ () => {
                        remove(name)
                        form.validateFields()
                      } } />
                    </Space>
                  )) }
                  <Form.Item>
                    <Button
                      disabled={ fields.length >= guestOptions.length }
                      type="dashed"
                      onClick={ () => add() }
                      block
                      icon={ <PlusOutlined /> }>
                      Přidat spolubydlícího
                    </Button>
                  </Form.Item>
                </>
              ) }
            </Form.List>
            <Form.Item
              hasFeedback
              label="Typ Rezervace"
              name="type"
              required
              rules={ [ ReservationFormHelper.getRequiredRule("vyberte typ rezervace") ] }>
              <Select
                options={ ReservationFormHelper.reservationOptions } />
            </Form.Item>
            <Form.Item
              hasFeedback
              label="Strava"
              name="meal"
              required
              rules={ [ FormHelper.requiredRule ] }>
              <Select
                options={ ReservationFormHelper.mealOptions } />
            </Form.Item>
            <Form.Item
              label="Účel pobytu"
              name="purpose">
              <Input placeholder="účel pobytu" />
            </Form.Item>
            <Form.Item
              label="Poznámky"
              name="notes">
              <Input.TextArea
                placeholder="zadejte text"
                allowClear />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <GuestDrawer
        close={ () => setGuestDrawerOpen(false) }
        addGuest={ addGuestOption }
        visible={ guestDrawerOpen } />
    </>
  )
}