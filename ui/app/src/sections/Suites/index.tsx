import { useEffect, useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { HomeOutlined } from "@ant-design/icons"
import { Avatar, Button, List } from "antd"
import { SuiteDrawer } from "../SuiteDrawer"
import { Suites as SuitesData, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import "./styles.css"
import { AddSuite } from "./components/AddSuite"
import { useQuery } from "@apollo/client"
import { User } from "../../lib/Types"
import { SUITES } from "../../lib/graphql/queries/Suites"

interface Props {
  setPageTitle: (title: string) => void
  setUser: (user: User) => void
}

export const Suites = withRouter(({
  setPageTitle
}: RouteComponentProps & Props) => {

  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ activeSuite, setActiveSuite ] = useState<Suites_suites>()
  const [ suites, setSuites ] = useState<Suites_suites[]>([])

  const { loading: suitesLoading, data: suitesData } = useQuery<SuitesData>(SUITES)

  const addOrUpdateSuite = (suite: Suites_suites) => {
    setSuites(suites.filter(cachedSuite => cachedSuite.id !== suite.id).concat(suite))
  }

  const clearSuite = (suiteId: string) => {
    setSuites(suites.filter(suite => suite.id !== suiteId))
  }

  useEffect(() => {
    setPageTitle("Apartmá")
  }, [ setPageTitle ])

  useEffect(() => {
    const suitesList: Suites_suites[] = []
    suitesData?.suites?.forEach((suite: Suites_suites | null) => {
      if (suite !== null) {
        suitesList.push(suite)
      }
    })
    setSuites(suitesList)
  }, [ suitesData ])

  return (
    <>
      <List
        bordered={ true }
        className="suites-list"
        dataSource={ suites }
        footer={
          <AddSuite
            onAdd={ () => {
              setActiveSuite(undefined)
              setDrawerVisible(true)
            } } />
        }
        header={ <h4>Seznam apartmá</h4> }
        itemLayout="horizontal"
        loading={ suitesLoading }
        renderItem={ suite => (
          <List.Item
            actions={ [
              <Button
                key="edit"
                onClick={ () => {
                  setActiveSuite(suite)
                  setDrawerVisible(true)
                } }
                type="link">
                upravit
              </Button>
            ] }>
            <List.Item.Meta
              avatar={
                <Avatar gap={ 4 } size="large">
                  <HomeOutlined />
                </Avatar>
              }
              description={ `číslo pokoje - ${ suite.number }` }
              title={ suite.title } />
          </List.Item>
        ) } />
      <SuiteDrawer
        addOrUpdateSuite={ addOrUpdateSuite }
        clearSuite={ clearSuite }
        close={ () => setDrawerVisible(false) }
        suite={ activeSuite }
        visible={ drawerVisible } />
    </>
  )
})