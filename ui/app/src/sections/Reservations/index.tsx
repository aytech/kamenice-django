import Text from "antd/lib/typography/Text"
import { TimelineGroup, TimelineItem } from "react-calendar-timeline"
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
import "react-calendar-timeline/lib/Timeline.css"
import "./styles.css"
import moment, { Moment } from "moment"
import { CustomGroupFields, CustomItemFields, IReservation, OptionsType, Suite } from "../../lib/Types"
import { ReservationModal } from "./components/ReservationModal"
import { TimelineHeader } from "./components/TimelineHeader"
import { ApolloError, useLazyQuery, useMutation, useReactiveVar } from "@apollo/client"
import { message, Skeleton, Space, Spin } from "antd"
import { useTranslation } from "react-i18next"
import { canvasTimeEnd, canvasTimeStart, pageTitle, reservationItems, reservationMealOptions, reservationModalOpen, reservationTypeOptions, selectedPage, selectedSuite, suiteOptions, suites, timelineGroups } from "../../cache"
import { useParams } from "react-router-dom"
import { TimelineData } from "./data"
import { dateFormat } from "../../lib/Constants"
import { TimelineCalendar } from "./components/TimelineCalendar"
import { DeleteReservationDocument, DeleteReservationMutation, DeleteReservationMutationVariables, DragReservationDocument, DragReservationMutation, DragReservationMutationVariables, ReservationsDocument, ReservationsMetaDocument, ReservationsMetaQuery, ReservationsQuery, UpdateReservationMutationVariables } from "../../lib/graphql/graphql"

// https://github.com/namespace-ee/react-calendar-timeline
export const Reservations = () => {

  const { t } = useTranslation()

  const { open: openReservation } = useParams()

  const items = useReactiveVar(reservationItems)
  let reservationFetchTimeout: MutableRefObject<NodeJS.Timeout | null> = useRef(null)

  const [ initialLoading, setInitialLoading ] = useState<boolean>(true)
  const [ selectedItem, setSelectedItem ] = useState<TimelineItem<CustomItemFields, Moment>>()
  const [ selectedReservation, setSelectedReservation ] = useState<IReservation>()

  const [ getReservationsMeta, { loading: reservationsMetaLoading, data: reservationsMeta } ] = useLazyQuery<ReservationsMetaQuery>(ReservationsMetaDocument, {
    onCompleted: () => setInitialLoading(false),
    onError: (reason: ApolloError) => message.error(reason.message)
  })
  const [ getReservations, { loading: reservationsLoading, data: reservationsData, refetch } ] = useLazyQuery<ReservationsQuery>(ReservationsDocument, {
    onCompleted: () => setInitialLoading(false),
    onError: (reason: ApolloError) => message.error(reason.message)
  })
  const [ dragReservation, { loading: dragLoading } ] = useMutation<DragReservationMutation, DragReservationMutationVariables>(DragReservationDocument, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })
  const [ deleteReservation, { loading: deleteLoading } ] = useMutation<DeleteReservationMutation, DeleteReservationMutationVariables>(DeleteReservationDocument, {
    onCompleted: () => {
      setSelectedItem(undefined)
      setSelectedReservation(undefined)
      reservationModalOpen(false)
      message.success(t("reservations.deleted"))
      refetch()
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const openNewReservationModal = () => {
    setSelectedReservation(TimelineData.getReservationForCreate())
    reservationModalOpen(true)
  }

  // Click on item on the timeline opens modal with existing reservation for editing
  // Note: item is selected on first click, second click registers as click event
  const openUpdateReservationModal = (copy: boolean = false) => {
    const timelineItem = items.find(item => item.id === selectedItem?.id)
    if (timelineItem !== undefined) {
      const suite = reservationsMeta?.suites?.find(suite => suite?.id === timelineItem.suite?.id)
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
      const newEndDate = moment(newStartDate.valueOf() + reservationDuration).hour(timelineItem.end_time.hour()).minute(timelineItem.end_time.minutes())
      const variables: UpdateReservationMutationVariables = {
        data: {
          extraSuitesIds: timelineItem.extraSuites.map(id => Number(id)),
          fromDate: newStartDate.format(dateFormat),
          id: String(timelineItem.reservationId),
          suiteId: newSuite.id,
          toDate: newEndDate.format(dateFormat)
        }
      }
      dragReservation({ variables })
    }
  }

  const onItemSelect = (itemId: string) => {
    const data = TimelineData.selectDeselectItem(items, itemId)
    if (data.item !== null) {
      setSelectedItem(data.item)
    }
    reservationItems(data.items)
  }

  const onItemDeselect = () => {
    setSelectedItem(undefined)
    TimelineData.selectDeselectItem(items)
  }

  const onCopy = () => openUpdateReservationModal(true)

  const onDelete = () => {
    if (selectedItem !== undefined) {
      deleteReservation({
        variables: {
          reservationId: TimelineData.getTimelineReservationItemId(selectedItem.id)
        }
      })
    }
  }

  const onUpdate = () => openUpdateReservationModal()

  const moveToItem = (item?: TimelineItem<CustomItemFields, Moment>, stopMessage?: string) => {
    if (item !== undefined) {
      const center = item.start_time.valueOf()
      const from_time = moment(center).subtract(15, "day")
      const to_time = moment(center).add(15, "day")
      canvasTimeStart(from_time.valueOf())
      canvasTimeEnd(to_time.valueOf())
    } else {
      if (stopMessage !== undefined) {
        message.info(stopMessage)
      }
    }
  }

  const searchReservation = (value: string) => {
    if (value.length === 0) {
      return
    }

    const lowerValue = value.toLocaleLowerCase()
    const isItemMatched = (item: TimelineItem<CustomItemFields, Moment>) => {
      return (item.guest?.name.toLocaleLowerCase().indexOf(lowerValue) !== -1
        || item.guest.surname.toLocaleLowerCase().indexOf(lowerValue) !== -1)
    }
    const foundItems = items.filter(isItemMatched)
      .sort((a, b) => a.start_time.valueOf() - b.start_time.valueOf())

    if (foundItems.length === 0) {
      return
    }

    let matchedItem: TimelineItem<CustomItemFields, Moment>
    // If some reservation is already selected
    if (selectedItem !== undefined) {
      // Check if the selected item is one of the search results
      const foundSelectedIndex = foundItems.findIndex(item => item.id === selectedItem.id)
      if (foundSelectedIndex !== -1 && foundSelectedIndex < (foundItems.length - 1)) {
        matchedItem = foundItems[ foundSelectedIndex + 1 ]
      } else { // this means we're at the end of the search result
        matchedItem = foundItems[ 0 ]
      }
    } else { // if not, just move to the first match
      matchedItem = foundItems[ 0 ]
    }
    onItemSelect(matchedItem.id)
    moveToItem(matchedItem)
  }

  const updateReservations = useCallback((from: number, to: number) => {
    if (reservationFetchTimeout.current !== null) {
      clearTimeout(reservationFetchTimeout.current)
    }
    reservationFetchTimeout.current = setTimeout(() => {
      getReservations({
        variables: {
          startDate: moment(from).format(dateFormat),
          endDate: moment(to).format(dateFormat)
        }
      })
    }, 500)
  }, [ getReservations, reservationFetchTimeout ])

  useEffect(() => {

    const suiteTimelineGroup: TimelineGroup<CustomGroupFields>[] = []
    const suiteOptionValues: OptionsType[] = []
    const suitesList: Suite[] = []
    const reservationOptionMeals: OptionsType[] = []
    const reservationOptionTypes: OptionsType[] = []

    reservationsMeta?.suites?.forEach(suite => {
      if (suite !== null) {
        suitesList.push(suite)
        suiteTimelineGroup.push(suite)
        suiteOptionValues.push({
          label: suite.title,
          value: suite.id
        })
      }
    })
    suiteOptions(suiteOptionValues)
    suites(suitesList)
    timelineGroups(suiteTimelineGroup)

    reservationsMeta?.reservationTypes?.forEach(option => {
      if (option !== null) {
        reservationOptionTypes.push(option)
      }
    })
    reservationsMeta?.reservationMeals?.forEach(option => {
      if (option !== null) {
        reservationOptionMeals.push(option)
      }
    })

    reservationTypeOptions(reservationOptionTypes)
    reservationMealOptions(reservationOptionMeals)
  }, [ reservationsMeta ])

  useEffect(() => {

    const reservationList: TimelineItem<CustomItemFields, Moment>[] = []

    reservationsData?.reservations?.forEach(reservation => {
      if (reservation !== null) {
        reservationList.push(TimelineData.getTimelineReservationItem(reservation, reservation.suite.id, selectedItem?.id))
        reservation.extraSuites.forEach(extra => {
          reservationList.push(TimelineData.getTimelineReservationItem(reservation, extra.id, selectedItem?.id))
        })
      }
      if (openReservation !== undefined && reservation?.id === openReservation) {
        setSelectedReservation(TimelineData.getAppReservation(reservation, reservation.priceSet, reservation.suite.id))
        reservationModalOpen(true)
      }
    })

    reservationItems(reservationList)

  }, [ openReservation, reservationsData, selectedItem ])

  useEffect(() => {
    updateReservations(canvasTimeStart(), canvasTimeEnd())
  }, [ updateReservations ])

  useEffect(() => {
    getReservationsMeta()
  }, [ getReservationsMeta ])

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
          spinning={
            dragLoading
            || reservationsMetaLoading
            || reservationsLoading
            || deleteLoading
          }
          size="large">
          <div id="app-timeline">
            <TimelineHeader
              onAdd={ openNewReservationModal }
              onCopy={ onCopy }
              onDelete={ onDelete }
              onUpdate={ onUpdate }
              searchReservation={ searchReservation }
              selectedItemId={ selectedItem?.id }
              updateReservations={ updateReservations } />
            <TimelineCalendar
              onItemDeselect={ onItemDeselect }
              onItemMove={ onItemMove }
              onItemSelect={ onItemSelect }
              updateReservations={ updateReservations } />
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