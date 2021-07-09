import React, { useState, useEffect } from 'react'
import { ApolloError } from '@apollo/client'
import { Col } from 'antd'
import Title from 'antd/lib/typography/Title'
import { Calendar, Day, DayValue } from 'react-modern-calendar-datepicker'
import { CsCalendarLocale, TransformDate } from '../../lib/components/CsCalendarLocale'
import './styles.css'
import { defaultArrivalHour, defaultDepartureHour } from '../../lib/Constants'
import { ReservationModal } from '../ReservationModal'
import { DrawerType, ReservationTypeKey, ReserveRange, Room } from '../../lib/Types'
import { Guests } from '../../lib/graphql/queries/Guests/__generated__/Guests'

interface Props {
  data: Guests | undefined
  error: ApolloError | undefined
  getGuests: () => void
  loading: boolean
  openDrawer: () => void
  room: Room
  setDrawerType: (type: DrawerType) => void
}
type CustomDayClassNameItem = Day & { className: string, rangeId?: number };

export const ReserveCalendar = ({
  data,
  error,
  getGuests,
  loading,
  openDrawer,
  room,
  setDrawerType
}: Props) => {
  const [ reservedRange, setReservedRange ] = useState<ReserveRange | undefined>()
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
  const updateReservedRange = (newRange: ReserveRange): void => {
    room.reservedRanges = [
      ...room.reservedRanges.filter((range: ReserveRange) => {
        return range.id !== undefined && range.id !== newRange.id
      }),
      newRange
    ]
  }

  useEffect(() => {
    const reservedDays: CustomDayClassNameItem[] = []
    room.reservedRanges.forEach((range: ReserveRange) => {
      TransformDate.getDaysFromRange(range.from, range.to).forEach((day: Day) => {
        reservedDays.push({ className: getDayClassName(range.type), rangeId: range.id, ...day })
      })
    })
    setReservedDays(reservedDays)
  }, [ room.reservedRanges ])

  const setNewReservationRange = (dayValue: DayValue): void => {
    if (dayValue !== undefined && dayValue !== null) {
      setReservedRange({
        from: { ...dayValue, hour: defaultArrivalHour, minute: 0 },
        to: { ...dayValue, day: dayValue.day + 1, hour: defaultDepartureHour, minute: 0 },
        type: "binding"
      })
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
            onChange={ (dayValue: DayValue) => {
              const rangeDay = reservedDays.find((day: CustomDayClassNameItem) => {
                return day.year === dayValue?.year
                  && day.month === dayValue.month
                  && day.day === dayValue.day
              })
              if (rangeDay === undefined) {
                setNewReservationRange(dayValue)
              } else {
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
        data={ data }
        error={ error }
        getGuests={ getGuests }
        loading={ loading }
        isOpen={ modalOpen }
        openDrawer={ openDrawer }
        range={ reservedRange }
        setDrawerType={ setDrawerType }
        updateRange={ updateReservedRange } />
    </>
  )
}