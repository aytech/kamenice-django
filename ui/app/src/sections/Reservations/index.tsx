import { RouteComponentProps, withRouter } from "react-router-dom"
import Title from "antd/lib/typography/Title"
import Timeline, { CursorMarker, DateHeader, SidebarHeader, TimelineGroup, TimelineHeaders, TimelineItem } from "react-calendar-timeline"
import { useEffect, useState } from "react"
import { Empty } from "antd"
import "react-calendar-timeline/lib/Timeline.css"
import "./styles.css"
import moment, { Moment } from "moment"
import { CustomGroupFields, CustomItemFields, IReservation, Reservation } from "../../lib/Types"
import { SuitesWithReservations_reservations, SuitesWithReservations_suites } from "../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations"
import { Colors } from "../../lib/components/Colors"
import { ReservationItem } from "./components/ReservationItem"
import { ReservationModal } from "../ReservationModal"
import { ApolloError } from "@apollo/client"
import { GuestDrawer } from "../GuestDrawer"
import { HomePage_guests } from "../../lib/graphql/queries/App/__generated__/HomePage"

interface Props {
  guests?: (HomePage_guests | null)[] | null
  reauthenticate: (callback: () => void, errorHandler?: (reason: ApolloError) => void) => void
  reservations?: (SuitesWithReservations_reservations | null)[] | null
  setPageTitle: (title: string) => void
  suites?: (SuitesWithReservations_suites | null)[] | null
}

// https://github.com/namespace-ee/react-calendar-timeline
export const Reservations = withRouter(({
  guests,
  reauthenticate,
  reservations,
  setPageTitle,
  suites
}: RouteComponentProps & Props) => {

  const [ groups, setGroups ] = useState<TimelineGroup<CustomGroupFields>[]>([])
  const [ items, setItems ] = useState<TimelineItem<CustomItemFields, Moment>[]>([])
  const [ guestDrawerOpen, setGuestDrawerOpen ] = useState<boolean>(false)
  const [ reservation, setReservation ] = useState<IReservation>()
  const [ reservationModalOpen, setReservationModalOpen ] = useState<boolean>(false)

  useEffect(() => {
    setPageTitle("Rezervace / Obsazenost")
  }, [ setPageTitle ])

  useEffect(() => {
    const reservationList: TimelineItem<CustomItemFields, Moment>[] = []
    reservations?.forEach((reservation: SuitesWithReservations_reservations | null) => {
      if (reservation !== null) {
        reservationList.push({
          color: Colors.getReservationColor(reservation.type),
          end_time: moment(reservation.toDate),
          group: reservation.suite.id,
          id: reservation.id,
          itemProps: {
            className: 'reservation-item',
            style: {
              background: Colors.getReservationColor(reservation.type),
              border: "none"
            }
          },
          start_time: moment(reservation.fromDate),
          title: `${ reservation.guest.name } ${ reservation.guest.surname }`,
          type: Reservation.getType(reservation.type)
        })
      }
    })
    setItems(reservationList)
  }, [ reservations ])

  useEffect(() => {
    const suiteList: TimelineGroup<CustomGroupFields>[] = []
    suites?.forEach((suite: SuitesWithReservations_suites | null) => {
      if (suite !== null) {
        suiteList.push({ ...suite, stackItems: true })
      }
    })
    setGroups(suiteList)
  }, [ suites ])

  // Click on timeline outside of any reservation, 
  // opens modal for new reservation
  const onCanvasClick = (groupId: number, time: number) => {
    const selectedGroup = groups.find(group => group.id === groupId)
    if (selectedGroup !== undefined) {
      setReservation({
        fromDate: moment(time),
        suite: { ...selectedGroup },
        roommates: [],
        toDate: moment(time).add(1, "day"),
        type: "NONBINDING"
      })
      setReservationModalOpen(true)
    }
  }

  // Click on item on the timeline opens modal
  // with existing reservation for editing
  const onItemClick = (itemId: number) => {
    if (reservations !== undefined && reservations !== null) {
      const reservation = reservations.find(entry => entry !== null && entry.id === String(itemId))
      if (reservation !== undefined && reservation !== null) {
        setReservation({
          fromDate: moment(reservation.fromDate),
          guest: reservation.guest,
          id: +reservation.id,
          meal: reservation.meal,
          notes: reservation.notes,
          purpose: reservation.purpose,
          roommates: reservation.roommates,
          suite: reservation.suite,
          toDate: moment(reservation.toDate),
          type: reservation.type
        })
        setReservationModalOpen(true)
      }
    }
  }

  return reservations !== null ? (
    <>
      <Timeline
        canChangeGroup={ false }
        canMove={ false }
        canResize={ false }
        defaultTimeEnd={ moment().add(12, "day") }
        defaultTimeStart={ moment().add(-12, "day") }
        groupRenderer={ ({ group }) => {
          return (
            <>
              <Title level={ 5 }>{ group.title }</Title>
            </>
          )
        } }
        groups={ groups }
        itemRenderer={ props => <ReservationItem { ...props } /> }
        items={ items }
        lineHeight={ 60 }
        onCanvasClick={ onCanvasClick }
        onItemClick={ onItemClick }>
        <TimelineHeaders>
          <SidebarHeader>
            { ({ getRootProps }) => {
              return (
                <div
                  { ...getRootProps() }
                  className="side-header" />
              )
            } }
          </SidebarHeader>
          <DateHeader unit="primaryHeader" />
          <DateHeader
            className="days"
            unit="day" />
        </TimelineHeaders>
        <CursorMarker>
          {
            ({ styles, date }) => {
              return (
                <div style={ { ...styles, backgroundColor: "rgba(136, 136, 136, 0.5)", color: "#888" } }>
                  <div className="rt-marker__label">
                    <div className="rt-marker__content">
                      { moment(date).format("DD MMM HH:mm") }
                    </div>
                  </div>
                </div>
              )
            }
          }
        </CursorMarker>
      </Timeline>
      <ReservationModal
        close={ () => {
          setReservation(undefined)
          setReservationModalOpen(false)
        } }
        guests={ guests }
        isOpen={ reservationModalOpen }
        reauthenticate={ reauthenticate }
        openGuestDrawer={ () => setGuestDrawerOpen(true) }
        reservation={ reservation } />
      <GuestDrawer
        close={ () => setGuestDrawerOpen(false) }
        reauthenticate={ reauthenticate }
        visible={ guestDrawerOpen } />
    </>
  ) : <Empty />
})