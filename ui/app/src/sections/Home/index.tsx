import { ApolloError, useLazyQuery } from '@apollo/client'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import "react-modern-calendar-datepicker/lib/DatePicker.css"
import './styles.css'
import { Empty, message, Row, Skeleton } from 'antd'
import { Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import { SUITES_WITH_RESERVATIONS } from '../../lib/graphql/queries/Suites'
import { SuitesWithReservations, SuitesWithReservations_reservations } from '../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations'
import { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { ReserveCalendar } from '../ReserveCalendar'

interface Props {
  isAuthenticated: boolean
}

export const Home = withRouter(({ history, isAuthenticated }: RouteComponentProps & Props) => {

  const [ getData, { loading, data, refetch } ] = useLazyQuery<SuitesWithReservations>(SUITES_WITH_RESERVATIONS, {
    onError: (reason: ApolloError) => {
      console.error(reason);
      message.error("Chyba při načítání apartmá, kontaktujte správce")
    }
  })

  const filterSuiteReservations = (suite: Suites_suites) => {
    return data?.reservations?.filter((reservation: SuitesWithReservations_reservations | null) => {
      return reservation !== null && reservation.suite.id === suite.id
    })
  }

  const getContent = () => {
    return data?.suites?.length !== undefined && data.suites.length > 0 ? (
      <Row gutter={ 8 }>
        {
          data.suites.map((suite: Suites_suites | null) => {
            return suite !== null ? (
              <ReserveCalendar
                guests={ data.guests }
                key={ suite.id }
                refetch={ refetch }
                reservations={ filterSuiteReservations(suite) }
                suite={ suite } />
            ) : null
          })
        }
      </Row>
    ) : <Empty />
  }

  useEffect(() => {
    if (isAuthenticated === true) {
      getData()
    } else {
      history.push("/login")
    }
  }, [ getData, history, isAuthenticated ])

  return isAuthenticated === true ? (
    <Content className="app-content">
      <div className="home__listings">
        <Title level={ 3 } className="home__listings-title">
          Rezervace / Obsazenost
        </Title>
        <Skeleton
          active
          loading={ loading }>
          { getContent() }
        </Skeleton>
      </div>
    </Content >
  ) : null
})