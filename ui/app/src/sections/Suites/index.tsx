import { useEffect, useState } from "react"
import { PlusCircleOutlined } from "@ant-design/icons"
import { Button, List, Skeleton } from "antd"
import { Content } from "antd/lib/layout/layout"
import { SuiteDrawer } from "../SuiteDrawer"
import { useQuery } from "@apollo/client"
import { SUITES } from "../../lib/graphql/queries/Suites"
import { Suites as SuitesData, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import Title from "antd/lib/typography/Title"
import "./styles.css"

export const Suites = () => {

  const { loading, error, data, refetch } = useQuery<SuitesData>(SUITES)
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ suites, setSuites ] = useState<Suites_suites[]>([])
  const [ activeSuite, setActiveSuite ] = useState<Suites_suites>()

  useEffect(() => {
    const suitesData: Suites_suites[] = []
    data?.suites?.forEach((suite: Suites_suites | null) => {
      if (suite !== null) {
        suitesData.push(suite)
      }
    })
    setSuites(suitesData)
  }, [ data ])

  const editSuite = (suite: Suites_suites): void => {
    setActiveSuite(suite)
    setDrawerVisible(true)
  }

  const removeSuite = (suite: Suites_suites): void => {
    console.log('Removing suite: ', suite)
  }

  return (
    <Content className="app-content">
      <Title level={ 3 } className="home__listings-title">
        Seznam apartmá
      </Title>
      <List
        className="suites-list"
        dataSource={ suites }
        itemLayout="horizontal"
        loading={ loading }
        renderItem={ suite => (
          <List.Item
            actions={ [
              <Button
                key="edit"
                onClick={ () => editSuite(suite) }
                type="link">
                upravit
              </Button>,
              <Button
                key="remove"
                onClick={ () => removeSuite(suite) }
                type="link">
                odstranit
              </Button>
            ] }>
            <Skeleton title={ false } loading={ loading } active>
              <List.Item.Meta
                title={ suite.title } />
            </Skeleton>
          </List.Item>
        ) } />
      <Button
        icon={ <PlusCircleOutlined /> }
        onClick={ () => {
          setActiveSuite(undefined)
          setDrawerVisible(true)
        } }
        type="primary">
        Přidat apartmá
      </Button>
      <SuiteDrawer
        close={ () => setDrawerVisible(false) }
        refetch={ refetch }
        suite={ activeSuite }
        visible={ drawerVisible } />
    </Content>
  )
}