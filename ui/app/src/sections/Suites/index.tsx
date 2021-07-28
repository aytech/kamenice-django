import { useEffect, useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { PlusCircleOutlined, WarningOutlined } from "@ant-design/icons"
import { Button, Layout, List, message, Popconfirm, Skeleton } from "antd"
import { SuiteDrawer } from "../SuiteDrawer"
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client"
import { SUITES } from "../../lib/graphql/queries/Suites"
import { Suites as SuitesData, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import Title from "antd/lib/typography/Title"
import "./styles.css"
import { DELETE_SUITE } from "../../lib/graphql/mutations/Suite"
import { DeleteSuite, DeleteSuiteVariables } from "../../lib/graphql/mutations/Suite/__generated__/DeleteSuite"

interface Props {
  isAuthenticated: boolean
}

export const Suites = withRouter(({ history, isAuthenticated }: RouteComponentProps & Props) => {

  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ activeSuite, setActiveSuite ] = useState<Suites_suites>()
  const [ suites, setSuites ] = useState<Suites_suites[]>([])

  const [ getData, { loading: queryLoading, data: queryData, refetch } ] = useLazyQuery<SuitesData>(SUITES, {
    onError: (reason: ApolloError) => {
      console.error(reason);
      message.error("Chyba serveru, kontaktujte správce")
    }
  })
  const [ deleteSuite, { loading: removeLoading, data: removeData } ] = useMutation<DeleteSuite, DeleteSuiteVariables>(DELETE_SUITE, {
    onError: (reason: ApolloError) => {
      console.error(reason)
    }
  })

  useEffect(() => {
    if (isAuthenticated === true) {
      getData()
    } else {
      history.push("/login")
    }
  }, [ getData, history, isAuthenticated ])

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
    if (refetch !== undefined) {
      refetch()
    }
  }, [ refetch, removeData ])

  const editSuite = (suite: Suites_suites): void => {
    setActiveSuite(suite)
    setDrawerVisible(true)
  }

  const removeSuite = (suite: Suites_suites): void => {
    deleteSuite({ variables: { suiteId: suite.id } })
  }

  return (
    <Layout>
      <Layout.Header>
        <Title level={ 3 } className="home__listings-title">
          Seznam apartmá
        </Title>
      </Layout.Header>
      <Layout.Content className="app-content">
        <List
          bordered={ true }
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
      </Layout.Content>
    </Layout>
  )
})