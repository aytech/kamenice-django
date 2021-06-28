import React, { useState } from "react"
import { Button, DatePicker, Dropdown, Form, Menu, message, Modal } from "antd"
import locale from "antd/es/date-picker/locale/cs_CZ"
import { Day, DayValue } from "react-modern-calendar-datepicker"
import { CsCalendarLocale, TransformDate } from "../../lib/components/CsCalendarLocale"
import { Reservation, ReservationTypeKey } from "../../lib/components/Reservation"
import { DownOutlined } from "@ant-design/icons"
import { useEffect } from "react"
import { ReservedRange } from "../../lib/components/Room"
import { Moment } from "moment"
import { RangeValue } from "rc-picker/lib/interface"

interface Props {
  close: () => void,
  isOpen: boolean,
  range: ReservedRange | undefined,
  updateRange: (range: ReservedRange) => void
}
const { RangePicker } = DatePicker

export const ReservationModal = ({
  close,
  isOpen,
  range,
  updateRange
}: Props) => {

  const [ selectedFromDay, setSelectedFromDay ] = useState<Day>()
  const [ selectedToDay, setSelectedToDay ] = useState<Day>()
  const [ selectedType, setSelectedType ] = useState<ReservationTypeKey>("binding")

  useEffect(() => {
    if (range !== undefined) {
      setSelectedFromDay(range.from)
      setSelectedToDay(range.to)
      setSelectedType(range.type)
    }
  }, [ range ])

  const selectReservationEndDate = (dayValue: DayValue) => {
    if (dayValue === undefined || dayValue === null) {
      message.error("vyberte datum")
      return
    }
    if (selectedFromDay === undefined || selectedFromDay === null) {
      message.error("nejdřív vyberte začátek rezervace")
      return
    }
    const fromDate = CsCalendarLocale.toNativeDate(selectedFromDay)
    const toDate = CsCalendarLocale.toNativeDate(dayValue)
    if (toDate < fromDate) {
      message.error("konec rezervace nesmí být dříve než začátek")
      return
    }
    setSelectedToDay(dayValue)
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
      width="80%"
      footer={ [
        <Button
          key="cancel"
          onClick={ close }>
          Zrušit
        </Button>,
        <Button
          disabled={ selectedFromDay === null || selectedToDay === null }
          key="ok"
          onClick={ () => {
            // Update range in parent, if the range is valid
          } }>
          OK
        </Button>
      ] }>
      <Form
        layout="inline">
        <Form.Item
          label="Začátek Rezervace">
          <RangePicker
            locale={ locale }
            onChange={ (range: RangeValue<Moment>) => {
              
              if (range !== null) {
                console.log('Range: ', range[0]?.toDate())
                console.log('Year: ', range[ 0 ]?.year())
                console.log('Month: ', range[ 0 ]?.month())
                console.log('Day: ', range[ 0 ]?.date())
              }
            } } />
          {/* <DatePicker
            value={ selectedFromDay }
            onChange={ (dayValue: DayValue) => {
              if (dayValue !== undefined && dayValue !== null) {
                setSelectedFromDay(dayValue)
              }
            } }
            inputPlaceholder={ TransformDate.toLocaleString(selectedFromDay, "vyberte datum") }
            shouldHighlightWeekends
            locale={ CsCalendarLocale }
          /> */}
        </Form.Item>
        <Form.Item
          label="Konec Rezervace">
          {/* <DatePicker
            value={ selectedToDay }
            onChange={ (selectReservationEndDate) }
            inputPlaceholder={ TransformDate.toLocaleString(selectedToDay, "vyberte datum") }
            shouldHighlightWeekends
            locale={ CsCalendarLocale } /> */}
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