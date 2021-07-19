import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Col } from 'antd'
import { Calendar, Day, DayValue } from 'react-modern-calendar-datepicker'
import { CsCalendarLocale, TransformDate } from '../../lib/components/CsCalendarLocale'
import './styles.css'
import { defaultArrivalHour, defaultDepartureHour } from '../../lib/Constants'
import { ReservationModal } from '../ReservationModal'
import { ReservationRange } from '../../lib/Types'
import { Suites_suites } from '../../lib/graphql/queries/Suites/__generated__/Suites'
import { SuiteReservations as ReservationsData, SuiteReservations_suiteReservations } from '../../lib/graphql/queries/Reservations/__generated__/SuiteReservations'
import { SUITE_RESERVATIONS } from '../../lib/graphql/queries/Reservations'
import { ReservationType } from '../../lib/graphql/globalTypes'
import Title from 'antd/lib/typography/Title'
import moment, { Moment } from 'moment'

interface Props {
  suite: Suites_suites
}
type CustomDayClassNameItem = Day & { className: string, reservationId: string };

export const ReserveCalendar = ({
  suite,
}: Props) => {

  const { data: reservationsData, refetch } = useQuery<ReservationsData>(SUITE_RESERVATIONS, {
    variables: { suiteId: suite.id }
  })
  const [ reservedRange, setReservedRange ] = useState<ReservationRange>()
  const [ modalOpen, setModalOpen ] = useState<boolean>(false)
  const [ reservedDays, setReservedDays ] = useState<CustomDayClassNameItem[]>([])
  const [ selectedReservation, setSelectedReservation ] = useState<SuiteReservations_suiteReservations>()

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

  const setReservationRange = (dayValue: DayValue) => {
    console.log('Day Value: ', dayValue)
    const rangeDay = reservedDays.find((day: CustomDayClassNameItem) => {
      return day.year === dayValue?.year
        && day.month === dayValue.month
        && day.day === dayValue.day
    })
    if (rangeDay !== undefined) {
      const reservation = reservationsData?.suiteReservations?.find(reservation => reservation?.id === rangeDay.reservationId)
      if (reservation !== undefined && reservation !== null) {
        setReservedRange({
          from: moment(reservation.fromDate),
          to: moment(reservation.toDate)
        })
        setSelectedReservation(reservation)
      }
    }
    if (rangeDay === undefined && dayValue !== undefined && dayValue !== null) {
      setReservedRange({
        // Moment counts months from 0, so - 1 is required to get the current month
        from: moment([ dayValue.year, dayValue.month - 1, dayValue.day, defaultArrivalHour, 0 ]),
        // default range is the selected day + 1 day, default arrival and departure times
        to: moment([ dayValue.year, dayValue.month - 1, dayValue.day + 1, defaultDepartureHour, 0 ])
      })
    }
    setModalOpen(true)
  }

  // Add reserved days to calendar based on reservation data from server
  useEffect(() => {
    const reservedDays: CustomDayClassNameItem[] = []
    reservationsData?.suiteReservations?.forEach((reservation: SuiteReservations_suiteReservations | null) => {
      if (reservation !== null) {
        const from: Moment = moment(reservation.fromDate)
        const to: Moment = moment(reservation.toDate)
        TransformDate.getDaysFromRange(
          {
            year: from.year(),
            month: from.month() + 1,
            day: from.date()
          },
          {
            year: to.year(),
            month: to.month() + 1,
            day: to.date()
          }).forEach((day: Day) => {
            reservedDays.push({ className: getDayClassName(reservation.type), reservationId: reservation.id, ...day })
          })
      }
      setReservedDays(reservedDays)
    })
  }, [ reservationsData ])

  return (
    <>
      <Col
        span={ 8 }
        className="home__listing">
        <Title
          level={ 4 }
          className="home__listings-title">
          { suite.title }
        </Title>
        <div className="home__calendar">
          <Calendar
            onChange={ setReservationRange }
            locale={ CsCalendarLocale }
            customDaysClassName={ reservedDays }
            shouldHighlightWeekends />
        </div>
      </Col>
      <ReservationModal
        close={ () => {
          setSelectedReservation(undefined)
          setModalOpen(false)
        } }
        isOpen={ modalOpen }
        range={ reservedRange }
        refetchReservations={ refetch }
        reservation={ selectedReservation }
        suite={ suite } />
    </>
  )
}