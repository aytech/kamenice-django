import React, { useEffect, useState } from "react"
import { Button, DatePicker, Dropdown, Form, Menu, Modal, TimePicker } from "antd"
import locale from "antd/es/date-picker/locale/cs_CZ"
import { Reservation, ReservationTypeKey } from "../../lib/components/Reservation"
import { DownOutlined } from "@ant-design/icons"
import { ReserveDay, ReserveRange } from "../../lib/components/Room"
import { Moment } from "moment"
import { RangeValue } from "rc-picker/lib/interface"
import moment from "moment"

interface Props {
  close: () => void,
  isOpen: boolean,
  range: ReserveRange | undefined,
  updateRange: (range: ReserveRange) => void
}
const { RangePicker } = DatePicker

export const ReservationModal = ({
  close,
  isOpen,
  range,
  updateRange
}: Props) => {

  const [ selectedFromDay, setSelectedFromDay ] = useState<ReserveDay>()
  const [ selectedToDay, setSelectedToDay ] = useState<ReserveDay>()
  const [ selectedType, setSelectedType ] = useState<ReservationTypeKey>("binding")
  const dateFormat = "YYYY-MM-DD"

  useEffect(() => {
    if (range !== undefined) {
      setSelectedFromDay(range.from)
      setSelectedToDay(range.to)
    }
  }, [ range ])

  const getRangePicker = () => {
    let from: Moment, to: Moment
    if (range !== undefined) {
      from = moment([ range.from.year, range.from.month - 1, range.from.day ])
      to = moment([ range.to.year, range.to.month - 1, range.to.day ])
    } else {
      from = moment()
      to = moment()
    }
    return (
      <RangePicker
        defaultValue={ [
          moment(from, dateFormat),
          moment(to, dateFormat) ]
        }
        format={ dateFormat }
        locale={ locale }
        onChange={ (newRange: RangeValue<Moment>) => {
          if (newRange !== null
            && newRange[ 0 ] !== null
            && newRange[ 1 ] !== null) {
            setSelectedFromDay({
              year: newRange[ 0 ].year(),
              month: newRange[ 0 ].month() + 1,
              day: newRange[ 0 ].date()
            })
            setSelectedToDay({
              year: newRange[ 1 ].year(),
              month: newRange[ 1 ].month() + 1,
              day: newRange[ 1 ].date()
            })
          }
        } } />
    )
  }

  const reservationTypeMenu = (
    <Menu>
      <Menu.Item key={ Reservation.getType("binding") } onClick={ () => { setSelectedType("binding") } }>
        { Reservation.getType("binding") }
      </Menu.Item>
      <Menu.Item key={ Reservation.getType("nonbinding") } onClick={ () => { setSelectedType("nonbinding") } }>
        { Reservation.getType("nonbinding") }
      </Menu.Item>
      <Menu.Item key={ Reservation.getType("accommodated") } onClick={ () => { setSelectedType("accommodated") } }>
        { Reservation.getType("accommodated") }
      </Menu.Item>
      <Menu.Item key={ Reservation.getType("inhabited") } onClick={ () => { setSelectedType("inhabited") } }>
        { Reservation.getType("inhabited") }
      </Menu.Item>
    </Menu>
  )

  return (
    <Modal
      onCancel={ close }
      title="Rezervační formulář"
      visible={ isOpen }
      footer={ [
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
            // Update parent or send to data store
            if (selectedFromDay !== undefined && selectedToDay !== undefined) {
              const newRange: ReserveRange = {
                from: selectedFromDay,
                to: selectedToDay,
                type: selectedType
              }
              if (range !== undefined) {
                newRange.id = range.id
              }
              updateRange(newRange)
            }

            console.log("From: ", selectedFromDay)
            console.log("To: ", selectedToDay)
          } }>
          OK
        </Button>
      ] }>
      <Form
        layout="vertical">
        <Form.Item label="Datum Rezervace">
          { getRangePicker() }
        </Form.Item>
        <Form.Item label="Čas příjezdu">
          <TimePicker
            disabledSeconds={ () => Array.from(Array(60).keys()) }
            onChange={ (value: Moment | null) => {
              if (value !== null && selectedFromDay !== undefined) {
                const from = selectedFromDay
                from.hour = value.hour()
                from.minute = value.minute()
                setSelectedFromDay(from)
              }
            } } />
        </Form.Item>
        <Form.Item label="Čas odjezdu">
          <TimePicker
            disabledSeconds={ () => Array.from(Array(60).keys()) }
            onChange={ (value: Moment | null) => {
              if (value !== null && selectedToDay !== undefined) {
                const to = selectedToDay
                to.hour = value.hour()
                to.minute = value.minute()
                setSelectedToDay(to)
              }
            } } />
        </Form.Item>
        <Form.Item
          label="Typ Rezervace">
          <Dropdown
            overlay={ reservationTypeMenu }
            trigger={ [ 'click' ] }>
            <Button type="link">
              { Reservation.getType(selectedType) } <DownOutlined />
            </Button>
          </Dropdown>
        </Form.Item>
      </Form>
    </Modal>
  )
}