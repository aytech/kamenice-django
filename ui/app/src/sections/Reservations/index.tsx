import { RouteComponentProps, useParams, withRouter } from "react-router-dom"
import Text from "antd/lib/typography/Text"
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
import { message, Skeleton, Space } from "antd"
import { useTranslation } from "react-i18next"
import { timelineGroupsVar } from "../../cache"

interface Props {
  setPageTitle: (title: string) => void
  setSelectedPage: (page: MenuItemKey) => void
}

// https://github.com/namespace-ee/react-calendar-timeline
export const Reservations = withRouter(({
  setPageTitle,
  setSelectedPage
}: RouteComponentProps & Props) => {

  const { open: openReservation }: { open: string } = useParams()

  const { t } = useTranslation()

  const [ items, setItems ] = useState<TimelineItem<CustomItemFields, Moment>[]>([])
  const [ selectedReservation, setSelectedReservation ] = useState<IReservation>()
  const [ reservationModalOpen, setReservationModalOpen ] = useState<boolean>(false)
  const [ selectedSuite, setSelectedSuite ] = useState<Suites_suites>()

  const { loading, data, refetch } = useQuery<SuitesWithReservations>(SUITES_WITH_RESERVATIONS, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const getTimelineReservationItem = (reservation: SuitesWithReservations_reservations): TimelineItem<CustomItemFields, Moment> => {
    return {
      color: Colors.getReservationColor(reservation.type),
      end_time: moment(reservation.toDate),
      expired: reservation.expired !== null ? moment(reservation.expired) : null,
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
      payingGuest: reservation.payingGuest,
      priceAccommodation: reservation.priceAccommodation,
      priceExtra: reservation.priceExtra,
      priceMeal: reservation.priceMeal,
      priceMunicipality: reservation.priceMunicipality,
      priceTotal: reservation.priceTotal,
      purpose: reservation.purpose,
      roommates: reservation.roommates,
      start_time: moment(reservation.fromDate),
      suite: reservation.suite,
      title: `${ reservation.guest.name } ${ reservation.guest.surname }`,
      type: reservation.type
    }
  }

  const updateSelectedReservation = (reservation?: SuitesWithReservations_reservations) => {
    if (reservation !== undefined) {
      setSelectedReservation({
        ...reservation,
        expired: reservation.expired !== null ? moment(reservation.expired) : null,
        fromDate: moment(reservation.fromDate),
        toDate: moment(reservation.toDate)
      })
    }
  }

  useEffect(() => {
    const reservationList: TimelineItem<CustomItemFields, Moment>[] = []
    const suiteList: TimelineGroup<CustomGroupFields>[] = []

    data?.suites?.forEach(suite => {
      if (suite !== null) {
        suiteList.push(suite)
      }
    })
    timelineGroupsVar(suiteList)

    data?.reservations?.forEach(reservation => {
      if (reservation !== null) {
        reservationList.push(getTimelineReservationItem(reservation))
      }
      if (openReservation !== undefined && reservation?.id === openReservation) {
        updateSelectedReservation(reservation)
        setReservationModalOpen(true)
      }
    })
    setItems(reservationList)

  }, [ data, openReservation ])

  useEffect(() => {
    setPageTitle(t("home-title"))
    setSelectedPage("reservation")
  }, [ setPageTitle, setSelectedPage, t ])

  // Click on timeline outside of any reservation, 
  // opens modal for new reservation
  const onCanvasClick = (groupId: number, time: number) => {
    const selectedGroup = timelineGroupsVar().find(group => group.id === groupId)
    if (selectedGroup !== undefined) {
      const suite = data?.suites?.find(suite => suite?.id === selectedGroup.id)
      if (suite !== null) {
        setSelectedSuite(suite)
      }
      setSelectedReservation({
        fromDate: moment(time),
        meal: "NOMEAL",
        suite: { ...selectedGroup },
        priceAccommodation: "0.00",
        priceExtra: "0.00",
        priceMeal: "0.00",
        priceMunicipality: "0.00",
        priceTotal: "0.00",
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
      const suite = data?.suites?.find(suite => suite?.id === timelineItem.suite.id)
      if (suite !== null) {
        setSelectedSuite(suite)
      }
      setSelectedReservation({
        expired: timelineItem.expired !== null ? moment(timelineItem.expired) : null,
        fromDate: moment(timelineItem.start_time),
        guest: timelineItem.guest,
        id: timelineItem.id,
        meal: timelineItem.meal,
        notes: timelineItem.notes,
        payingGuest: timelineItem.payingGuest,
        priceAccommodation: timelineItem.priceAccommodation,
        priceExtra: timelineItem.priceExtra,
        priceMeal: timelineItem.priceMeal,
        priceMunicipality: timelineItem.priceMunicipality,
        priceTotal: timelineItem.priceTotal,
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
        loading={ loading }
        paragraph={ { rows: 5 } }>
        <div id="app-timeline">
          <Timeline
            canChangeGroup={ false }
            canMove={ false }
            canResize={ false }
            defaultTimeEnd={ moment().add(12, "day") }
            defaultTimeStart={ moment().add(-12, "day") }
            groupRenderer={ ({ group }) => {
              return (
                <Title level={ 5 }>{ group.title }</Title>
              )
            } }
            groups={ timelineGroupsVar() }
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
          <Space align="end" className="app-footer">
            <Text disabled>&reg;{ t("company-name") }</Text>
          </Space>
        </div>
      </Skeleton>
      <ReservationModal
        close={ () => {
          setSelectedReservation(undefined)
          setReservationModalOpen(false)
        } }
        isOpen={ reservationModalOpen }
        refetch={ (selected?: IReservation) => {
          updateSelectedReservation(selected as SuitesWithReservations_reservations)
          refetch()
        } }
        reservation={ selectedReservation }
        suite={ selectedSuite } />
    </>
  )
})