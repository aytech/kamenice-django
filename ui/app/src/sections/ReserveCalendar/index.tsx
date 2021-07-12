import React, { useState, useEffect } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { Col } from 'antd'
import Title from 'antd/lib/typography/Title'
import { Calendar, Day, DayValue } from 'react-modern-calendar-datepicker'
import { CsCalendarLocale, TransformDate } from '../../lib/components/CsCalendarLocale'
import './styles.css'
import { defaultArrivalHour, defaultDepartureHour } from '../../lib/Constants'
import { ReservationModal } from '../ReservationModal'
import { ReservationTypeKey, ReserveRange, Room } from '../../lib/Types'
import { Guests } from '../../lib/graphql/queries/Guests/__generated__/Guests'
import { Suites_suites } from '../../lib/graphql/queries/Suites/__generated__/Suites'
import { Reservations as ReservationsData, Reservations_reservations } from '../../lib/graphql/queries/Reservations/__generated__/Reservations'
import { RESERVATIONS } from '../../lib/graphql/queries/Reservations'
import { ReservationType } from '../../lib/graphql/globalTypes'

interface Props {
  data: Guests | undefined
  error: ApolloError | undefined
  getGuests: () => void
  loading: boolean
  openDrawer: () => void
  suite: Suites_suites
}
type CustomDayClassNameItem = Day & { className: string, reservationId: string };

export const ReserveCalendar = ({
  data,
  error,
  getGuests,
  loading,
  openDrawer,
  suite,
}: Props) => {

  const { loading: reservationsLoading, error: reservationsError, data: reservationsData } = useQuery<ReservationsData>(RESERVATIONS, {
    variables: { suiteId: suite.id }
  })
  const [ reservedRange, setReservedRange ] = useState<ReserveRange | undefined>()
  const [ modalOpen, setModalOpen ] = useState<boolean>(false)
  const [ reservedDays, setReservedDays ] = useState<CustomDayClassNameItem[]>([])
  const getDayClassName = (type: ReservationType) => {
    switch (type) {
      case "BINDING":
        return "greenDay"
      case "NONBINDING":
        return "yellowDay"
      case "ACCOMMODATED":
        return "purpleDay"
      case "INHABITED":
        return "orangeDay"
      default: return "greenDay"
    }
  }
  const updateReservedRange = (newRange: ReserveRange): void => {
    console.log('Updating range: ', newRange)
    //   room.reservedRanges = [
    //     ...room.reservedRanges.filter((range: ReserveRange) => {
    //       return range.id !== undefined && range.id !== newRange.id
    //     }),
    //     newRange
    //   ]
  }

  useEffect(() => {
    const reservedDays: CustomDayClassNameItem[] = []
    reservationsData?.reservations?.forEach((reservation: Reservations_reservations | null) => {
      if (reservation !== null) {
        TransformDate.getDaysFromRange(
          {
            year: reservation?.fromYear,
            month: reservation?.fromMonth,
            day: reservation?.fromDay
          },
          {
            year: reservation.toYear,
            month: reservation.toMonth,
            day: reservation.toDay
          }).forEach((day: Day) => {
            reservedDays.push({ className: getDayClassName(reservation.type), reservationId: reservation.id, ...day })
          })
      }
      setReservedDays(reservedDays)
    })
  }, [ reservationsData ])

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
        <Title level={ 4 } className="home__listings-title"> { suite.title }</Title>
        <div className="home__calendar">
          <Calendar
            onChange={ (dayValue: DayValue) => {
              console.log('Day value: ', dayValue);
              // const rangeDay = reservedDays.find((day: CustomDayClassNameItem) => {
              //   return day.year === dayValue?.year
              //     && day.month === dayValue.month
              //     && day.day === dayValue.day
              // })
              // if (rangeDay === undefined) {
              //   setNewReservationRange(dayValue)
              // } else {
              //   setReservedRange(room.reservedRanges.find(range => range.id === rangeDay.rangeId))
              // }
              // setModalOpen(true)
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
        updateRange={ updateReservedRange } />
    </>
  )
}