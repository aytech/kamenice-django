import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import "react-modern-calendar-datepicker/lib/DatePicker.css"
import './styles.css'
import { ReserveCalendar } from '../ReserveCalendar'
import { Row } from 'antd'
import { Link } from 'react-router-dom'
import { rooms } from '../../seed'
import { useState } from 'react'
import { UserDrawer } from '../UserDrawer'
import { DrawerType } from '../../lib/Types'

export const Home = () => {

  const [ drawerType, setDrawerType ] = useState<DrawerType>()
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const AppDrawer = () => {
    if (drawerType === "user") {
      return (
        <UserDrawer
          setVisible={ setDrawerVisible }
          visible={ drawerVisible }
        />
      )
    }
    return null
  }
  const openDrawer = () => setDrawerVisible(true)

  return (
    <Content className="home">
      <div className="home__listings">
        <Title level={ 3 } className="home__listings-title">
          Rezervace / Obsazenost
        </Title>
        <Row gutter={ 12 }>
          {
            rooms.map((room, index) => {
              return (
                <ReserveCalendar
                  key={ index }
                  openDrawer={ openDrawer }
                  room={ room }
                  setDrawerType={ setDrawerType } />
              )
            })
          }
        </Row>
      </div>
      <AppDrawer />
      <Title level={ 3 }>
        <Link to="/prehled">Přehled</Link>
      </Title>
    </Content >
  );
}