import { useQuery } from "@apollo/client"
import { Content } from "antd/lib/layout/layout"
import Title from "antd/lib/typography/Title"
import Timeline, { TimelineGroup, TimelineItem } from "react-calendar-timeline"
import { useEffect, useState } from "react"
import { RESERVATIONS } from "../../lib/graphql/queries/Reservations"
import { Reservations, Reservations_reservations } from "../../lib/graphql/queries/Reservations/__generated__/Reservations"
import "react-calendar-timeline/lib/Timeline.css"
import "./styles.css"
import moment, { Moment } from "moment"
import { CustomGroupFields, CustomItemFields, ReservationRange, Suite } from "../../lib/Types"
import { ReservationModal } from "../ReservationModal"
import { Guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { GUESTS } from "../../lib/graphql/queries/Guests"
import { GuestDrawerSmall } from "../GuestDrawerSmall"

// https://github.com/namespace-ee/react-calendar-timeline
export const Overview = () => {

  const getReservationColor = (reservationType: string): string => {
    switch (reservationType) {
      case "NONBINDING":
        return "#e4e724"
      case "ACCOMMODATED":
        return "#9c88ff"
      case "INHABITED":
        return "#db913c"
      case "BINDING":
      default: return "#0eca2d"
    }
  }

  const { data: reservationsData, refetch: reservationsRefetch } = useQuery<Reservations>(RESERVATIONS)
  const { data: guestsQueryData, refetch: guestsRefetch } = useQuery<Guests>(GUESTS)

  const [ groups, setGroups ] = useState<TimelineGroup<CustomGroupFields>[]>([])
  const [ guestDrawerOpen, setGuestDrawerOpen ] = useState<boolean>(false)
  const [ items, setItems ] = useState<TimelineItem<CustomItemFields, Moment>[]>([])
  const [ reservationModalOpen, setReservationModalOpen ] = useState<boolean>(false)
  const [ reservedRange, setReservedRange ] = useState<ReservationRange>()
  const [ selectedReservation, setSelectedReservation ] = useState<Reservations_reservations>()
  const [ selectedSuite, setSelectedSuite ] = useState<Suite>()

  useEffect(() => {
    const groups: TimelineGroup<CustomGroupFields>[] = []
    const reservations: TimelineItem<CustomItemFields, Moment>[] = []
    reservationsData?.reservations?.forEach((reservation: Reservations_reservations | null) => {
      if (reservation !== null) {
        const groupIndex = groups.findIndex(group => group.id === +reservation.suite.id)
        if (groupIndex === -1) {
          groups.push({
            id: +reservation.suite.id,
            roomNumber: reservation.suite.number,
            stackItems: true,
            suiteTitle: reservation.suite.title,
            title: reservation.suite.title
          })
        }
        reservations.push({
          end_time: moment(reservation.toDate),
          group: +reservation.suite.id,
          id: +reservation.id,
          itemProps: {
            className: 'weekend',
            style: {
              background: getReservationColor(reservation.type)
            }
          },
          start_time: moment(reservation.fromDate),
          title: `${ reservation.guest.name } ${ reservation.guest.surname }`
        })
      }
    })
    setGroups(groups)
    setItems(reservations)
  }, [ reservationsData ])

  useEffect(() => {
    reservationsRefetch()
  }, [ reservationsRefetch ])

  return (
    <Content className="app-content">
      <Title level={ 3 } className="home__listings-title">
        Přehled
      </Title>
      <Timeline
        defaultTimeEnd={ moment().add(20, "day") }
        defaultTimeStart={ moment().add(-20, "day") }
        groups={ groups }
        items={ items }
        lineHeight={ 50 }
        onCanvasClick={ (groupId: number, time: number) => {
          const selectedGroup = groups.find(group => group.id === groupId)
          if (selectedGroup !== undefined) {
            setSelectedSuite({
              id: String(selectedGroup.id),
              number: 0,
              title: selectedGroup.suiteTitle
            })
            setReservedRange({
              from: moment(time).hour(14).minutes(0),
              to: moment(time).add(1, "day").hours(10).minutes(0)
            })
            setReservationModalOpen(true)
          }
        } }
        onItemClick={ (itemId: number, _e, time: number) => {
          if (reservationsData?.reservations !== undefined && reservationsData.reservations !== null) {
            const reservation = reservationsData.reservations.find(entry => entry !== null && entry.id === String(itemId))
            if (reservation !== undefined && reservation !== null) {
              setReservedRange({
                from: moment(reservation.fromDate),
                to: moment(reservation.toDate)
              })
              setSelectedSuite(reservation.suite)
              setSelectedReservation(reservation)
              setReservationModalOpen(true)
            }
          }
        } } />
      <ReservationModal
        close={ () => {
          setSelectedReservation(undefined)
          setReservationModalOpen(false)
        } }
        guests={ guestsQueryData }
        isOpen={ reservationModalOpen }
        openGuestDrawer={ () => setGuestDrawerOpen(true) }
        range={ reservedRange }
        refetchReservations={ reservationsRefetch }
        reservation={ selectedReservation }
        suite={ selectedSuite } />
      <GuestDrawerSmall
        close={ () => setGuestDrawerOpen(false) }
        open={ guestDrawerOpen }
        refetch={ guestsRefetch } />
    </Content>
  )
}