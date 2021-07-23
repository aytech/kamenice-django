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
import { CustomGroupFields, CustomItemFields, Guest, IReservation, Reservation, ReservationTypeKey } from "../../lib/Types"
import { ReservationModal } from "../ReservationModal"
import { Guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { GUESTS } from "../../lib/graphql/queries/Guests"
import { GuestDrawerSmall } from "../GuestDrawerSmall"
import { emptyReservation } from "../../lib/Constants"
import { Tooltip } from "antd"

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
  const [ selectedReservation, setSelectedReservation ] = useState<IReservation>(emptyReservation)

  const getReservationFillTitle = (guest: Guest, type: ReservationTypeKey): string => {
    return `${ guest?.name } ${ guest?.surname } - ${ Reservation.getType(type) }`
  }

  useEffect(() => {
    setItems([])
    const suites: TimelineGroup<CustomGroupFields>[] = []
    const reservations: TimelineItem<CustomItemFields, Moment>[] = []
    reservationsData?.reservations?.forEach((reservation: Reservations_reservations | null) => {
      if (reservation !== null) {
        const groupIndex = suites.findIndex(suite => suite.id === reservation.suite.id)
        if (groupIndex === -1) {
          suites.push({
            id: reservation.suite.id,
            roomNumber: reservation.suite.number,
            stackItems: true,
            suiteTitle: reservation.suite.title,
            title: reservation.suite.title
          })
        }
        reservations.push({
          end_time: moment(reservation.toDate),
          fullTitle: getReservationFillTitle(reservation.guest, reservation.type),
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
    setGroups(suites)
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
        canChangeGroup={ false }
        canMove={ false }
        canResize={ false }
        defaultTimeEnd={ moment().add(12, "day") }
        defaultTimeStart={ moment().add(-12, "day") }
        groups={ groups }
        itemRenderer={ ({ item, itemContext, getItemProps, getResizeProps }) => {
          const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
          return item.itemProps !== undefined ? (
            <div { ...getItemProps(item.itemProps) }>
              { itemContext.useResizeHandle ? <div { ...leftResizeProps } /> : '' }
              <div
                className="rct-item-content"
                style={ { maxHeight: `${ itemContext.dimensions.height }` } }>
                <Tooltip title={ item.fullTitle }>
                  { item.title }
                </Tooltip>
              </div>
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
              ...emptyReservation,
              fromDate: moment(time).hours(14).minutes(0),
              suite: {
                id: selectedGroup.id,
                number: selectedGroup.roomNumber,
                title: selectedGroup.suiteTitle
              },
              toDate: moment(time).add(1, "day").hours(10).minutes(0)
            })
            setReservationModalOpen(true)
          }
        } }
        onItemClick={ (itemId: number, _e, time: number) => {
          if (reservationsData?.reservations !== undefined && reservationsData.reservations !== null) {
            const reservation = reservationsData.reservations.find(entry => entry !== null && entry.id === String(itemId))
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
        } } />
      <ReservationModal
        close={ () => {
          setSelectedReservation(emptyReservation)
          setReservationModalOpen(false)
        } }
        guests={ guestsQueryData }
        isOpen={ reservationModalOpen }
        openGuestDrawer={ () => setGuestDrawerOpen(true) }
        refetchReservations={ reservationsRefetch }
        reservation={ selectedReservation } />
      <GuestDrawerSmall
        close={ () => setGuestDrawerOpen(false) }
        open={ guestDrawerOpen }
        refetch={ guestsRefetch } />
    </Content>
  )
}