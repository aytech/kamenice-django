import { useEffect, useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { HomeOutlined, WarningOutlined } from "@ant-design/icons"
import { Avatar, Button, List, Popconfirm, Skeleton } from "antd"
import { SuiteDrawer } from "../SuiteDrawer"
import { useLazyQuery, useMutation } from "@apollo/client"
import { SUITES } from "../../lib/graphql/queries/Suites"
import { Suites as SuitesData, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import "./styles.css"
import { DELETE_SUITE } from "../../lib/graphql/mutations/Suite"
import { DeleteSuite, DeleteSuiteVariables } from "../../lib/graphql/mutations/Suite/__generated__/DeleteSuite"
import { AddSuite } from "./components/AddSuite"
import { User } from "../../lib/Types"

interface Props {
  reauthenticate: (callback: () => void) => void
  setPageTitle: (title: string) => void
  user: User | undefined
}

export const Suites = withRouter(({
  history,
  setPageTitle,
  user
}: RouteComponentProps & Props) => {

  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ activeSuite, setActiveSuite ] = useState<Suites_suites>()
  const [ suites, setSuites ] = useState<Suites_suites[]>([])

  const [ getData, { loading: queryLoading, data: queryData, refetch } ] = useLazyQuery<SuitesData>(SUITES)
  const [ deleteSuite, { loading: removeLoading } ] = useMutation<DeleteSuite, DeleteSuiteVariables>(DELETE_SUITE)

  useEffect(() => {
    setPageTitle("Apartmá")
    getData()
  }, [ getData, history, setPageTitle ])

  useEffect(() => {
    const suitesData: Suites_suites[] = []
    queryData?.suites?.forEach((suite: Suites_suites | null) => {
      if (suite !== null) {
        suitesData.push(suite)
      }
    })
    setSuites(suitesData)
  }, [ queryData ])

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
          <AddSuite
            onAdd={ () => {
              setActiveSuite(undefined)
              setDrawerVisible(true)
            } }
            user={ user } />
        }
        header={ <h4>Seznam apartmá</h4> }
        itemLayout="horizontal"
        loading={ queryLoading || removeLoading }
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