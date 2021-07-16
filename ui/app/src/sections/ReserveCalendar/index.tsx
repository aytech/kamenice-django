import { useState, useEffect } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { Col } from 'antd'
import { Calendar, Day, DayValue } from 'react-modern-calendar-datepicker'
import { CsCalendarLocale, TransformDate } from '../../lib/components/CsCalendarLocale'
import './styles.css'
import { defaultArrivalHour, defaultDepartureHour } from '../../lib/Constants'
import { ReservationModal } from '../ReservationModal'
import { ReserveRange } from '../../lib/Types'
import { Guests } from '../../lib/graphql/queries/Guests/__generated__/Guests'
import { Suites_suites } from '../../lib/graphql/queries/Suites/__generated__/Suites'
import { SuiteReservations as ReservationsData, SuiteReservations_suiteReservations } from '../../lib/graphql/queries/Reservations/__generated__/SuiteReservations'
import { SUITE_RESERVATIONS } from '../../lib/graphql/queries/Reservations'
import { ReservationType } from '../../lib/graphql/globalTypes'
import Title from 'antd/lib/typography/Title'
import moment, { Moment } from 'moment'

interface Props {
  // getGuests: () => void
  openDrawer: () => void
  suite: Suites_suites
}
type CustomDayClassNameItem = Day & { className: string, reservationId: string };

export const ReserveCalendar = ({
  // getGuests,
  openDrawer,
  suite,
}: Props) => {

  const { data: reservationsData } = useQuery<ReservationsData>(SUITE_RESERVATIONS, {
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

  useEffect(() => {
    const reservedDays: CustomDayClassNameItem[] = []
    reservationsData?.suiteReservations?.forEach((reservation: SuiteReservations_suiteReservations | null) => {
      if (reservation !== null) {
        const from: Moment = moment(reservation.fromDate)
        const to: Moment = moment(reservation.toDate)
        TransformDate.getDaysFromRange(
          {
            year: from.year(),
            month: from.month(),
            day: from.date()
          },
          {
            year: to.year(),
            month: to.month(),
            day: to.date()
          }).forEach((day: Day) => {
            reservedDays.push({ className: getDayClassName(reservation.type), reservationId: reservation.id, ...day })
          })
          console.log('Reservation: ', reservedDays)
      }
      setReservedDays(reservedDays)
    })
  }, [ reservationsData ])

  const setNewReservationRange = (dayValue: DayValue): void => {
    if (dayValue !== undefined && dayValue !== null) {
      setReservedRange({
        from: { ...dayValue, hour: defaultArrivalHour, minute: 0 },
        to: { ...dayValue, day: dayValue.day + 1, hour: defaultDepartureHour, minute: 0 },
        type: "BINDING"
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
              const rangeDay = reservedDays.find((day: CustomDayClassNameItem) => {
                return day.year === dayValue?.year
                  && day.month === dayValue.month
                  && day.day === dayValue.day
              })
              if (rangeDay === undefined) {
                setNewReservationRange(dayValue)
              }
              // else {
              //   setReservedRange(room.reservedRanges.find(range => range.id === rangeDay.rangeId))
              // }
              setModalOpen(true)
            } }
            locale={ CsCalendarLocale }
            customDaysClassName={ reservedDays }
            shouldHighlightWeekends />
        </div>
      </Col>
      <ReservationModal
        close={ () => { setModalOpen(false) } }
        // getGuests={ getGuests }
        isOpen={ modalOpen }
        openDrawer={ openDrawer }
        range={ reservedRange }
        suite={ suite } />
    </>
  )
}