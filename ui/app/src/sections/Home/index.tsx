import { ApolloError, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import "react-modern-calendar-datepicker/lib/DatePicker.css"
import './styles.css'
import { ReserveCalendar } from '../ReserveCalendar'
import { Button, message, Row } from 'antd'
import { useState } from 'react'
import { GuestDrawer } from '../GuestDrawer'
import { GUESTS } from '../../lib/graphql/queries'
import { Guests as GuestsData } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { Suites as SuitesData, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import { SUITES } from '../../lib/graphql/queries/Suites'
import { PlusCircleOutlined } from '@ant-design/icons'
import { DrawerType } from '../../lib/Types'
import { SuiteDrawer } from '../SuiteDrawer'
import { useEffect } from 'react'
import { DeleteSuite, DeleteSuiteVariables } from '../../lib/graphql/mutations/Suite/__generated__/DeleteSuite'
import { DELETE_SUITE } from '../../lib/graphql/mutations/Suite'

export const Home = () => {

  const [ drawerType, setDrawerType ] = useState<DrawerType>()
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ activeSuite, setActiveSuite ] = useState<Suites_suites>()

  const { loading: suitesLoading, data: suitesData, refetch: suitesRefetch } = useQuery<SuitesData>(SUITES, {
    onError: () => {
      message.error("Chyba serveru, kontaktujte správce")
    }
  })
  const [ getGuests, { loading: guestsLoading, error: guestsError, data: guestsData, refetch: guestsRefetch } ] = useLazyQuery<GuestsData>(GUESTS)
  const [ deleteSuite, { loading: removeSuiteLoading, data: removeSuiteData } ] = useMutation<DeleteSuite, DeleteSuiteVariables>(DELETE_SUITE, {
    onError: (error: ApolloError) => {
      console.error(error.message);
      message.error("Chyba serveru, kontaktujte správce")
    }
  })

  const openDrawer = () => setDrawerVisible(true)
  const closeDrawer = () => setDrawerVisible(false)

  useEffect(() => {
    suitesRefetch()
    console.log('Hook on suites data')
  }, [ removeSuiteData, suitesData, suitesRefetch ])

  const getSuitesCalendars = () => {
    return suitesData?.suites?.map((suite: Suites_suites | null) => {
      return suite !== null ? (
        <ReserveCalendar
          data={ guestsData }
          error={ guestsError }
          getGuests={ getGuests }
          key={ suite.id }
          loading={ guestsLoading }
          openGuestDrawer={ () => {
            setDrawerType("guest")
            openDrawer()
          } }
          openSuiteDrawer={ () => {
            setActiveSuite(suite)
            setDrawerType("suite")
            openDrawer()
          } }
          suite={ suite } />
      ) : null
    })
  }

  const AppDrawer = () => {
    switch (drawerType) {
      case "guest":
        return (
          <GuestDrawer
            close={ closeDrawer }
            refetch={ guestsRefetch }
            visible={ drawerVisible }
          />
        )
      case "suite":
        return (
          <SuiteDrawer
            close={ closeDrawer }
            refetch={ suitesRefetch }
            removeSuite={ (suite: Suites_suites | undefined) => {
              closeDrawer()
              if (suite !== undefined) {
                deleteSuite({ variables: { suiteId: suite.id } })
              }
            } }
            suite={ activeSuite }
            visible={ drawerVisible } />
        )
      default: return null
    }
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
      <Button
        icon={ <PlusCircleOutlined /> }
        loading={ suitesLoading }
        onClick={ () => {
          setActiveSuite(undefined)
          setDrawerType("suite")
          openDrawer()
        } }
        type="primary">
        Přidat apartmá
      </Button>
      <AppDrawer />
    </Content >
  );
}