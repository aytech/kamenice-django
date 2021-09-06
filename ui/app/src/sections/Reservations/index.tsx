import { RouteComponentProps, withRouter } from "react-router-dom"
import Title from "antd/lib/typography/Title"
import Timeline, { CursorMarker, DateHeader, SidebarHeader, TimelineGroup, TimelineHeaders, TimelineItem } from "react-calendar-timeline"
import { useEffect, useState } from "react"
import "react-calendar-timeline/lib/Timeline.css"
import "./styles.css"
import moment, { Moment } from "moment"
import { CustomGroupFields, CustomItemFields, IReservation, MenuItemKey } from "../../lib/Types"
import { Colors } from "../../lib/components/Colors"
import { ReservationItem } from "./components/ReservationItem"
import { ReservationModal } from "./components/ReservationModal"
import { ApolloError, useQuery } from "@apollo/client"
import { Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import { SUITES_WITH_RESERVATIONS } from "../../lib/graphql/queries/Suites"
import { SuitesWithReservations, SuitesWithReservations_reservations } from "../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations"
import { message, Skeleton } from "antd"
import { useTranslation } from "react-i18next"

interface Props {
  setPageTitle: (title: string) => void
  setSelectedPage: (page: MenuItemKey) => void
}

// https://github.com/namespace-ee/react-calendar-timeline
export const Reservations = withRouter(({
  setPageTitle,
  setSelectedPage
}: RouteComponentProps & Props) => {

  const { t } = useTranslation()

  const [ dataLoading, setDataLoading ] = useState<boolean>(true)
  const [ groups, setGroups ] = useState<TimelineGroup<CustomGroupFields>[]>([])
  const [ items, setItems ] = useState<TimelineItem<CustomItemFields, Moment>[]>([])
  const [ reservation, setReservation ] = useState<IReservation>()
  const [ reservationModalOpen, setReservationModalOpen ] = useState<boolean>(false)
  const [ selectedSuite, setSelectedSuite ] = useState<Suites_suites>()

  const { data: reservationsData } = useQuery<SuitesWithReservations>(SUITES_WITH_RESERVATIONS, {
    onCompleted: () => {
      setDataLoading(false)
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const getTimelineReservationItem = (reservation: SuitesWithReservations_reservations): TimelineItem<CustomItemFields, Moment> => {
    return {
      color: Colors.getReservationColor(reservation.type),
      end_time: moment(reservation.toDate),
      group: reservation.suite.id,
      guest: reservation.guest,
      id: reservation.id,
      itemProps: {
        className: 'reservation-item',
        style: {
          background: Colors.getReservationColor(reservation.type),
          border: "none"
        }
      },
      meal: reservation.meal,
      notes: reservation.notes,
      price: reservation.price,
      purpose: reservation.purpose,
      roommates: reservation.roommates,
      start_time: moment(reservation.fromDate),
      suite: reservation.suite,
      title: `${ reservation.guest.name } ${ reservation.guest.surname }`,
      type: reservation.type
    }
  }

  const addOrUpdateReservation = (reservation?: SuitesWithReservations_reservations | null) => {
    if (reservation !== undefined && reservation !== null) {
      const existingReservations = items.filter(item => item.id !== reservation.id)
      setItems(existingReservations.concat(getTimelineReservationItem(reservation)))
    }
  }

  const clearReservation = (reservationId?: string | null) => {
    if (reservationId !== undefined && reservationId !== null) {
      setItems(items.filter(item => item.id !== reservationId))
    }
    setReservation(undefined)
  }

  useEffect(() => {
    const reservationList: TimelineItem<CustomItemFields, Moment>[] = []
    const suiteList: TimelineGroup<CustomGroupFields>[] = []
    reservationsData?.suites?.forEach((suite: Suites_suites | null) => {
      if (suite !== null) {
        suiteList.push(suite)
      }
    })
    reservationsData?.reservations?.forEach((reservation: SuitesWithReservations_reservations | null) => {
      if (reservation !== null) {
        reservationList.push(getTimelineReservationItem(reservation))
      }
    })
    setItems(reservationList)
    setGroups(suiteList)
  }, [ reservationsData ])

  useEffect(() => {
    setPageTitle(t("home-title"))
    setSelectedPage("reservation")
  }, [ setPageTitle, setSelectedPage, t ])

  // Click on timeline outside of any reservation, 
  // opens modal for new reservation
  const onCanvasClick = (groupId: number, time: number) => {
    const selectedGroup = groups.find(group => group.id === groupId)
    if (selectedGroup !== undefined) {
      const suite = reservationsData?.suites?.find(suite => suite?.id === selectedGroup.id)
      if (suite !== null) {
        setSelectedSuite(suite)
      }
      setReservation({
        fromDate: moment(time),
        suite: { ...selectedGroup },
        price: 0.00,
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
    const timelineItem = items.find(item => item.id === itemId)
    if (timelineItem !== undefined) {
      const suite = reservationsData?.suites?.find(suite => suite?.id === timelineItem.suite.id)
      if (suite !== null) {
        setSelectedSuite(suite)
      }
      setReservation({
        fromDate: moment(timelineItem.start_time),
        guest: timelineItem.guest,
        id: timelineItem.id,
        meal: timelineItem.meal,
        notes: timelineItem.notes,
        price: timelineItem.price,
        purpose: timelineItem.purpose,
        roommates: timelineItem.roommates,
        suite: timelineItem.suite,
        toDate: moment(timelineItem.end_time),
        type: timelineItem.type
      })
      setReservationModalOpen(true)
    }
  }

  return (
    <>
      <Skeleton
        active
        loading={ dataLoading }
        paragraph={ { rows: 5 } }>
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
                    className="side-header">
                    { t("living-units") }
                  </div>
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
      </Skeleton>
      <ReservationModal
        addOrUpdateReservation={ addOrUpdateReservation }
        close={ () => {
          setReservation(undefined)
          setReservationModalOpen(false)
        } }
        isOpen={ reservationModalOpen }
        clearReservation={ clearReservation }
        reservation={ reservation }
        suite={ selectedSuite } />
    </>
  )
})