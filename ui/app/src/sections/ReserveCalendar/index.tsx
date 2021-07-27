import { useState, useEffect } from 'react'
import { Col } from 'antd'
import { Calendar, Day, DayValue } from 'react-modern-calendar-datepicker'
import { CsCalendarLocale, TransformDate } from '../../lib/components/CsCalendarLocale'
import './styles.css'
import { defaultArrivalHour, defaultDepartureHour } from '../../lib/Constants'
import { ReservationModal } from '../ReservationModal'
import { IReservation } from '../../lib/Types'
import { ReservationType } from '../../lib/graphql/globalTypes'
import Title from 'antd/lib/typography/Title'
import moment, { Moment } from 'moment'
import { GuestDrawerSmall } from '../GuestDrawerSmall'
import { SuitesWithReservations, SuitesWithReservations_guests, SuitesWithReservations_reservations } from '../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations'
import { Suites_suites } from '../../lib/graphql/queries/Suites/__generated__/Suites'
import { ApolloQueryResult, OperationVariables } from '@apollo/client'

interface Props {
  guests: (SuitesWithReservations_guests | null)[] | null
  refetch: ((variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<SuitesWithReservations>>) | undefined
  reservations: (SuitesWithReservations_reservations | null)[] | undefined
  suite: Suites_suites
}
type CustomDayClassNameItem = Day & { className: string, reservationId: string };

export const ReserveCalendar = ({
  guests,
  refetch,
  reservations,
  suite,
}: Props) => {

  const [ modalOpen, setModalOpen ] = useState<boolean>(false)
  const [ guestDrawerOpen, setGuestDrawerOpen ] = useState<boolean>(false)
  const [ reservedDays, setReservedDays ] = useState<CustomDayClassNameItem[]>([])
  const [ selectedReservation, setSelectedReservation ] = useState<IReservation>()

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
    const rangeDay = reservedDays.find((day: CustomDayClassNameItem) => {
      return day.year === dayValue?.year
        && day.month === dayValue.month
        && day.day === dayValue.day
    })
    if (rangeDay !== undefined) {
      const reservation = reservations?.find(reservation => reservation?.id === rangeDay.reservationId)
      if (reservation !== undefined && reservation !== null) {
        setSelectedReservation({
          fromDate: moment(reservation.fromDate),
          guest: {
            id: reservation.guest.id,
            name: reservation.guest.name,
            surname: reservation.guest.surname
          },
          meal: reservation.meal,
          id: +reservation.id,
          notes: reservation.notes,
          purpose: reservation.purpose,
          roommates: reservation.roommates,
          suite: reservation.suite,
          toDate: moment(reservation.toDate),
          type: reservation.type
        })
      }
    }
    if (rangeDay === undefined && dayValue !== undefined && dayValue !== null) {
      setSelectedReservation({
        fromDate: moment([ dayValue.year, dayValue.month - 1, dayValue.day, defaultArrivalHour, 0 ]),
        roommates: [],
        suite: { id: suite.id },
        toDate: moment([ dayValue.year, dayValue.month - 1, dayValue.day + 1, defaultDepartureHour, 0 ]),
        type: "NONBINDING"
      })
    }
    setModalOpen(true)
  }

  // Add reserved days to calendar based on reservation data from server
  useEffect(() => {
    const reservedDays: CustomDayClassNameItem[] = []
    reservations?.forEach((reservation: SuitesWithReservations_reservations | null) => {
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
    })
    setReservedDays(reservedDays)
  }, [ reservations ])

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
        guests={ guests }
        isOpen={ modalOpen }
        openGuestDrawer={ () => setGuestDrawerOpen(true) }
        refetch={ refetch }
        reservation={ selectedReservation } />
      <GuestDrawerSmall
        close={ () => setGuestDrawerOpen(false) }
        open={ guestDrawerOpen }
        refetch={ refetch } />
    </>
  )
}