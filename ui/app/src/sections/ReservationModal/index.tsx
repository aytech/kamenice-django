import React, { useEffect, useState } from "react"
import { Button, DatePicker, Dropdown, Form, Menu, Modal, TimePicker } from "antd"
import locale from "antd/es/date-picker/locale/cs_CZ"
import { Reservation, ReservationTypeKey } from "../../lib/components/Reservation"
import { DownOutlined } from "@ant-design/icons"
import { ReserveDay, ReserveRange } from "../../lib/components/Room"
import { Moment } from "moment"
import { RangeValue } from "rc-picker/lib/interface"
import moment from "moment"
import { defaultArrivalHour, defaultDepartureHour } from "../../lib/Constants"
import { DrawerType } from "../../lib/Types"

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
  const [ selectedType, setSelectedType ] = useState<ReservationTypeKey>("binding")
  const dateFormat = "YYYY-MM-DD"
  const timeFormat = "HH:mm"

  useEffect(() => {
    if (range !== undefined) {
      setSelectedFromDay(range.from)
      setSelectedToDay(range.to)
      setSelectedType(range.type)
    }
  }, [ range ])

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
                type: selectedType
              }
              if (range !== undefined && range.id !== undefined) {
                newRange.id = range.id
              }
              updateRange(newRange)
            }
            close()
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
        <Form.Item label="Čas odjezdu">
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