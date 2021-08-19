import { RouteComponentProps, withRouter } from "react-router-dom"
import Title from "antd/lib/typography/Title"
import Timeline, { CursorMarker, DateHeader, SidebarHeader, TimelineGroup, TimelineHeaders, TimelineItem } from "react-calendar-timeline"
import { useEffect, useState } from "react"
import { Empty, message } from "antd"
import "react-calendar-timeline/lib/Timeline.css"
import "./styles.css"
import moment, { Moment } from "moment"
import { CustomGroupFields, CustomItemFields, IReservation } from "../../lib/Types"
import { Reservations_reservations } from "../../lib/graphql/queries/Reservations/__generated__/Reservations"
import { Colors } from "../../lib/components/Colors"
import { ReservationItem } from "./components/ReservationItem"
import { ReservationModal } from "../ReservationModal"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { HomePage_guests } from "../../lib/graphql/queries/App/__generated__/HomePage"
import { Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import { CreateReservation, CreateReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/CreateReservation"
import { UpdateReservation, UpdateReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/UpdateReservation"
import { DeleteReservation, DeleteReservationVariables } from "../../lib/graphql/mutations/Reservation/__generated__/DeleteReservation"
import { CREATE_RESERVATION, DELETE_RESERVATION, UPDATE_RESERVATION } from "../../lib/graphql/mutations/Reservation"
import { errorMessages } from "../../lib/Constants"

interface Props {
  guests?: (HomePage_guests | null)[] | null
  reauthenticate: (callback: () => void, errorHandler?: (reason: ApolloError) => void) => void
  reservationsData?: (Reservations_reservations | null)[] | null
  setPageTitle: (title: string) => void
  suitesData?: (Suites_suites | null)[] | null
}

// https://github.com/namespace-ee/react-calendar-timeline
export const Reservations = withRouter(({
  guests,
  reauthenticate,
  reservationsData,
  setPageTitle,
  suitesData
}: RouteComponentProps & Props) => {

  const [ createReservation ] = useMutation<CreateReservation, CreateReservationVariables>(CREATE_RESERVATION)
  const [ updateReservation ] = useMutation<UpdateReservation, UpdateReservationVariables>(UPDATE_RESERVATION)
  const [ deleteReservation ] = useMutation<DeleteReservation, DeleteReservationVariables>(DELETE_RESERVATION)

  const [ groups, setGroups ] = useState<TimelineGroup<CustomGroupFields>[]>([])
  const [ items, setItems ] = useState<TimelineItem<CustomItemFields, Moment>[]>([])

  const [ reservation, setReservation ] = useState<IReservation>()
  const [ reservationModalOpen, setReservationModalOpen ] = useState<boolean>(false)

  const getTimelineReservationItem = (reservation: Reservations_reservations): TimelineItem<CustomItemFields, Moment> => {
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
      purpose: reservation.purpose,
      roommates: reservation.roommates,
      start_time: moment(reservation.fromDate),
      suite: reservation.suite,
      title: `${ reservation.guest.name } ${ reservation.guest.surname }`,
      type: reservation.type
    }
  }

  const addReservation = (reservation?: Reservations_reservations | null) => {
    if (reservation !== undefined && reservation !== null) {
      const existingReservation = items.find(item => item.id === reservation.id)
      if (existingReservation === undefined) {
        setItems(items.concat(getTimelineReservationItem(reservation)))
      }
    }
  }

  const removeReservation = (reservationId?: string | null) => {
    if (reservationId !== undefined && reservationId !== null) {
      setItems(items.filter(item => item.id !== reservationId))
    }
    setReservation(undefined)
  }

  const updateReservationState = (reservation?: Reservations_reservations | null) => {
    if (reservation !== undefined && reservation !== null) {
      const reservations = items.filter(item => item.id !== reservation.id)
      setItems(reservations.concat(getTimelineReservationItem(reservation)))
    }
  }

  const errorHandler = (reason: ApolloError, callback: () => void) => {
    if (reason.message === errorMessages.signatureExpired) {
      reauthenticate(callback, (reason: ApolloError) => message.error(reason.message))
    } else {
      message.error(reason.message)
    }
  }

  const removeReservationAction = (reservationId: string | number) => {
    const handler = () => deleteReservation({ variables: { reservationId: String(reservationId) } })
      .then((value: FetchResult<DeleteReservation>) => {
        setReservationModalOpen(false)
        removeReservation(value.data?.deleteReservation?.reservation?.id)
        message.success("Rezervace byla odstraněna!")
      })
    handler().catch((reason: ApolloError) => errorHandler(reason, handler))
  }

  const updateReservationAction = (reservationId: string, variables: any) => {
    const submitUpdatedReservation =
      () => updateReservation({ variables: { data: { ...variables, id: reservationId } } })
        .then((value: FetchResult<UpdateReservation>) => {
          setReservationModalOpen(false)
          updateReservationState(value.data?.updateReservation?.reservation)
          message.success("Rezervace byla aktualizována!")
        })
    submitUpdatedReservation()
      .catch((reason: ApolloError) => errorHandler(reason, submitUpdatedReservation))
  }

  const newReservationAction = (variables: any) => {
    const submitNewReservation = () => createReservation({ variables: { data: variables } })
      .then((value: FetchResult<CreateReservation>) => {
        setReservationModalOpen(false)
        addReservation(value.data?.createReservation?.reservation)
        message.success("Rezervace byla vytvořena!")
      })
    submitNewReservation()
      .catch((reason: ApolloError) => errorHandler(reason, submitNewReservation))
  }

  useEffect(() => {
    setPageTitle("Rezervace / Obsazenost")
  }, [ setPageTitle ])

  useEffect(() => {
    const reservationList: TimelineItem<CustomItemFields, Moment>[] = []
    reservationsData?.forEach((reservation: Reservations_reservations | null) => {
      if (reservation !== null) {
        reservationList.push(getTimelineReservationItem(reservation))
      }
    })
    setItems(reservationList)
  }, [ reservationsData ])

  useEffect(() => {
    const suiteList: TimelineGroup<CustomGroupFields>[] = []
    suitesData?.forEach((suite: Suites_suites | null) => {
      if (suite !== null) {
        suiteList.push({ ...suite, stackItems: true })
      }
    })
    setGroups(suiteList)
  }, [ suitesData ])

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
    const timelineItem = items.find(item => item.id === itemId)
    if (timelineItem !== undefined) {
      setReservation({
        fromDate: moment(timelineItem.start_time),
        guest: timelineItem.guest,
        id: timelineItem.id,
        meal: timelineItem.meal,
        notes: timelineItem.notes,
        purpose: timelineItem.purpose,
        roommates: timelineItem.roommates,
        suite: timelineItem.suite,
        toDate: moment(timelineItem.end_time),
        type: timelineItem.type
      })
      setReservationModalOpen(true)
    }
  }

  return reservationsData !== null ? (
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
        createReservation={ newReservationAction }
        guests={ guests }
        isOpen={ reservationModalOpen }
        reauthenticate={ reauthenticate }
        removeReservation={ removeReservationAction }
        reservation={ reservation }
        updateReservation={ updateReservationAction } />
    </>
  ) : <Empty />
})