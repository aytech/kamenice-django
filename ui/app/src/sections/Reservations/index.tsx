import Text from "antd/lib/typography/Text"
import Title from "antd/lib/typography/Title"
import Timeline, { CursorMarker, DateHeader, SidebarHeader, TimelineGroup, TimelineHeaders, TimelineItem } from "react-calendar-timeline"
import { useEffect, useState } from "react"
import "react-calendar-timeline/lib/Timeline.css"
import "./styles.css"
import moment, { Moment } from "moment"
import { CustomGroupFields, CustomItemFields, IReservation, OptionsType } from "../../lib/Types"
import { ReservationItem } from "./components/ReservationItem"
import { ReservationModal } from "./components/ReservationModal"
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client"
import { SUITES_WITH_RESERVATIONS } from "../../lib/graphql/queries/Suites"
import { SuitesWithReservations } from "../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations"
import { Button, message, Skeleton, Space, Spin } from "antd"
import { useTranslation } from "react-i18next"
import { pageTitle, reservationMealOptions, reservationModalOpen, reservationTypeOptions, selectedPage, selectedSuite, suiteOptions, timelineGroups } from "../../cache"
import { useParams } from "react-router-dom"
import { TimelineData } from "./data"
import { UpdateReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/UpdateReservation"
import { dateFormat } from "../../lib/Constants"
import { DragReservation, DragReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/DragReservation"
import { DELETE_RESERVATION, DRAG_RESERVATION } from "../../lib/graphql/mutations/Reservation"
import { DeleteReservation, DeleteReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/DeleteReservation"
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons"

// https://github.com/namespace-ee/react-calendar-timeline
export const Reservations = () => {

  const { t } = useTranslation()
  const { open: openReservation } = useParams()

  const [ initialLoading, setInitialLoading ] = useState<boolean>(true)
  const [ canvasTimeEnd, setCanvasTimeEnd ] = useState<number>(moment().add(15, "day").valueOf())
  const [ canvasTimeStart, setCanvasTimeStart ] = useState<number>(moment().subtract(15, "day").valueOf())
  const [ items, setItems ] = useState<TimelineItem<CustomItemFields, Moment>[]>([])
  const [ selectedItem, setSelectedItem ] = useState<string>()
  const [ selectedReservation, setSelectedReservation ] = useState<IReservation>()
  const [ lastFrameEndTime ] = useState<number>(moment().add(1, "year").valueOf())
  const [ lastFrameStartTime ] = useState<number>(moment(lastFrameEndTime).subtract(1, "month").valueOf())
  const [ firstFrameStartTime ] = useState<number>(moment().subtract(1, "year").valueOf())
  const [ firstFrameEndTime ] = useState<number>(moment(firstFrameStartTime).add(1, "month").valueOf())

  const [ getReservations, { loading: dataLoading, data: reservationsData, refetch } ] = useLazyQuery<SuitesWithReservations>(SUITES_WITH_RESERVATIONS, {
    onCompleted: () => setInitialLoading(false),
    onError: (reason: ApolloError) => message.error(reason.message)
  })
  const [ dragReservation, { loading: dragLoading } ] = useMutation<DragReservation, DragReservationVariables>(DRAG_RESERVATION, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })
  const [ deleteReservation, { loading: deleteLoading } ] = useMutation<DeleteReservation, DeleteReservationVariables>(DELETE_RESERVATION, {
    onCompleted: () => {
      setSelectedReservation(undefined)
      reservationModalOpen(false)
      message.success(t("reservations.deleted"))
      refetch()
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  // Click on timeline outside of any reservation, 
  // opens modal for new reservation
  const openNewReservationModal = (groupId: number, time: number) => {
    const selectedGroup = timelineGroups().find(group => group.id === groupId)
    if (selectedGroup !== undefined) {
      const suite = reservationsData?.suites?.find(suite => suite?.id === selectedGroup.id)
      if (suite !== null) {
        selectedSuite(suite)
      }
      setSelectedReservation(TimelineData.getReservationForCreate(selectedGroup, time))
      reservationModalOpen(true)
    }
  }

  // Click on item on the timeline opens modal with existing reservation for editing
  // Note: item is selected on first click, second click registers as click event
  const openUpdateReservationModal = (itemId: string, copy: boolean = false) => {
    const timelineItem = items.find(item => item.id === itemId)
    if (timelineItem !== undefined) {
      const suite = reservationsData?.suites?.find(suite => suite?.id === timelineItem.suite.id)
      if (suite !== null) {
        selectedSuite(suite)
      }
      setSelectedReservation(TimelineData.getReservationForUpdate(timelineItem, copy))
      reservationModalOpen(true)
    }
  }

  const onItemMove = (itemId: string, dragTime: number, newGroupOrder: number) => {
    const newSuite = timelineGroups()[ newGroupOrder ]
    const timelineItem = items.find(item => item.id === itemId)
    if (newSuite !== undefined && timelineItem !== undefined) {
      const reservationDuration: number = moment(timelineItem.end_time).diff(timelineItem.start_time)
      const newStartDate = moment(dragTime).hour(timelineItem.start_time.hour()).minute(timelineItem.start_time.minutes())
      const newEndDate = moment(dragTime + reservationDuration).hour(timelineItem.end_time.hour()).minute(timelineItem.end_time.minutes())
      const variables: UpdateReservationVariables = {
        data: {
          fromDate: newStartDate.format(dateFormat),
          id: String(timelineItem.id),
          suiteId: Number(newSuite.id),
          toDate: newEndDate.format(dateFormat)
        }
      }
      dragReservation({ variables })
    }
  }

  const onItemSelect = (itemId: string) => {
    setSelectedItem(String(itemId))
    setItems(TimelineData.selectDeselectItem(items, itemId))
  }

  const onItemDeselect = () => {
    setSelectedItem(undefined)
    TimelineData.selectDeselectItem(items)
  }

  const onCopy = (itemId: string) => openUpdateReservationModal(itemId, true)

  const onDelete = (reservationId: string) => deleteReservation({ variables: { reservationId } })

  const onUpdate = (itemId: string) => openUpdateReservationModal(itemId)

  const moveToItem = (stopMessage: string, item?: TimelineItem<CustomItemFields, Moment>) => {
    if (item !== undefined) {
      const center = item.start_time.valueOf()
      const from_time = moment(center).subtract(15, "day")
      const to_time = moment(center).add(15, "day")
      setCanvasTimeStart(from_time.valueOf())
      setCanvasTimeEnd(to_time.valueOf())
    } else {
      message.info(stopMessage)
    }
  }

  const moveForward = () => moveToItem(
    t("tooltips.no-later-items"),
    items.find(item => item.start_time.valueOf() > canvasTimeEnd)
  )

  const moveBackwards = () => moveToItem(
    t("tooltips.no-earlier-items"),
    items.slice().reverse().find(item => item.start_time.valueOf() < canvasTimeStart)
  )

  useEffect(() => {
    const reservationList: TimelineItem<CustomItemFields, Moment>[] = []
    const suiteList: TimelineGroup<CustomGroupFields>[] = []
    const suiteOptionValues: OptionsType[] = []
    const reservationOptionMeals: OptionsType[] = []
    const reservationOptionTypes: OptionsType[] = []

    reservationsData?.suites?.forEach(suite => {
      if (suite !== null) {
        suiteList.push(suite)
        suiteOptionValues.push({
          label: suite.title,
          value: suite.id
        })
      }
    })
    suiteOptions(suiteOptionValues)
    timelineGroups(suiteList)

    reservationsData?.reservations?.forEach(reservation => {
      if (reservation !== null) {
        reservationList.push(TimelineData.getTimelineReservationItem(reservation, reservation.suite.id, selectedItem))
        reservation.extraSuites.forEach(extra => {
          reservationList.push(TimelineData.getTimelineReservationItem(reservation, extra.id, selectedItem))
        })
      }
      if (openReservation !== undefined && reservation?.id === openReservation) {
        setSelectedReservation(TimelineData.getAppReservation(reservation, reservation.priceSet))
        reservationModalOpen(true)
      }
    })
    reservationsData?.reservationTypes?.forEach(option => {
      if (option !== null) {
        reservationOptionTypes.push(option)
      }
    })
    reservationsData?.reservationMeals?.forEach(option => {
      if (option !== null) {
        reservationOptionMeals.push(option)
      }
    })

    setItems(reservationList)
    reservationTypeOptions(reservationOptionTypes)
    reservationMealOptions(reservationOptionMeals)

  }, [ reservationsData, openReservation, selectedItem ])

  useEffect(() => {
    getReservations({
      variables: {
        startDate: moment().add(-1, "year").format(dateFormat),
        endDate: moment().add(1, "year").format(dateFormat)
      }
    })
  }, [ getReservations ])

  useEffect(() => {
    pageTitle(t("home-title"))
    selectedPage("reservation")
  }, [ t ])

  return (
    <>
      <Skeleton
        active
        loading={ initialLoading }
        paragraph={ { rows: 5 } }>
        <Spin
          spinning={ dragLoading || dataLoading }
          size="large">
          <div id="app-timeline">
            <Space align="end" className="app-footer">
              <Button
                icon={ <CaretLeftOutlined /> }
                onClick={ moveBackwards }
                shape="circle" />
              <Button
                icon={ <CaretRightOutlined /> }
                onClick={ moveForward }
                shape="circle" />
            </Space>
            <Timeline
              canChangeGroup={ true }
              canMove={ true }
              canResize={ false }
              defaultTimeEnd={ moment().add(1, "day") }
              defaultTimeStart={ moment().subtract(1, "day") }
              groupRenderer={ ({ group }) => {
                return (
                  <Title level={ 5 }>
                    { group.title }
                  </Title>
                )
              } }
              groups={ timelineGroups() }
              itemRenderer={ props =>
                <ReservationItem
                  { ...props }
                  onCopy={ onCopy }
                  onDelete={ onDelete }
                  onUpdate={ onUpdate } />
              }
              items={ items }
              itemTouchSendsClick={ true }
              lineHeight={ 60 }
              onCanvasDoubleClick={ openNewReservationModal }
              onItemDeselect={ onItemDeselect }
              onItemMove={ onItemMove }
              onItemSelect={ onItemSelect }
              onTimeChange={ (visibleTimeStart: number, visibleTimeEnd: number, updateScrollCanvas: (start: number, end: number) => void) => {
                if (visibleTimeEnd > lastFrameEndTime) {
                  setCanvasTimeEnd(lastFrameEndTime)
                  setCanvasTimeStart(lastFrameStartTime)
                  updateScrollCanvas(lastFrameStartTime, lastFrameEndTime)
                } else if (visibleTimeStart < firstFrameStartTime) {
                  setCanvasTimeEnd(firstFrameEndTime)
                  setCanvasTimeStart(firstFrameStartTime)
                  updateScrollCanvas(firstFrameStartTime, firstFrameEndTime)
                } else {
                  setCanvasTimeEnd(visibleTimeEnd)
                  setCanvasTimeStart(visibleTimeStart)
                  updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
                }
              } }
              visibleTimeEnd={ canvasTimeEnd }
              visibleTimeStart={ canvasTimeStart }>
              <TimelineHeaders>
                <SidebarHeader>
                  { ({ getRootProps }) => {
                    return (
                      <div
                        { ...getRootProps() }
                        className="side-header">
                        { t("rooms.nav-title") }
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
        </Spin>
      </Skeleton>
      <ReservationModal
        close={ () => {
          setSelectedReservation(undefined)
          reservationModalOpen(false)
        } }
        refetch={ (selected?: IReservation) => {
          if (selected !== undefined) {
            setSelectedReservation(selected)
          }
          refetch()
        } }
        remove={ (reservationId: string) => {
          deleteReservation({ variables: { reservationId } })
        } }
        removing={ deleteLoading }
        reservation={ selectedReservation } />
    </>
  )
}