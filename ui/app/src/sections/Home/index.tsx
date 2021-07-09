import { useLazyQuery } from '@apollo/client'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import "react-modern-calendar-datepicker/lib/DatePicker.css"
import './styles.css'
import { ReserveCalendar } from '../ReserveCalendar'
import { Row } from 'antd'
import { rooms } from '../../seed'
import { useState } from 'react'
import { GuestDrawer } from '../GuestDrawer'
import { GUESTS } from '../../lib/graphql/queries'
import { Guests as GuestsData } from "../../lib/graphql/queries/Guests/__generated__/Guests"

export const Home = () => {

  const [ getGuests, { loading, error, data, refetch } ] = useLazyQuery<GuestsData>(GUESTS, {})
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)

  const openDrawer = () => setDrawerVisible(true)
  const closeDrawer = () => setDrawerVisible(false)

  return (
    <Content className="app-content">
      <div className="home__listings">
        <Title level={ 3 } className="home__listings-title">
          Rezervace / Obsazenost
        </Title>
        <Row gutter={ 12 }>
          {
            rooms.map((room, index) => {
              return (
                <ReserveCalendar
                  data={ data }
                  error={ error }
                  getGuests={ getGuests }
                  key={ index }
                  loading={ loading }
                  openDrawer={ openDrawer }
                  room={ room } />
              )
            })
          }
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