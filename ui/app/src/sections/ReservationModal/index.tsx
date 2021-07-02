import React, { useEffect, useState } from "react"
import { Button, DatePicker, Form, Modal, Select, TimePicker } from "antd"
import locale from "antd/es/date-picker/locale/cs_CZ"
import { Reservation } from "../../lib/components/Reservation"
import { ReserveDay, ReserveRange } from "../../lib/components/Room"
import { Moment } from "moment"
import { RangeValue } from "rc-picker/lib/interface"
import moment from "moment"
import { defaultArrivalHour, defaultDepartureHour } from "../../lib/Constants"
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

  const [ selectedFromDay, setSelectedFromDay ] = useState<ReserveDay>()
  const [ selectedToDay, setSelectedToDay ] = useState<ReserveDay>()
  const [ form ] = Form.useForm()
  const initialValues: Store = {
    type: range === undefined ? "binding" : range.type
  }
  const dateFormat = "YYYY-MM-DD"
  const timeFormat = "HH:mm"

  useEffect(() => {
    form.resetFields()
  })

  const getRangePicker = () => {
    let from: Moment, to: Moment
    if (selectedFromDay !== undefined) {
      const { year, month, day } = selectedFromDay
      from = moment([ year, month - 1, day ])
    } else {
      from = moment()
    }
    if (selectedToDay !== undefined) {
      const { year, month, day } = selectedToDay
      to = moment([ year, month - 1, day ])
    } else {
      to = moment()
    }
    return (
      <RangePicker
        value={ [
          moment(from, dateFormat),
          moment(to, dateFormat)
        ] }
        format={ dateFormat }
        locale={ locale }
        onChange={ (newRange: RangeValue<Moment>) => {
          if (newRange !== null
            && newRange[ 0 ] !== null
            && newRange[ 1 ] !== null) {
            setSelectedFromDay({
              year: newRange[ 0 ].year(),
              month: newRange[ 0 ].month() + 1,
              day: newRange[ 0 ].date(),
              hour: selectedFromDay?.hour === undefined ? defaultArrivalHour : selectedFromDay.hour,
              minute: selectedFromDay?.minute === undefined ? 0 : selectedFromDay.minute
            })
            setSelectedToDay({
              year: newRange[ 1 ].year(),
              month: newRange[ 1 ].month() + 1,
              day: newRange[ 1 ].date(),
              hour: selectedToDay?.hour === undefined ? defaultDepartureHour : selectedToDay.hour,
              minute: selectedToDay?.minute === undefined ? 0 : selectedToDay.minute
            })
          }
        } } />
    )
  }

  const getDefaultTime = (day: ReserveDay | undefined): Moment | undefined => {
    if (day !== undefined && day.hour !== undefined && day.minute !== undefined) {
      return moment([ day.year, day.month, day.day, day.hour, day.minute ])
    }
    return undefined
  }

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
          disabled={
            selectedFromDay === undefined
            || selectedToDay === undefined
          }
          key="ok"
          onClick={ () => {
            if (selectedFromDay !== undefined && selectedToDay !== undefined) {
              const newRange: ReserveRange = {
                from: selectedFromDay,
                to: selectedToDay,
                type: form.getFieldValue("type")
              }
              if (range !== undefined && range.id !== undefined) {
                newRange.id = range.id
              }
              updateRange(newRange)
              form.validateFields()
                .then(() => {
                  console.log('Submit form: ', form.getFieldsValue(true))
                })
                .catch((error: string) => {
                  console.log('Oops: ', error)
                })
            }
            // form.resetFields()
            // close()
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
          { getRangePicker() }
        </Form.Item>
        <Form.Item
          label="Čas příjezdu"
          name="arrival">
          <TimePicker
            value={ getDefaultTime(selectedFromDay) }
            format={ timeFormat }
            locale={ locale }
            onChange={ (value: Moment | null) => {
              if (value !== null && selectedFromDay !== undefined) {
                const from = selectedFromDay
                from.hour = value.hour()
                from.minute = value.minute()
                setSelectedFromDay(from)
              }
            } }
          />
        </Form.Item>
        <Form.Item
          label="Čas odjezdu"
          name="departure">
          <TimePicker
            value={ getDefaultTime(selectedToDay) }
            format={ timeFormat }
            onChange={ (value: Moment | null) => {
              if (value !== null && selectedToDay !== undefined) {
                const to = selectedToDay
                to.hour = value.hour()
                to.minute = value.minute()
                setSelectedToDay(to)
              }
            } }
          />
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