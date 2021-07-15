import { useLazyQuery, useQuery } from '@apollo/client'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import "react-modern-calendar-datepicker/lib/DatePicker.css"
import './styles.css'
import { ReserveCalendar } from '../ReserveCalendar'
import { Empty, message, Row } from 'antd'
import { useState } from 'react'
import { GuestDrawer } from '../GuestDrawer'
import { GUESTS } from '../../lib/graphql/queries'
import { Guests as GuestsData } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { Suites as SuitesData, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import { SUITES } from '../../lib/graphql/queries/Suites'

export const Home = () => {

  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)

  const { data: suitesData } = useQuery<SuitesData>(SUITES, {
    onError: () => {
      message.error("Chyba při načítání apartmá, kontaktujte správce")
    }
  })
  const [ getGuests, { loading: guestsLoading, error: guestsError, data: guestsData, refetch: guestsRefetch } ] = useLazyQuery<GuestsData>(GUESTS, {
    onError: () => {
      message.error("Chyba při načítání hostů, kontaktujte správce")
    }
  })

  const openDrawer = () => setDrawerVisible(true)
  const closeDrawer = () => setDrawerVisible(false)

  const getSuitesCalendars = () => {
    return suitesData?.suites?.map((suite: Suites_suites | null) => {
      return suite !== null ? (
        <ReserveCalendar
          data={ guestsData }
          error={ guestsError }
          getGuests={ getGuests }
          key={ suite.id }
          loading={ guestsLoading }
          openDrawer={ openDrawer }
          suite={ suite } />
      ) : null
    })
  }

  const getContent = () => {
    return suitesData !== undefined && suitesData.suites !== null ? (
      <Row gutter={ 12 }>
        { getSuitesCalendars() }
      </Row>
    ) : <Empty />
  }

  return (
    <Content className="app-content">
      <div className="home__listings">
        <Title level={ 3 } className="home__listings-title">
          Rezervace / Obsazenost
        </Title>
        { getContent() }
      </div>
      <GuestDrawer
        close={ closeDrawer }
        refetch={ guestsRefetch }
        visible={ drawerVisible } />
    </Content >
  );
}