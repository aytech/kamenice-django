import { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { Button, Col, List, message, Row, Skeleton, Tooltip } from "antd"
import Text from "antd/lib/typography/Text"
import { SuiteDrawer } from "./components/SuiteDrawer"
import { Suites as SuitesData, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import "./styles.css"
import { ApolloError, useQuery } from "@apollo/client"
import { SUITES } from "../../lib/graphql/queries/Suites"
import { useTranslation } from "react-i18next"
import { SuiteItem } from "./components/SuiteItem"
import { AppstoreAddOutlined } from "@ant-design/icons"
import { discountSuiteOptions, pageTitle, selectedPage } from "../../cache"
import { OptionsType } from "../../lib/Types"

export const Suites = withRouter(() => {

  const { t } = useTranslation()

  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ activeSuite, setActiveSuite ] = useState<Suites_suites>()
  const [ suites, setSuites ] = useState<Suites_suites[]>([])

  const { loading, data, refetch } = useQuery<SuitesData>(SUITES, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const openSuite = (suite: Suites_suites | undefined) => {
    setActiveSuite(suite)
    setDrawerVisible(true)
  }

  useEffect(() => {
    const discountTypes: OptionsType[] = []
    const suitesList: Suites_suites[] = []
    data?.suites?.forEach(suite => {
      if (suite !== null) {
        suitesList.push(suite)
      }
    })
    data?.discountSuiteTypes?.forEach(type => {
      if (type !== null) {
        discountTypes.push({
          label: type.value,
          value: type.name
        })
      }
    })
    setSuites(suitesList)
    discountSuiteOptions(discountTypes)
  }, [ data, t ])

  useEffect(() => {
    pageTitle(t("living-units"))
    selectedPage("suites")
  }, [ t ])

  return (
    <>
      <Skeleton
        active
        loading={ loading }
        paragraph={ { rows: 5 } }>
        <List
          bordered={ true }
          className="suites"
          dataSource={ suites }
          footer={
            <Text disabled>&reg;{ t("company-name") }</Text>
          }
          header={
            <Row>
              <Col lg={ 23 } md={ 22 } sm={ 20 } xs={ 20 }>
                <h2>{ t("living-units-list") }</h2>
              </Col>
              <Col lg={ 1 } md={ 2 } sm={ 4 } xs={ 4 }>
                <Tooltip title={ t("living-unit-add") }>
                  <Button
                    onClick={ () => openSuite(undefined) }>
                    <AppstoreAddOutlined />
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          }
          itemLayout="horizontal"
          renderItem={ suite => (
            <SuiteItem
              openSuite={ openSuite }
              refetch={ refetch }
              suite={ suite } />
          ) } />
      </Skeleton>
      <SuiteDrawer
        close={ () => setDrawerVisible(false) }
        refetch={ refetch }
        suite={ activeSuite }
        visible={ drawerVisible } />
    </>
  )
})