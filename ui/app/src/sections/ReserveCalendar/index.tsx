import React, { useState } from 'react'
import { Button, Col, Dropdown, Form, Menu, message, Modal } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import Title from 'antd/lib/typography/Title'
import DatePicker, { Calendar, Day, DayValue } from 'react-modern-calendar-datepicker'
import { CsCalendarLocale, TransformDate } from '../../lib/components/CsCalendarLocale'
import './styles.css'

interface Props {
  room: { id: number, name: string }
}
type CustomDayClassNameItem = Day & { className: string };

export const ReserveCalendar = ({ room }: Props) => {
  const [ selectedFromDay, setSelectedFromDay ] = useState<DayValue>(null)
  const [ selectedToDay, setSelectedToDay ] = useState<DayValue>(null)
  const [ formVisible, setFormVisible ] = useState<boolean | undefined>(false)
  const [ reservationType, setReservationType ] = useState<string>("Závazná Rezervace")
  const [ reservedDays, setReservedDays ] = useState<CustomDayClassNameItem[]>([])
  const reservationTypeMenu = (
    <Menu>
      <Menu.Item key="Závazná Rezervace" onClick={ (it) => { setReservationType(it.key) } }>Závazná Rezervace</Menu.Item>
      <Menu.Item key="Nezávazná Rezervace" onClick={ (it) => { setReservationType(it.key) } }>Nezávazná Rezervace</Menu.Item>
      <Menu.Item key="Aktuálně Ubytování" onClick={ (it) => { setReservationType(it.key) } }>Aktuálně Ubytování</Menu.Item>
      <Menu.Item key="Obydlený Termín" onClick={ (it) => { setReservationType(it.key) } }>Obydlený Termín</Menu.Item>
    </Menu>
  )
  const selectReservationEndDate = (dayValue: DayValue) => {
    if (selectedFromDay === undefined || selectedFromDay === null) {
      message.error("nejdřív vyberte začátek rezervace")
      return
    }
    if (dayValue === undefined || dayValue === null) {
      message.error("vyberte konec rezervace")
      return
    }
    const from = CsCalendarLocale.toNativeDate(selectedFromDay)
    const to = CsCalendarLocale.toNativeDate(dayValue)
    if (to < from) {
      message.error("konec rezervace nesmí být dříve než začátek")
      return
    }
    setSelectedToDay(dayValue)
  }

  const getDaysClassName = () => {
    switch (reservationType) {
      case "Závazná Rezervace":
        return "greenDay"
      case "Nezávazná Rezervace":
        return "yellowDay"
      case "Aktuálně Ubytování":
        return "purpleDay"
      case "Obydlený Termín":
        return "orangeDay"
      default: return "greenDay"
    }
  }

  return (
    <>
      <Col
        span={ 12 }
        className="home__listing">
        <Title level={ 4 } className="home__listings-title"> { room.name }</Title>
        <div className="home__calendar">
          <Calendar
            value={ selectedFromDay }
            onChange={ (dayValue: DayValue) => {
              setSelectedFromDay(dayValue)
              setFormVisible(true)
            } }
            locale={ CsCalendarLocale }
            customDaysClassName={ reservedDays }
            shouldHighlightWeekends />
        </div>
      </Col>
      <Modal // TODO: selected day on calendars not working, probly move to a component
        title="Rezervační formulář"
        visible={ formVisible }
        width="80%"
        footer={ [
          <Button
            key="cancel"
            onClick={ () => {
              setSelectedFromDay(null)
              setFormVisible(false)
            } }>
            Zrušit
          </Button>,
          <Button
            disabled={ selectedFromDay === null || selectedToDay === null }
            key="ok"
            onClick={ () => {
              const rangeDays: Day[] = TransformDate.getDaysFromRange(selectedFromDay, selectedToDay)
              setReservedDays(rangeDays.map((day: Day) => {
                return { className: getDaysClassName(), ...day }
              }))
              setSelectedFromDay(null)
              setSelectedToDay(null)
              setFormVisible(false)
            } }>
            OK
          </Button>
        ] }>
        <Form
          layout="inline">
          <Form.Item
            label="Začátek Rezervace"
            name="from">
            <DatePicker
              onChange={ (dayValue: DayValue) => {
                setSelectedFromDay(dayValue)
              } }
              inputPlaceholder={ TransformDate.toLocaleString(selectedFromDay, "vyberte datum") }
              shouldHighlightWeekends
              locale={ CsCalendarLocale }
            />
          </Form.Item>
          <Form.Item
            label="Konec Rezervace"
            name="to">
            <DatePicker
              onChange={ selectReservationEndDate }
              inputPlaceholder={ TransformDate.toLocaleString(selectedToDay, "vyberte datum") }
              shouldHighlightWeekends
              locale={ CsCalendarLocale } />
          </Form.Item>
          <Form.Item
            label="Typ Rezervace"
            name="type">
            <Dropdown
              overlay={ reservationTypeMenu }
              trigger={ [ 'click' ] }>
              <Button type="link">
                { reservationType } <DownOutlined />
              </Button>
            </Dropdown>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}