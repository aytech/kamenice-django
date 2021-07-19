import { useEffect, useState } from "react"
import { Button, DatePicker, Form, Input, message, Modal, Select, Space } from "antd"
import { Moment } from "moment"
import { ApolloError, useMutation, useQuery } from "@apollo/client"
import { Store } from "rc-field-form/lib/interface"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import "./styles.css"
import { OptionsType, ReservationRange, ReservationTypeKey } from "../../lib/Types"
import { ReservationFormHelper } from "../../lib/components/ReservationFormHelper"
import { FormHelper } from "../../lib/components/FormHelper"
import { Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import { CreateReservation, CreateReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/CreateReservation"
import { Guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { CREATE_RESERVATION } from "../../lib/graphql/mutations/Reservation"
import { GUESTS } from "../../lib/graphql/queries/Guests"
import { SuiteReservations_suiteReservations } from "../../lib/graphql/queries/Reservations/__generated__/SuiteReservations"

interface Props {
  close: () => void
  isOpen: boolean
  range: ReservationRange | undefined
  reservation: SuiteReservations_suiteReservations | undefined
  suite: Suites_suites
}

export const ReservationModal = ({
  close,
  isOpen,
  range,
  reservation,
  suite
}: Props) => {

  const { data: guestsQueryData } = useQuery<Guests>(GUESTS, {
    onError: () => {
      message.error("Chyba při načítání hostů, kontaktujte správce")
    }
  })
  const [ createReservation, { loading, error, data } ] = useMutation<CreateReservation, CreateReservationVariables>(CREATE_RESERVATION, {
    onCompleted: (data: CreateReservation): void => {
      message.success("Reservation created!")
    },
    onError: (error: ApolloError): void => {
      message.error("Oops, error: " + error.message)
    }
  })

  const [ guestOptions, setGuestOptions ] = useState<OptionsType[]>([])
  const dateFormat = "YYYY-MM-DD HH:mm"
  const [ form ] = Form.useForm()
  const initialValues: Store & { type: ReservationTypeKey } = {
    dates: range !== undefined ? [ range.from, range.to ] : [],
    guest: reservation === undefined ? null : reservation.guest.id,
    roommates: reservation === undefined ? [] : Array.from(reservation.roommates, roommate => roommate.id),
    type: reservation === undefined ? "BINDING" : reservation.type
  }

  const footerButtons = [
    <Button
      key="cancel"
      onClick={ close }>
      Zrušit
    </Button>,
    <Button
      key="ok"
      onClick={ () => {
        form.validateFields()
          .then(submitForm)
          .catch((error: string) => {
            console.log('Oops: ', error)
          })
      } }>
      { reservation === undefined ? "Uložit" : "Upravit" }
    </Button>
  ]

  const submitForm = (): void => {
    const formData = form.getFieldsValue(true)
    const [ from, to ]: Array<Moment> = form.getFieldValue("dates")
    const roommates = formData.roommates === undefined ? [] :
      Array.from(formData.roommates, (data: { id: number }) => data.id)

    const variables = {
      fromDate: from.format(dateFormat),
      guest: formData.guest,
      notes: formData.notes,
      purpose: formData.purpose,
      roommates: roommates,
      suite: +suite.id,
      toDate: to.format(dateFormat),
      type: formData.type
    }
    if (reservation === undefined) {
      createReservation({ variables: { data: variables } })
    } else {
      console.log('Update form')
    }
  }

  useEffect(() => {
    if (guestsQueryData?.guests !== undefined && guestsQueryData?.guests !== null) {
      setGuestOptions(Array.from(guestsQueryData?.guests, (guest: any): any => {
        return {
          label: `${ guest.name } ${ guest.surname }`,
          value: guest.id
        }
      }))
    }
  }, [ guestsQueryData ])

  // Reset form to update range, has to be after modal is opened,
  // otherwise the form might not be initialized
  useEffect(() => {
    if (isOpen === true) {
      form.resetFields()
    }
  }, [ form, isOpen, range ])

  return (
    <Modal
      footer={ footerButtons }
      onCancel={ close }
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
                    <Select options={ guestOptions } />
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