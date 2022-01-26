import { TimelineGroup, TimelineItem } from "react-calendar-timeline"
import { CustomGroupFields, CustomItemFields, IReservation, ReservationPrice } from "../../lib/Types"
import moment, { Moment } from "moment"
import { Colors } from "../../lib/components/Colors"
import { SuitesWithReservations_reservations, SuitesWithReservations_reservations_priceSet } from "../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations"

interface ITimelineData {
  getAppReservation: (reservation: IReservation, prices: ReservationPrice[], priceSuiteId?: string) => IReservation
  getReservationForCreate: (timelineGroup: TimelineGroup<CustomGroupFields>, time: number) => IReservation
  getReservationForUpdate: (timelineItem: TimelineItem<CustomItemFields, Moment>, copy?: boolean) => IReservation
  getTimelineReservationItem: (reservation: SuitesWithReservations_reservations, groupId: string, selected?: string) => TimelineItem<CustomItemFields, Moment>
  selectDeselectItem: (items: TimelineItem<CustomItemFields, Moment>[], itemId?: string) => TimelineItem<CustomItemFields, Moment>[]
}

export const TimelineData: ITimelineData = {
  getAppReservation: (reservation: IReservation, prices: ReservationPrice[], priceSuiteId?: string) => {
    const price = prices.find(price => price.suite.id === priceSuiteId)
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
      toDate: moment(reservation.toDate)
    }
  },
  getReservationForCreate: (timelineGroup: TimelineGroup<CustomGroupFields>, time: number) => {
    return {
      extraSuites: [],
      fromDate: moment(time).hour(15).minute(0),
      meal: "NOMEAL",
      suite: { ...timelineGroup },
      price: {
        accommodation: "0",
        meal: "0",
        municipality: "0",
        suite: { id: timelineGroup.id, priceBase: timelineGroup.priceBase },
        total: "0"
      },
      toDate: moment(time).add(1, "day").hour(10).minute(0),
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
  getTimelineReservationItem: (reservation: SuitesWithReservations_reservations, groupId: string, selected?: string) => {
    const price = reservation.priceSet.find((set: SuitesWithReservations_reservations_priceSet) => set.suite.id === groupId)
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
      roommates: reservation.roommates,
      start_time: moment(reservation.fromDate),
      suite: reservation.suite,
      title: `${ reservation.guest.name } ${ reservation.guest.surname }`,
      type: reservation.type
    }
  },
  selectDeselectItem: (items: TimelineItem<CustomItemFields, Moment>[], itemId?: string) => {
    const updatedItems: TimelineItem<CustomItemFields, Moment>[] = []
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
      updatedItems.push(updatedItem)
    })
    return updatedItems
  }
}