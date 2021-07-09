import { useEffect, useState } from "react"
import { Button, DatePicker, Form, Input, Modal, Select, Space } from "antd"
import { Moment } from "moment"
import { ApolloError } from "@apollo/client"
import { Store } from "rc-field-form/lib/interface"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import "./styles.css"
import { OptionsType, ReservationTypeKey, ReserveRange } from "../../lib/Types"
import { AntCalendarHelper } from "../../lib/components/AntCalendarHelper"
import { ReservationFormHelper } from "../../lib/components/ReservationFormHelper"
import { FormHelper } from "../../lib/components/FormHelper"
import { Guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"

interface Props {
  close: () => void
  data: Guests | undefined
  error: ApolloError | undefined
  getGuests: () => void
  isOpen: boolean
  loading: boolean
  openDrawer: () => void
  range: ReserveRange | undefined
  updateRange: (range: ReserveRange) => void
}

export const ReservationModal = ({
  close,
  data,
  error,
  getGuests,
  isOpen,
  loading,
  openDrawer,
  range,
  updateRange
}: Props) => {


  const [ guestOptions, setGuestOptions ] = useState<OptionsType[]>([])
  const dateFormat = "YYYY-MM-DD HH:mm"
  const [ form ] = Form.useForm()
  const initialValues: Store & { type: ReservationTypeKey } = {
    dates: AntCalendarHelper.getRangePickerDates(range),
    type: range === undefined ? "binding" : range.type
  }
  const footerButtons = [
    <Button
      key="create-user"
      onClick={ () => {
        openDrawer()
      } }
      style={ {
        float: "left"
      } }>
      Vytvořit Uživatele
    </Button>,
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
      OK
    </Button>
  ]
  const submitForm = (): void => {
    const [ from, to ]: Array<Moment> = form.getFieldValue("dates")
    const newRange: ReserveRange = {
      from: {
        year: from.year(),
        month: from.month() + 1,
        day: from.date(),
        hour: from.hour(),
        minute: from.minute()
      },
      to: {
        year: to.year(),
        month: to.month() + 1,
        day: to.date(),
        hour: to.hour(),
        minute: to.minute()
      },
      type: form.getFieldValue("type")
    }
    if (range !== undefined) newRange.id = range.id
    updateRange(newRange)
    console.log("Form: ", form.getFieldsValue(true))
    // close()
  }

  useEffect(() => {
    if (isOpen === true) {
      form.resetFields()
      getGuests()
    }
  }, [ form, getGuests, isOpen ])

  useEffect(() => {
    if (loading === false && data !== undefined && data.guests !== null) {
      setGuestOptions(Array.from(data.guests, (guest: any): any => {
        return {
          label: `${ guest.name } ${ guest.surname }`,
          value: guest.id
        }
      }));
    }
  }, [ loading, error, data ])

  return (
    <Modal
      onCancel={ close }
      title="Rezervační formulář"
      visible={ isOpen }
      footer={ footerButtons }>
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
          rules={ ReservationFormHelper.guestValidators(form) }
          validateStatus={ loading ? "validating" : "" }>
          <Select
            filterOption={ (input, option): boolean => {
              const match = option?.label?.toString().toLowerCase().indexOf(input.toLowerCase())
              return match !== undefined && match >= 0
            } }
            options={ guestOptions }
            showSearch
          />
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
          <Select
            options={ ReservationFormHelper.purposeOptions } />
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