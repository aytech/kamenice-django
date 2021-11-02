import { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { Button, Col, Input, List, message, Row, Skeleton, Tooltip } from "antd"
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

  const [ activeSuite, setActiveSuite ] = useState<Suites_suites>()
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ filteredSuites, setFilteredSuites ] = useState<Suites_suites[]>([])
  const [ suites, setSuites ] = useState<Suites_suites[]>([])

  const { loading, data, refetch } = useQuery<SuitesData>(SUITES, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const openSuite = (suite: Suites_suites | undefined) => {
    setActiveSuite(suite)
    setDrawerVisible(true)
  }

  const onSearch = (value: string) => {
    if (value.length < 1) {
      setFilteredSuites(suites)
    } else {
      const foundSuites = suites.filter(suite => {
        return suite.title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
      })
      setFilteredSuites(foundSuites)
    }
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
    setFilteredSuites(suitesList)
    discountSuiteOptions(discountTypes)
  }, [ data, t ])

  useEffect(() => {
    pageTitle(t("rooms.page-title"))
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
          dataSource={ filteredSuites }
          footer={
            <Text disabled>&reg;{ t("company-name") }</Text>
          }
          header={
            <Row>
              <Col lg={ 10 } md={ 12 } sm={ 14 } xs={ 16 }>
                <Input.Search
                  allowClear
                  enterButton
                  id="search-room"
                  onSearch={ onSearch }
                  placeholder={ t("rooms.search") } />
              </Col>
              <Col lg={ 12 } md={ 9 } sm={ 5 } xs={ 4 } />
              <Col lg={ 2 } md={ 3 } sm={ 5 } xs={ 4 }>
                <Tooltip title={ t("living-unit-add") }>
                  <Button
                    block
                    className="add-suite"
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