import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import "react-modern-calendar-datepicker/lib/DatePicker.css"
import './styles.css'
import { ReserveCalendar } from '../ReserveCalendar'
import { Row } from 'antd'
import { Link } from 'react-router-dom'

export const Home = () => {
  const rooms = [
    {
      id: 1,
      name: "Apartman 2 + 2"
    },
    {
      id: 2,
      name: "Apartman 2 + 4"
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