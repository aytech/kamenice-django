import { useEffect, useState } from "react"
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Select, Space } from "antd"
import { Moment } from "moment"
import { ApolloError, ApolloQueryResult, OperationVariables, useMutation } from "@apollo/client"
import { Store } from "rc-field-form/lib/interface"
import { CloseCircleOutlined, CloseOutlined, EditOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import "./styles.css"
import { IReservation, OptionsType, ReservationTypeKey } from "../../lib/Types"
import { ReservationFormHelper } from "../../lib/components/ReservationFormHelper"
import { FormHelper } from "../../lib/components/FormHelper"
import { CreateReservation, CreateReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/CreateReservation"
import { Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { CREATE_RESERVATION, DELETE_RESERVATION, UPDATE_RESERVATION } from "../../lib/graphql/mutations/Reservation"
import { ReservationInput } from "../../lib/graphql/globalTypes"
import { dateFormat, errorMessages } from "../../lib/Constants"
import { UpdateReservation, UpdateReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/UpdateReservation"
import { DeleteReservation, DeleteReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/DeleteReservation"

interface Props {
  close: () => void
  guests: (Guests_guests | null)[] | undefined | null
  isOpen: boolean
  reauthenticate: (callback: () => void, errorHandler?: (reason: ApolloError) => void) => void
  openGuestDrawer: () => void
  refetch: ((variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<any>>) | undefined
  reservation: IReservation | undefined
}

export const ReservationModal = ({
  close,
  guests,
  isOpen,
  reauthenticate,
  openGuestDrawer,
  refetch,
  reservation
}: Props) => {

  const [ createReservation ] = useMutation<CreateReservation, CreateReservationVariables>(CREATE_RESERVATION)
  const [ updateReservation ] = useMutation<UpdateReservation, UpdateReservationVariables>(UPDATE_RESERVATION)
  const [ deleteReservation ] = useMutation<DeleteReservation, DeleteReservationVariables>(DELETE_RESERVATION)

  const [ deleteConfirmVisible, setDeleteConfirmVisible ] = useState<boolean>(false)
  const [ guestOptions, setGuestOptions ] = useState<OptionsType[]>([])

  const [ form ] = Form.useForm()

  const initialValues: Store & { type: ReservationTypeKey } = reservation !== undefined ? {
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

  const refetchData = () => {
    if (refetch !== undefined) {
      refetch()
    }
  }

  const errorHandler = (reason: ApolloError, callback: () => void) => {
    if (reason.message === errorMessages.signatureExpired) {
      reauthenticate(callback, (reason: ApolloError) => message.error(reason.message))
    } else {
      message.error(reason.message)
    }
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
      const submitUpdatedReservation =
        () => updateReservation({ variables: { data: { ...variables, id: String(reservation.id) } } })
          .then(() => {
            message.success("Rezervace byla aktualizována!")
            refetchData()
            closeModal()
          })
      submitUpdatedReservation()
        .catch((reason: ApolloError) => errorHandler(reason, submitUpdatedReservation))
    } else {
      const submitNewReservation = () => createReservation({ variables: { data: variables } })
        .then(() => {
          message.success("Rezervace byla vytvořena!")
          refetchData()
          closeModal()
        })
      submitNewReservation()
        .catch((reason: ApolloError) => errorHandler(reason, submitNewReservation))
    }
  }

  const removeReservation = () => {
    const handler = () => deleteReservation({ variables: { reservationId: String(reservation?.id) } })
      .then(() => {
        message.success("Rezervace byla odstraněna!")
        refetchData()
        closeModal()
      })
    handler().catch((reason: ApolloError) => errorHandler(reason, handler))
  }

  const getRemoveButton = () => {
    return reservation !== undefined ? (
      <Popconfirm
        cancelText="Ne"
        key="remove"
        okText="Ano"
        onConfirm={ removeReservation }
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
      onClick={ openGuestDrawer }>
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
    if (guests !== undefined && guests !== null) {
      setGuestOptions(Array.from(guests, (guest: any): any => {
        return {
          label: `${ guest.name } ${ guest.surname }`,
          value: guest.id
        }
      }))
    }
  }, [ guests ])

  return (
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
    </Modal >
  )
}