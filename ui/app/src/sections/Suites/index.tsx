import { useEffect, useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { HomeOutlined, PlusCircleOutlined, WarningOutlined } from "@ant-design/icons"
import { Avatar, Button, List, message, Popconfirm, Skeleton } from "antd"
import { SuiteDrawer } from "../SuiteDrawer"
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client"
import { SUITES } from "../../lib/graphql/queries/Suites"
import { Suites as SuitesData, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import "./styles.css"
import { DELETE_SUITE } from "../../lib/graphql/mutations/Suite"
import { DeleteSuite, DeleteSuiteVariables } from "../../lib/graphql/mutations/Suite/__generated__/DeleteSuite"

interface Props {
  isAuthenticated: boolean
  setPageTitle: (title: string) => void
}

export const Suites = withRouter(({
  history,
  isAuthenticated,
  setPageTitle
}: RouteComponentProps & Props) => {

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
    setPageTitle("Apartmá")
    if (isAuthenticated === true) {
      getData()
    } else {
      history.push("/login?next=/apartma")
    }
  }, [ getData, history, isAuthenticated, setPageTitle ])

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
    <>
      <List
        bordered={ true }
        className="suites-list"
        dataSource={ suites }
        footer={
          <Button
            icon={ <PlusCircleOutlined /> }
            onClick={ () => {
              setActiveSuite(undefined)
              setDrawerVisible(true)
            } }
            type="primary">
            Přidat apartmá
          </Button>
        }
        header={ <h4>Seznam apartmá</h4> }
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
                avatar={
                  <Avatar gap={ 4 } size="large">
                    <HomeOutlined />
                  </Avatar>
                }
                description={ `číslo pokoje - ${ suite.number }` }
                title={ suite.title } />
            </Skeleton>
          </List.Item>
        ) } />
      <SuiteDrawer
        close={ () => setDrawerVisible(false) }
        refetch={ refetch }
        suite={ activeSuite }
        visible={ drawerVisible } />
    </>
  )
})