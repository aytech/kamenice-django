import { RouteComponentProps, withRouter } from "react-router-dom"
import { ApolloError, useQuery } from "@apollo/client"
import Title from "antd/lib/typography/Title"
import Timeline, { CursorMarker, DateHeader, SidebarHeader, TimelineGroup, TimelineHeaders, TimelineItem } from "react-calendar-timeline"
import { useEffect, useState } from "react"
import { Empty } from "antd"
import "react-calendar-timeline/lib/Timeline.css"
import "./styles.css"
import moment, { Moment } from "moment"
import { CustomGroupFields, CustomItemFields, IReservation, Reservation } from "../../lib/Types"
import { GuestDrawerSmall } from "../GuestDrawerSmall"
import { SUITES_WITH_RESERVATIONS } from "../../lib/graphql/queries/Suites"
import { SuitesWithReservations, SuitesWithReservations_reservations, SuitesWithReservations_suites } from "../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations"
import { Colors } from "../../lib/components/Colors"
import { ReservationItem } from "./components/ReservationItem"

interface Props {
  openReservationModal: (reservation: IReservation) => void
  reauthenticate: (callback: () => void) => void
  setPageTitle: (title: string) => void
}

// https://github.com/namespace-ee/react-calendar-timeline
export const Reservations = withRouter(({
  history,
  openReservationModal,
  reauthenticate,
  setPageTitle,
}: RouteComponentProps & Props) => {

  const { data, refetch: refetchData } = useQuery<SuitesWithReservations>(SUITES_WITH_RESERVATIONS)

  const [ groups, setGroups ] = useState<TimelineGroup<CustomGroupFields>[]>([])
  const [ guestDrawerOpen, setGuestDrawerOpen ] = useState<boolean>(false)
  const [ items, setItems ] = useState<TimelineItem<CustomItemFields, Moment>[]>([])
  const [ reservationModalOpen, setReservationModalOpen ] = useState<boolean>(false)
  const [ selectedReservation, setSelectedReservation ] = useState<IReservation>()

  // useEffect(() => {
  //   setPageTitle("Rezervace / Obsazenost")
  //   getData()
  // }, [ getData, history, setPageTitle ])

  // useEffect(() => {
  //   if (refetchData !== undefined) {
  //     refetchData().catch(() => reauthenticate(refetchData))
  //   }
  // }, [ reauthenticate, refetchData ])

  useEffect(() => {
    setPageTitle("Rezervace / Obsazenost")
  }, [ setPageTitle ])

  useEffect(() => {
    const suites: TimelineGroup<CustomGroupFields>[] = []
    const reservations: TimelineItem<CustomItemFields, Moment>[] = []
    data?.suites?.forEach((suite: SuitesWithReservations_suites | null) => {
      if (suite !== null) {
        suites.push({ ...suite, stackItems: true })
      }
    })
    data?.reservations?.forEach((reservation: SuitesWithReservations_reservations | null) => {
      if (reservation !== null) {
        reservations.push({
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
    setGroups(suites)
    setItems(reservations)
  }, [ data ])

  // Click on timeline outside of any reservation, 
  // opens modal for new reservation
  const onCanvasClick = (groupId: number, time: number) => {
    const selectedGroup = groups.find(group => group.id === groupId)
    if (selectedGroup !== undefined) {
      openReservationModal({
        fromDate: moment(time),
        suite: { ...selectedGroup },
        roommates: [],
        toDate: moment(time).add(1, "day"),
        type: "NONBINDING"
      })
    }
  }

  // Click on item on the timeline opens modal
  // with existing reservation for editing
  const onItemClick = (itemId: number) => {
    if (data?.reservations !== undefined && data.reservations !== null) {
      const reservation = data.reservations.find(entry => entry !== null && entry.id === String(itemId))
      if (reservation !== undefined && reservation !== null) {
        openReservationModal({
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
      }
    }
  }

  const getTimeline = () => {

  }

  return data !== undefined ? (
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
  ) : <Empty />
})