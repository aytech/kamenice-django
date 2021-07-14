import { useEffect, useState } from "react"
import { PlusCircleOutlined, WarningOutlined } from "@ant-design/icons"
import { Button, List, message, Popconfirm, Skeleton } from "antd"
import { Content } from "antd/lib/layout/layout"
import { SuiteDrawer } from "../SuiteDrawer"
import { ApolloError, useMutation, useQuery } from "@apollo/client"
import { SUITES } from "../../lib/graphql/queries/Suites"
import { Suites as SuitesData, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import Title from "antd/lib/typography/Title"
import "./styles.css"
import { DELETE_SUITE } from "../../lib/graphql/mutations/Suite"
import { DeleteSuite, DeleteSuiteVariables } from "../../lib/graphql/mutations/Suite/__generated__/DeleteSuite"

export const Suites = () => {

  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ activeSuite, setActiveSuite ] = useState<Suites_suites>()
  const [ suites, setSuites ] = useState<Suites_suites[]>([])

  const { loading: queryLoading, data: queryData, refetch } = useQuery<SuitesData>(SUITES, {
    onError: () => {
      message.error("Chyba serveru, kontaktujte správce")
    }
  })
  const [ deleteSuite, { loading: removeLoading, data: removeData } ] = useMutation<DeleteSuite, DeleteSuiteVariables>(DELETE_SUITE, {
    onError: (error: ApolloError) => {
      console.log('Error: ', error)
    }
  })

  useEffect(() => {
    const suitesData: Suites_suites[] = []
    queryData?.suites?.forEach((suite: Suites_suites | null) => {
      if (suite !== null) {
        suitesData.push(suite)
      }
    })
    setSuites(suitesData)
  }, [ queryData ])

  useEffect(() => {
    refetch()
  }, [ refetch, removeData ])

  const editSuite = (suite: Suites_suites): void => {
    setActiveSuite(suite)
    setDrawerVisible(true)
  }

  const removeSuite = (suite: Suites_suites): void => {
    deleteSuite({ variables: { suiteId: suite.id } })
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
        loading={ queryLoading }
        renderItem={ suite => (
          <List.Item
            actions={ [
              <Button
                key="edit"
                onClick={ () => editSuite(suite) }
                type="link">
                upravit
              </Button>,
              <Popconfirm
                cancelText="Ne"
                icon={ <WarningOutlined /> }
                okText="Ano"
                onConfirm={ () => removeSuite(suite) }
                title="opravdu odstranit?">
                <Button
                  key="remove"
                  loading={ removeLoading }
                  type="link">
                  odstranit
                </Button>
              </Popconfirm>
            ] }>
            <Skeleton title={ false } loading={ queryLoading } active>
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