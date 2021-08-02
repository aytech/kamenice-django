import { RouteComponentProps, withRouter } from "react-router-dom"
import { ApolloError, useLazyQuery } from "@apollo/client"
import Title from "antd/lib/typography/Title"
import Text from "antd/lib/typography/Text"
import Timeline, { CursorMarker, DateHeader, SidebarHeader, TimelineGroup, TimelineHeaders, TimelineItem } from "react-calendar-timeline"
import { useEffect, useState } from "react"
import { Empty, message, Popover } from "antd"
import "react-calendar-timeline/lib/Timeline.css"
import "./styles.css"
import moment, { Moment } from "moment"
import { CustomGroupFields, CustomItemFields, IReservation, Reservation } from "../../lib/Types"
import { GuestDrawerSmall } from "../GuestDrawerSmall"
import { SUITES_WITH_RESERVATIONS } from "../../lib/graphql/queries/Suites"
import { SuitesWithReservations, SuitesWithReservations_reservations, SuitesWithReservations_suites } from "../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations"
import { ReservationModal } from "../ReservationModal"
import { Whoami_whoami } from "../../lib/graphql/queries/User/__generated__/Whoami"
import { apolloErrorUnauthorized } from "../../lib/Constants"

interface Props {
  setPageTitle: (title: string) => void
  setUser: (user: Whoami_whoami | undefined) => void
  user: Whoami_whoami | undefined
}

// https://github.com/namespace-ee/react-calendar-timeline
export const Reservations = withRouter(({
  history,
  setPageTitle,
  setUser,
  user
}: RouteComponentProps & Props) => {

  const getReservationColor = (reservationType: string): string => {
    switch (reservationType) {
      case "NONBINDING":
        return "rgb(254, 223, 3)"
      case "ACCOMMODATED":
        return "rgb(0, 133, 182)"
      case "INHABITED":
        return "rgb(254, 127, 45)"
      case "BINDING":
      default: return "rgb(0, 212, 157)"
    }
  }

  const [ getData, { data, refetch } ] = useLazyQuery<SuitesWithReservations>(SUITES_WITH_RESERVATIONS, {
    onError: (reason: ApolloError) => {
      if (reason.message === apolloErrorUnauthorized) {
        setUser(undefined)
        history.push("/login?next=/")
      } else {
        console.error(reason)
        message.error("Chyba serveru, kontaktujte správce")
      }
    }
  })

  const [ groups, setGroups ] = useState<TimelineGroup<CustomGroupFields>[]>([])
  const [ guestDrawerOpen, setGuestDrawerOpen ] = useState<boolean>(false)
  const [ items, setItems ] = useState<TimelineItem<CustomItemFields, Moment>[]>([])
  const [ reservationModalOpen, setReservationModalOpen ] = useState<boolean>(false)
  const [ selectedReservation, setSelectedReservation ] = useState<IReservation>()

  useEffect(() => {
    setPageTitle("Rezervace / Obsazenost")
    if (user === undefined) {
      history.push("/login?next=/")
    } else {
      getData()
    }
  }, [ getData, history, setPageTitle, user ])

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
          color: getReservationColor(reservation.type),
          end_time: moment(reservation.toDate),
          group: reservation.suite.id,
          id: reservation.id,
          itemProps: {
            className: 'reservation-item',
            style: {
              background: getReservationColor(reservation.type),
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

  const getTimeline = () => {
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
        itemRenderer={ ({ item, itemContext, getItemProps, getResizeProps }) => {
          const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
          return item.itemProps !== undefined ? (
            <div { ...getItemProps(item.itemProps) }>
              { itemContext.useResizeHandle ? <div { ...leftResizeProps } /> : '' }
              <Popover title={ item.title } content={ (
                <>
                  <div style={ { color: item.color, fontWeight: 700 } }>
                    { item.type }
                  </div>
                  <div>
                    Od: <strong>{ item.start_time.format("DD MMM HH:mm") }</strong>
                  </div>
                  <div>
                    Do: <strong>{ item.end_time.format("DD MMM HH:mm") }</strong>
                  </div>
                </>
              ) }>
                <div
                  className="rct-item-content"
                  style={ { maxHeight: `${ itemContext.dimensions.height }` } }>
                  <Text strong>{ item.title }</Text>
                </div>
              </Popover>
              { itemContext.useResizeHandle ? <div { ...rightResizeProps } /> : '' }
            </div>
          ) : null
        } }
        items={ items }
        lineHeight={ 60 }
        onCanvasClick={ (groupId: number, time: number) => {
          const selectedGroup = groups.find(group => group.id === groupId)
          if (selectedGroup !== undefined) {
            setSelectedReservation({
              fromDate: moment(time),
              suite: { ...selectedGroup },
              roommates: [],
              toDate: moment(time).add(1, "day"),
              type: "NONBINDING"
            })
            setReservationModalOpen(true)
          }
        } }
        onItemClick={ (itemId: number, _e, time: number) => {
          if (data?.reservations !== undefined && data.reservations !== null) {
            const reservation = data.reservations.find(entry => entry !== null && entry.id === String(itemId))
            if (reservation !== undefined && reservation !== null) {
              setSelectedReservation({
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
        } }>
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
  }

  return (
    <>
      { getTimeline() }
      <ReservationModal
        close={ () => {
          setSelectedReservation(undefined)
          setReservationModalOpen(false)
        } }
        guests={ data?.guests }
        isOpen={ reservationModalOpen }
        openGuestDrawer={ () => setGuestDrawerOpen(true) }
        refetch={ refetch }
        reservation={ selectedReservation } />
      <GuestDrawerSmall
        close={ () => setGuestDrawerOpen(false) }
        open={ guestDrawerOpen }
        refetch={ refetch } />
    </>
  )
})