import React, { useState } from 'react'
import { Button, Col, Modal } from 'antd'
import Title from 'antd/lib/typography/Title'
import DatePicker, { Calendar, DayRange, DayValue } from 'react-modern-calendar-datepicker'
import { CsCalendarLocale, TransformDate } from '../../lib/components/CsCalendarLocale'

interface Props {
  room: { id: number, name: string }
}

export const ReserveCalendar = ({ room }: Props) => {
  const [ selectedRange, setSelectedRange ] = useState<DayRange>({
    from: null,
    to: null
  })
  const [ formVisible, setFormVisible ] = useState<boolean | undefined>(false)

  return (
    <>
      <Col
        span={ 12 }
        className="home__listing">
        <Title level={ 4 } className="home__listings-title"> { room.name }</Title>
        <div className="home__calendar">
          <Calendar
            value={ selectedRange }
            onChange={ (range: DayRange) => {
              setSelectedRange({
                from: range.from,
                to: null
              })
              setFormVisible(true)
            } }
            locale={ CsCalendarLocale }
            shouldHighlightWeekends />
        </div>
      </Col>
      <Modal
        title="Rezervační formulář"
        visible={ formVisible }
        footer={ [
          <Button
            key="cancel"
            onClick={ () => {
              setSelectedRange({ from: null, to: null })
              setFormVisible(false)
            } }>
            Zrušit
          </Button>,
          <Button
            key="ok"
            onClick={ () => {
              setFormVisible(false)
            } }>
            OK
          </Button>
        ] }>
        <DatePicker
          onChange={ (dayValue: DayValue) => {
            setSelectedRange({
              from: dayValue,
              to: selectedRange.to
            })
          } }
          inputPlaceholder={ TransformDate.toLocaleString(selectedRange.from, "Začátek rezervace") }
          shouldHighlightWeekends
          locale={ CsCalendarLocale }
        />
        <DatePicker
          onChange={ (dayValue: DayValue) => {
            setSelectedRange({
              from: selectedRange.from,
              to: dayValue
            })
          } }
          inputPlaceholder={ TransformDate.toLocaleString(selectedRange.to, "Konec rezervace") }
          shouldHighlightWeekends
          locale={ CsCalendarLocale } />
      </Modal>
    </>
  )
}