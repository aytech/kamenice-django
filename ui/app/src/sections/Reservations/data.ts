import { TimelineItem } from "react-calendar-timeline"
import { CustomItemFields, IReservation, ReservationPrice } from "../../lib/Types"
import moment, { Moment } from "moment"
import { Colors } from "../../lib/components/Colors"

interface ITimelineData {
  getAppReservation: (reservation: IReservation, prices: ReservationPrice[], priceSuiteId?: string) => IReservation
  getReservationForCreate: () => IReservation
  getReservationForUpdate: (timelineItem: TimelineItem<CustomItemFields, Moment>, copy?: boolean) => IReservation
  getTimelineReservationGroupId: (itemId: string) => string
  getTimelineReservationItem: (reservation: IReservation, groupId: string, selected?: string) => TimelineItem<CustomItemFields, Moment>
  getTimelineReservationItemId: (itemId: string) => string
  selectDeselectItem: (items: TimelineItem<CustomItemFields, Moment>[], itemId?: string) => { items: TimelineItem<CustomItemFields, Moment>[], item: TimelineItem<CustomItemFields, Moment> | null }
}

export const TimelineData: ITimelineData = {
  getAppReservation: (reservation: IReservation, prices: ReservationPrice[], priceSuiteId?: string) => {
    const price = prices.find(price => price.suite?.id === priceSuiteId)
    return {
      ...reservation,
      expired: reservation.expired !== null ? moment(reservation.expired) : null,
      extraSuites: reservation.extraSuites,
      fromDate: moment(reservation.fromDate),
      price: price === undefined ? {
        accommodation: "0",
        meal: "0",
        municipality: "0",
        suite: reservation.suite,
        total: "0"
      } : price,
      roommates: reservation.roommateSet?.map(roommate => {
        return { ...roommate.entity, fromDate: moment(roommate.fromDate) }
      }),
      toDate: moment(reservation.toDate)
    }
  },
  getReservationForCreate: () => {
    return {
      extraSuites: [],
      fromDate: moment().hour(15).minute(0),
      meal: "NOMEAL",
      price: {
        accommodation: "0",
        meal: "0",
        municipality: "0",
        total: "0"
      },
      toDate: moment().add(1, "day").hour(10).minute(0),
      type: "INQUIRY"
    }
  },
  getReservationForUpdate: (timelineItem: TimelineItem<CustomItemFields, Moment>, copy: boolean = false) => {
    return {
      expired: timelineItem.expired !== null ? moment(timelineItem.expired) : null,
      extraSuites: timelineItem.extraSuites,
      fromDate: moment(timelineItem.start_time),
      guest: timelineItem.guest,
      id: copy === true ? undefined : timelineItem.reservationId,
      meal: timelineItem.meal,
      notes: timelineItem.notes,
      payingGuest: timelineItem.payingGuest,
      price: timelineItem.price,
      purpose: timelineItem.purpose,
      roommates: timelineItem.roommates,
      suite: timelineItem.suite,
      toDate: moment(timelineItem.end_time),
      type: timelineItem.type
    }
  },
  getTimelineReservationGroupId: (itemId: string) => {
    return itemId.substring(0, itemId.indexOf("-"))
  },
  getTimelineReservationItem: (reservation: IReservation, groupId: string, selected?: string) => {
    const price = reservation.priceSet?.find((price: ReservationPrice) => price.suite?.id === groupId)
    return {
      color: Colors.getReservationColor(reservation.type),
      end_time: moment(reservation.toDate),
      expired: reservation.expired !== null ? moment(reservation.expired) : null,
      extraSuites: reservation.extraSuites,
      group: groupId,
      guest: reservation.guest,
      id: `${ groupId }-${ reservation.id }`,
      itemProps: {
        className: 'reservation-item',
        style: {
          background: selected === `${ groupId }-${ reservation.id }`
            ? Colors.getReservationColor("SELECTED")
            : Colors.getReservationColor(reservation.type),
          border: "none"
        }
      },
      meal: reservation.meal,
      notes: reservation.notes,
      payingGuest: reservation.payingGuest,
      price: price !== undefined ? price : {
        accommodation: "0",
        meal: "0",
        municipality: "0",
        suite: reservation.suite,
        total: "0"
      },
      purpose: reservation.purpose,
      reservationId: reservation.id,
      roommates: reservation.roommateSet?.map(roommate => {
        return { ...roommate.entity, fromDate: moment(roommate.fromDate) }
      }),
      start_time: moment(reservation.fromDate),
      suite: reservation.suite,
      title: `${ reservation.guest?.name } ${ reservation.guest?.surname }`,
      type: reservation.type
    }
  },
  getTimelineReservationItemId: (groupItemId: string) => {
    return groupItemId.substring(groupItemId.indexOf("-") + 1)
  },
  selectDeselectItem: (items: TimelineItem<CustomItemFields, Moment>[], itemId?: string) => {
    const updatedItems: TimelineItem<CustomItemFields, Moment>[] = []
    let selectedItem: TimelineItem<CustomItemFields, Moment> | null = null
    items.forEach(item => {
      const updatedItem = item
      updatedItem.itemProps = {
        ...item.itemProps,
        style: {
          ...item.itemProps?.style,
          background: item.id === itemId
            ? Colors.getReservationColor("SELECTED")
            : Colors.getReservationColor(item.type)
        }
      }
      if (updatedItem.id === itemId) {
        selectedItem = updatedItem
      }
      updatedItems.push(updatedItem)
    })
    return { items: updatedItems, item: selectedItem }
  }
}