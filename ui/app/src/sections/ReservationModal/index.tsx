import { useEffect, useState } from "react"
import { Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Space } from "antd"
import { Moment } from "moment"
import { ApolloError } from "@apollo/client"
import { Store } from "rc-field-form/lib/interface"
import { CloseCircleOutlined, CloseOutlined, EditOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import "./styles.css"
import { IReservation, OptionsType, ReservationTypeKey } from "../../lib/Types"
import { ReservationFormHelper } from "../../lib/components/ReservationFormHelper"
import { FormHelper } from "../../lib/components/FormHelper"
import { ReservationInput } from "../../lib/graphql/globalTypes"
import { dateFormat } from "../../lib/Constants"
import { GuestDrawer } from "../GuestDrawer"
import { Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"

interface Props {
  close: () => void
  createReservation: (variables: any) => void
  guests?: (Guests_guests | null)[] | null
  isOpen: boolean
  reauthenticate: (callback: () => void, errorHandler?: (reason: ApolloError) => void) => void
  removeReservation: (reservationId: string | number) => void
  reservation?: IReservation
  updateReservation: (reservationId: string, variables: any) => void
}

export const ReservationModal = ({
  close,
  createReservation,
  guests,
  isOpen,
  reauthenticate,
  removeReservation,
  reservation,
  updateReservation
}: Props) => {

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

  const closeModal = () => {
    form.resetFields()
    setDeleteConfirmVisible(false)
    setTimeout(() => { close() })
  }

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
      updateReservation(String(reservation.id), variables)
    } else {
      createReservation(variables)
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
            removeReservation(reservation.id)
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
    }
  }, [ form, isOpen, reservation ])

  useEffect(() => {
    if (guests !== undefined && guests !== null) {
      const options: OptionsType[] = []
      guests.forEach((guest: Guests_guests | null) => {
        if (guest !== null) {
          options.push(getGuestOption(guest))
        }
      })
      setGuestOptions(options)
    }
  }, [ guests ])

  return (
    <>
      <Modal
        closeIcon={ (
          <Popconfirm
            onCancel={ () => setDeleteConfirmVisible(false) }
            onConfirm={ closeModal }
            title="Zavřít formulář? Data ve formuláři budou ztracena"
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
        footer={ footerButtons }
        title="Rezervační formulář"
        visible={ isOpen }>
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
      </Modal>
      <GuestDrawer
        close={ () => setGuestDrawerOpen(false) }
        reauthenticate={ reauthenticate }
        addGuest={ addGuestOption }
        visible={ guestDrawerOpen } />
    </>
  )
}