import { useLazyQuery, useQuery } from '@apollo/client'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import "react-modern-calendar-datepicker/lib/DatePicker.css"
import './styles.css'
import { ReserveCalendar } from '../ReserveCalendar'
import { Row } from 'antd'
import { useState } from 'react'
import { GuestDrawer } from '../GuestDrawer'
import { GUESTS } from '../../lib/graphql/queries'
import { Guests as GuestsData } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { SUITES } from '../../lib/graphql/queries/Suites'
import { Suites, Suites_suites } from '../../lib/graphql/queries/Suites/__generated__/Suites'

export const Home = () => {

  const [ getGuests, { loading: guestsLoading, error: guestsError, data: guestsData, refetch } ] = useLazyQuery<GuestsData>(GUESTS, {})
  const { loading: suitesLoading, error: suitesError, data: suitesData } = useQuery<Suites>(SUITES)
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)

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

  return (
    <Content className="app-content">
      <div className="home__listings">
        <Title level={ 3 } className="home__listings-title">
          Rezervace / Obsazenost
        </Title>
        <Row gutter={ 12 }>
          { getSuitesCalendars() }
        </Row>
      </div>
      <GuestDrawer
        refetch={ refetch }
        close={ closeDrawer }
        visible={ drawerVisible }
      />
    </Content >
  );
}