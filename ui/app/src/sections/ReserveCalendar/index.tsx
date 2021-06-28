import React, { useState, useEffect } from 'react'
import { Col } from 'antd'
import Title from 'antd/lib/typography/Title'
import { Calendar, Day, DayValue } from 'react-modern-calendar-datepicker'
import { CsCalendarLocale, TransformDate } from '../../lib/components/CsCalendarLocale'
import './styles.css'
import { ReservationTypeKey } from '../../lib/components/Reservation'
import { ReservedRange, Room } from '../../lib/components/Room'
import { ReservationModal } from '../ReservationModal'

interface Props {
  room: Room
}
type CustomDayClassNameItem = Day & { className: string, rangeId: number };

export const ReserveCalendar = ({ room }: Props) => {
  const [ reservedRange, setReservedRange ] = useState<ReservedRange | undefined>()
  const [ modalOpen, setModalOpen ] = useState<boolean>(false)
  const [ reservedDays, setReservedDays ] = useState<CustomDayClassNameItem[]>([])

  const getDayClassName = (type: ReservationTypeKey) => {
    switch (type) {
      case "binding":
        return "greenDay"
      case "nonbinding":
        return "yellowDay"
      case "accommodated":
        return "purpleDay"
      case "inhabited":
        return "orangeDay"
      default: return "greenDay"
    }
  }
  const updateReservedRange = (newRange: ReservedRange): void => {
    // TODO:
    // 1. Filter ranges that are not the input range
    // 2. Update state with other + new range
    // 3. Save room with new ranges into the data store (figure out the logic)
    const otherRanges = room.reservedRanges.filter(range => range.id !== newRange.id)
    console.log('Ranges not specified in input: ', otherRanges)
  }

  useEffect(() => {
    const reservedDays: CustomDayClassNameItem[] = []
    room.reservedRanges.forEach((range: ReservedRange) => {
      TransformDate.getDaysFromRange(range.from, range.to).forEach((day: Day) => {
        reservedDays.push({ className: getDayClassName(range.type), rangeId: range.id, ...day })
      })
    })
    setReservedDays(reservedDays)
  }, [ room.reservedRanges ])

  return (
    <>
      <Col
        span={ 12 }
        className="home__listing">
        <Title level={ 4 } className="home__listings-title"> { room.name }</Title>
        <div className="home__calendar">
          <Calendar
            onChange={ (dayValue: DayValue) => {
              const rangeDay = reservedDays.find((day: CustomDayClassNameItem) => {
                return day.year === dayValue?.year
                  && day.month === dayValue.month
                  && day.day === dayValue.day
              })
              if (rangeDay !== undefined) {
                setReservedRange(room.reservedRanges.find(range => range.id === rangeDay.rangeId))
              }
              setModalOpen(true)
            } }
            locale={ CsCalendarLocale }
            customDaysClassName={ reservedDays }
            shouldHighlightWeekends />
        </div>
      </Col>
      <ReservationModal
        close={ () => { setModalOpen(false) } }
        isOpen={ modalOpen }
        range={ reservedRange }
        updateRange={ updateReservedRange } />
    </>
  )
}