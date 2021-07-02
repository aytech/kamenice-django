import React, { useEffect } from "react"
import { Button, DatePicker, Form, Modal, Select } from "antd"
import locale from "antd/es/date-picker/locale/cs_CZ"
import { Reservation } from "../../lib/components/Reservation"
import { ReserveRange } from "../../lib/components/Room"
import { Moment } from "moment"
import moment from "moment"
import { DrawerType } from "../../lib/Types"
import { Store } from "rc-field-form/lib/interface"

interface Props {
  close: () => void,
  isOpen: boolean,
  openDrawer: () => void,
  range: ReserveRange | undefined,
  setDrawerType: (type: DrawerType) => void,
  updateRange: (range: ReserveRange) => void
}
const { RangePicker } = DatePicker

export const ReservationModal = ({
  close,
  isOpen,
  openDrawer,
  range,
  setDrawerType,
  updateRange
}: Props) => {

  const getRangePickerDates = (range: ReserveRange | undefined): Array<Moment | null> => {
    if (range === undefined) {
      return []
    }
    const fromDate = [ range.from.year, range.from.month - 1, range.from.day ]
    const toDate = [ range.to.year, range.to.month - 1, range.to.day ]
    if (range.from.hour !== undefined) fromDate.push(range.from.hour)
    if (range.from.minute !== undefined) fromDate.push(range.from.minute)
    if (range.to.hour !== undefined) toDate.push(range.to.hour)
    if (range.to.minute !== undefined) toDate.push(range.to.minute)
    return [
      moment(fromDate),
      moment(toDate)
    ]
  }
  const [ form ] = Form.useForm()
  const initialValues: Store = {
    dates: getRangePickerDates(range),
    type: range === undefined ? "binding" : range.type
  }
  const dateFormat = "YYYY-MM-DD HH:mm"

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
      footer={ [
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
              .then(() => {
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
              })
              .catch((error: string) => {
                console.log('Oops: ', error)
              })
            close()
          } }>
          OK
        </Button>
      ] }>
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
          label="Typ Rezervace"
          name="type">
          <Select>
            <Select.Option value="binding">
              { Reservation.getType("binding") }
            </Select.Option>
            <Select.Option value="nonbinding">
              { Reservation.getType("nonbinding") }
            </Select.Option>
            <Select.Option value="accommodated">
              { Reservation.getType("accommodated") }
            </Select.Option>
            <Select.Option value="inhabited">
              { Reservation.getType("inhabited") }
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}