import { useQuery } from "@apollo/client"
import { Content } from "antd/lib/layout/layout"
import Title from "antd/lib/typography/Title"
import Timeline from "react-calendar-timeline"
import { useEffect, useState } from "react"
import { RESERVATIONS } from "../../lib/graphql/queries/Reservations"
import { Reservations, Reservations_reservations } from "../../lib/graphql/queries/Reservations/__generated__/Reservations"
import "react-calendar-timeline/lib/Timeline.css"
import "./styles.css"
import moment, { Moment } from "moment"

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

  const { data, refetch } = useQuery<Reservations>(RESERVATIONS)

  const [ groups, setGroups ] = useState<{ id: number, stackItems: boolean, title: string }[]>([
    {
      id: 1,
      stackItems: true,
      title: "Apartma 2 + 1"
    },
    {
      id: 2,
      stackItems: true,
      title: "Apartma 2 + 2"
    }
  ])
  const [ items, setItems ] = useState<{ end_time: Moment, group: number, id: number, itemProps: any, start_time: Moment, title: string }[]>([
    {
      end_time: moment("2021-07-09T10:00"),
      group: 1,
      id: 1,
      itemProps: {
        className: "weekend",
        style: {
          background: "#db913c"
        }
      },
      start_time: moment("2021-07-05T14:00"),
      title: "Oleg Yapparov"
    },
    {
      end_time: moment("2021-07-16T10:00"),
      group: 2,
      id: 2,
      itemProps: {
        className: "weekend",
        style: {
          background: "#0eca2d"
        }
      },
      start_time: moment("2021-07-12T14:00"),
      title: "Alice Ambrozova"
    },
    {
      end_time: moment("2021-07-16T10:00"),
      group: 1,
      id: 3,
      itemProps: {
        className: "weekend",
        style: {
          background: "#9c88ff"
        }
      },
      start_time: moment("2021-07-12T14:00"),
      title: "Iva Ambrozova"
    },
    {
      end_time: moment("2021-07-23T10:00"),
      group: 1,
      id: 4,
      itemProps: {
        className: "weekend",
        style: {
          background: "#e4e724"
        }
      },
      start_time: moment("2021-07-19T14:00"),
      title: "Oleg Yapparov"
    },
  ])

  useEffect(() => {
    const groups: { id: number, stackItems: boolean, title: string }[] = []
    const reservations: { end_time: Moment, group: number, id: number, itemProps: any, start_time: Moment, title: string }[] = []
    data?.reservations?.forEach((reservation: Reservations_reservations | null) => {
      if (reservation !== null) {
        const groupIndex = groups.findIndex(group => group.id === +reservation.suite.id)
        if (groupIndex === -1) {
          groups.push({
            id: +reservation.suite.id,
            stackItems: true,
            title: reservation.suite.title
          })
        }
        reservations.push({
          end_time: moment(reservation.toDate),
          group: +reservation.suite.id,
          id: +reservation.id,
          itemProps: {
            className: 'weekend',
            style: {
              background: getReservationColor(reservation.type)
            }
          },
          start_time: moment(reservation.fromDate),
          title: `${reservation.guest.name} ${reservation.guest.surname}`
        })
      }
    })
    // setGroups(groups)
    // setItems(reservations)
  }, [ data ])

  useEffect(() => {
    refetch()
  }, [ refetch ])

  return (
    <Content className="app-content">
      <Title level={ 3 } className="home__listings-title">
        Přehled
      </Title>
      <Timeline
        defaultTimeEnd={ moment().add(20, "day") }
        defaultTimeStart={ moment().add(-20, "day") }
        groups={ groups }
        items={ items } />
    </Content>
  )
}