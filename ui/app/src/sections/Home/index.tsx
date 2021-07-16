import { useQuery } from '@apollo/client'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import "react-modern-calendar-datepicker/lib/DatePicker.css"
import './styles.css'
import { ReserveCalendar } from '../ReserveCalendar'
import { Empty, message, Row } from 'antd'
import { useState } from 'react'
import { GuestDrawer } from '../GuestDrawer'
import { Suites as SuitesData, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import { SUITES } from '../../lib/graphql/queries/Suites'

export const Home = () => {

  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)

  const { data: suitesData } = useQuery<SuitesData>(SUITES, {
    onError: () => {
      message.error("Chyba při načítání apartmá, kontaktujte správce")
    }
  })

  const openDrawer = () => setDrawerVisible(true)
  const closeDrawer = () => setDrawerVisible(false)

  const getSuitesCalendars = () => {
    return suitesData?.suites?.map((suite: Suites_suites | null) => {
      return suite !== null ? (
        <ReserveCalendar
          key={ suite.id }
          openDrawer={ openDrawer }
          suite={ suite } />
      ) : null
    })
  }

  const getContent = () => {
    return suitesData !== undefined && suitesData.suites !== null && suitesData.suites.length > 0 ? (
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
        guest={ null }
        // refetch={ () => console.log("Refetching") }
        visible={ drawerVisible } />
    </Content >
  );
}