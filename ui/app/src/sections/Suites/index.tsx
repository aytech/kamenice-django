import { useEffect, useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { HomeOutlined } from "@ant-design/icons"
import { Avatar, Button, List, message, Skeleton } from "antd"
import { SuiteDrawer } from "../SuiteDrawer"
import { Suites as SuitesData, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import "./styles.css"
import { AddSuite } from "./components/AddSuite"
import { ApolloError, useQuery } from "@apollo/client"
import { SUITES } from "../../lib/graphql/queries/Suites"
import { useTranslation } from "react-i18next"

interface Props {
  setPageTitle: (title: string) => void
}

export const Suites = withRouter(({
  setPageTitle
}: RouteComponentProps & Props) => {

  const { t } = useTranslation()

  setPageTitle(t("suites-title"))

  const [ dataLoading, setDataLoading ] = useState<boolean>(true)
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ activeSuite, setActiveSuite ] = useState<Suites_suites>()
  const [ suites, setSuites ] = useState<Suites_suites[]>([])
  const [ hasAccess, setHasAccess ] = useState<boolean>(false)

  const { data: suitesData } = useQuery<SuitesData>(SUITES, {
    onCompleted: () => {
      setHasAccess(true)
      setDataLoading(false)
    },
    onError: (reason: ApolloError) => {
      message.error(reason.message)
      setHasAccess(false)
      setDataLoading(false)
    }
  })

  const addOrUpdateSuite = (suite: Suites_suites) => {
    setSuites(suites.filter(cachedSuite => cachedSuite.id !== suite.id).concat(suite))
  }

  const clearSuite = (suiteId: string) => {
    setSuites(suites.filter(suite => suite.id !== suiteId))
  }

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
      <Skeleton
        active
        loading={ dataLoading }
        paragraph={ { rows: 5 } }>
        <List
          bordered={ true }
          className="suites-list"
          dataSource={ suites }
          footer={
            <AddSuite
              hasAccess={ hasAccess }
              onAdd={ () => {
                setActiveSuite(undefined)
                setDrawerVisible(true)
              } } />
          }
          header={ <h4>Seznam apartmá</h4> }
          itemLayout="horizontal"
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
      </Skeleton>
      <SuiteDrawer
        addOrUpdateSuite={ addOrUpdateSuite }
        clearSuite={ clearSuite }
        close={ () => setDrawerVisible(false) }
        suite={ activeSuite }
        visible={ drawerVisible } />
    </>
  )
})