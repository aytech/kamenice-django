import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import "react-modern-calendar-datepicker/lib/DatePicker.css"
import './styles.css'
import { ReserveCalendar } from '../ReserveCalendar'
import { Row } from 'antd'
import { Link } from 'react-router-dom'
import { Room } from '../../lib/components/Room'


export const Home = () => {
  const rooms: Room[] = [
    {
      id: 1,
      name: "Apartman 2 + 2",
      reservedDays: [
        {
          year: 2021,
          month: 6,
          day: 21,
          type: "binding"
        },
        {
          year: 2021,
          month: 6,
          day: 22,
          type: "binding"
        },
        {
          year: 2021,
          month: 6,
          day: 23,
          type: "binding"
        },
        {
          year: 2021,
          month: 6,
          day: 24,
          type: "binding"
        },
        {
          year: 2021,
          month: 6,
          day: 25,
          type: "binding"
        }
      ]
    },
    {
      id: 2,
      name: "Apartman 2 + 4",
      reservedDays: [
        {
          year: 2021,
          month: 6,
          day: 23,
          type: "nonbinding"
        },
        {
          year: 2021,
          month: 6,
          day: 24,
          type: "nonbinding"
        },
        {
          year: 2021,
          month: 6,
          day: 25,
          type: "nonbinding"
        }
      ]
    }
  ]
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
                <ReserveCalendar room={ room } key={ index } />
              )
            })
          }
        </Row>
      </div>
      <Title level={ 3 }>
        <Link to="/prehled">Přehled</Link>
      </Title>
    </Content >
  );
}