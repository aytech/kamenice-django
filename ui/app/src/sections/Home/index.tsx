import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import "react-modern-calendar-datepicker/lib/DatePicker.css"
import './styles.css'
import { ReserveCalendar } from '../ReserveCalendar'
import { Row } from 'antd'

export const Home = () => {
  const rooms = [
    {
      id: 1,
      name: "Apartman 2 + 2"
    },
    {
      id: 2,
      name: "Apartman 2 + 2"
    },
    {
      id: 3,
      name: "Apartman 2 + 2"
    },
    {
      id: 4,
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
    </Content >
  );
}