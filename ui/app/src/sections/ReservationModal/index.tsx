import { useEffect, useState } from "react"
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Select, Space } from "antd"
import { Moment } from "moment"
import { ApolloError, ApolloQueryResult, useMutation } from "@apollo/client"
import { Store } from "rc-field-form/lib/interface"
import { CloseCircleOutlined, CloseOutlined, EditOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import "./styles.css"
import { OptionsType, ReservationRange, ReservationTypeKey } from "../../lib/Types"
import { ReservationFormHelper } from "../../lib/components/ReservationFormHelper"
import { FormHelper } from "../../lib/components/FormHelper"
import { Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import { CreateReservation, CreateReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/CreateReservation"
import { Guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { CREATE_RESERVATION, DELETE_RESERVATION, UPDATE_RESERVATION } from "../../lib/graphql/mutations/Reservation"
import { SuiteReservations, SuiteReservations_suiteReservations } from "../../lib/graphql/queries/Reservations/__generated__/SuiteReservations"
import { UpdateReservation, UpdateReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/UpdateReservation"
import { ReservationInput } from "../../lib/graphql/globalTypes"
import { DeleteReservation, DeleteReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/DeleteReservation"

interface Props {
  close: () => void
  guests: Guests | undefined
  isOpen: boolean
  openGuestDrawer: () => void
  range: ReservationRange | undefined
  refetchReservations: (variables?: Partial<SuiteReservations>) => Promise<ApolloQueryResult<SuiteReservations>>
  reservation: SuiteReservations_suiteReservations | undefined
  suite: Suites_suites
}

export const ReservationModal = ({
  close,
  guests,
  isOpen,
  openGuestDrawer,
  range,
  refetchReservations,
  reservation,
  suite
}: Props) => {

  const [ createReservation ] = useMutation<CreateReservation, CreateReservationVariables>(CREATE_RESERVATION, {
    onCompleted: (): void => {
      message.success("Rezervace byla vytvořena!")
    },
    onError: (error: ApolloError): void => {
      message.error(error.message)
    }
  })
  const [ updateReservation ] = useMutation<UpdateReservation, UpdateReservationVariables>(UPDATE_RESERVATION, {
    onCompleted: () => {
      message.success("Rezervace byla aktualizována!")
    },
    onError: (error: ApolloError) => {
      message.error(error.message)
    }
  })
  const [ deleteReservation ] = useMutation<DeleteReservation, DeleteReservationVariables>(DELETE_RESERVATION, {
    onCompleted: () => {
      message.success("Rezervace byla odstraněna!")
      refetchReservations()
      close()
    },
    onError: (error: ApolloError) => {
      message.error(error)
    }
  })

  const [ deleteConfirmVisible, setDeleteConfirmVisible ] = useState<boolean>(false)
  const [ guestOptions, setGuestOptions ] = useState<OptionsType[]>([])
  const dateFormat = "YYYY-MM-DD HH:mm"
  const [ form ] = Form.useForm()
  const initialValues: Store & { type: ReservationTypeKey } = {
    dates: range !== undefined ? [ range.from, range.to ] : [],
    guest: reservation === undefined ? null : reservation.guest.id,
    meal: reservation === undefined ? null : reservation.meal,
    notes: reservation === undefined ? null : reservation.notes,
    purpose: reservation === undefined ? null : reservation.purpose,
    roommates: reservation === undefined ? [] : Array.from(reservation.roommates, roommate => {
      return { id: roommate.id }
    }),
    type: reservation === undefined ? "BINDING" : reservation.type
  }

  const closeModal = () => {
    setDeleteConfirmVisible(false)
    setTimeout(() => { close() })
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
      suite: +suite.id,
      toDate: to.format(dateFormat),
      type: formData.type
    }
    if (reservation !== undefined && reservation.id !== undefined) {
      updateReservation({ variables: { data: { ...variables, id: reservation.id } } })
    } else {
      createReservation({ variables: { data: variables } })
    }
    refetchReservations()
    close()
  }

  const getRemoveButton = () => {
    return reservation !== undefined ? (
      <Popconfirm
        cancelText="Ne"
        key="remove"
        okText="Ano"
        onConfirm={ () => {
          deleteReservation({ variables: { reservationId: reservation.id } })
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
      { reservation === undefined ? "Uložit" : "Upravit" }
    </Button>
  ]

  useEffect(() => {
    if (guests?.guests !== undefined && guests?.guests !== null) {
      setGuestOptions(Array.from(guests?.guests, (guest: any): any => {
        return {
          label: `${ guest.name } ${ guest.surname }`,
          value: guest.id
        }
      }))
    }
  }, [ guests ])

  // Reset form to update range, has to be after modal is opened,
  // otherwise the form might not be initialized
  useEffect(() => {
    if (isOpen === true) {
      form.resetFields()
    }
  }, [ form, isOpen, range ])

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
                  { console.log(name) }
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