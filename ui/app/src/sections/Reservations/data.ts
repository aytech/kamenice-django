import { TimelineGroup, TimelineItem } from "react-calendar-timeline"
import { CustomGroupFields, CustomItemFields, IReservation } from "../../lib/Types"
import moment, { Moment } from "moment"
import { Colors } from "../../lib/components/Colors"
import { SuitesWithReservations_reservations } from "../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations"

interface ITimelineData {
  getReservationForCreate: (timelineGroup: TimelineGroup<CustomGroupFields>, time: number) => IReservation
  getReservationForUpdate: (timelineItem: TimelineItem<CustomItemFields, Moment>) => IReservation
  getTimelineReservationItem: (reservation: SuitesWithReservations_reservations, selected?: string) => TimelineItem<CustomItemFields, Moment>
  selectDeselectItem: (items: TimelineItem<CustomItemFields, Moment>[], itemId?: number) => TimelineItem<CustomItemFields, Moment>[]
}

export const TimelineData: ITimelineData = {
  getReservationForCreate: (timelineGroup: TimelineGroup<CustomGroupFields>, time: number) => {
    return {
      fromDate: moment(time).hour(15).minute(0),
      meal: "NOMEAL",
      suite: { ...timelineGroup },
      priceAccommodation: 0,
      priceMeal: 0,
      priceMunicipality: 0,
      priceTotal: 0,
      toDate: moment(time).add(1, "day").hour(10).minute(0),
      type: "NONBINDING"
    }
  },
  getReservationForUpdate: (timelineItem: TimelineItem<CustomItemFields, Moment>) => {
    return {
      expired: timelineItem.expired !== null ? moment(timelineItem.expired) : null,
      fromDate: moment(timelineItem.start_time),
      guest: timelineItem.guest,
      id: timelineItem.id,
      meal: timelineItem.meal,
      notes: timelineItem.notes,
      payingGuest: timelineItem.payingGuest,
      priceAccommodation: timelineItem.priceAccommodation,
      priceMeal: timelineItem.priceMeal,
      priceMunicipality: timelineItem.priceMunicipality,
      priceTotal: timelineItem.priceTotal,
      purpose: timelineItem.purpose,
      roommates: timelineItem.roommates,
      suite: timelineItem.suite,
      toDate: moment(timelineItem.end_time),
      type: timelineItem.type
    }
  },
  getTimelineReservationItem: (reservation: SuitesWithReservations_reservations, selected?: string) => {
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
          background: selected === reservation.id
            ? Colors.getReservationColor("SELECTED")
            : Colors.getReservationColor(reservation.type),
          border: "none"
        }
      },
      meal: reservation.meal,
      notes: reservation.notes,
      payingGuest: reservation.payingGuest,
      priceAccommodation: reservation.priceAccommodation,
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
  },
  selectDeselectItem: (items: TimelineItem<CustomItemFields, Moment>[], itemId?: number) => {
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