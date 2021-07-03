import React, { useEffect } from "react"
import { Button, DatePicker, Form, Modal, Select, Space } from "antd"
import locale from "antd/es/date-picker/locale/cs_CZ"
import { Moment } from "moment"
import { DrawerType, Guest, OptionsType, ReservationTypeKey, ReserveRange } from "../../lib/Types"
import { AntCalendarHelper } from "../../lib/components/AntCalendarHelper"
import { Store } from "rc-field-form/lib/interface"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import "./styles.css"
import { useState } from "react"
import { ReservationFormHelper } from "../../lib/components/ReservationFormHelper"

interface Props {
  close: () => void,
  guests: Guest[],
  isOpen: boolean,
  openDrawer: () => void,
  range: ReserveRange | undefined,
  setDrawerType: (type: DrawerType) => void,
  updateRange: (range: ReserveRange) => void
}
const { RangePicker } = DatePicker

export const ReservationModal = ({
  close,
  guests,
  isOpen,
  openDrawer,
  range,
  setDrawerType,
  updateRange
}: Props) => {

  const [ guestOptions, setGuestOptions ] = useState<OptionsType[]>(
    Array.from(guests, (guest: Guest): OptionsType => {
      return {
        label: `${ guest.name } ${ guest.surname }`,
        value: guest.id === undefined ? guest.email : guest.id
      }
    })
  )
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
        setDrawerType("user")
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
    close()
  }

  useEffect(() => {
    if (isOpen === true) {
      form.resetFields()
    }
  }, [ form, isOpen ])

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
          name="dates">
          <RangePicker
            format={ dateFormat }
            locale={ locale }
            showTime />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Host"
          name="guest"
          required
          rules={ ReservationFormHelper.guestValidators(form) }>
          <Select options={ guestOptions } />
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
                  disabled={ fields.length >= guests.length }
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
      </Form>
    </Modal>
  )
}