import { useQuery } from '@apollo/client'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import "react-modern-calendar-datepicker/lib/DatePicker.css"
import './styles.css'
import { ReserveCalendar } from '../ReserveCalendar'
import { message, Row, Skeleton } from 'antd'
import { Suites as SuitesData, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import { SUITES } from '../../lib/graphql/queries/Suites'

export const Home = () => {

  const { loading: suitesLoading, data: suitesData } = useQuery<SuitesData>(SUITES, {
    onError: () => {
      message.error("Chyba při načítání apartmá, kontaktujte správce")
    }
  })

  return (
    <Content className="app-content">
      <div className="home__listings">
        <Title level={ 3 } className="home__listings-title">
          Rezervace / Obsazenost
        </Title>
        <Skeleton
          active
          loading={ suitesLoading }>
          <Row gutter={ 8 }>
            {
              suitesData?.suites?.map((suite: Suites_suites | null) => {
                return suite !== null ? (
                  <ReserveCalendar
                    key={ suite.id }
                    suite={ suite } />
                ) : null
              })
            }
          </Row>
        </Skeleton>
      </div>
    </Content >
  );
}