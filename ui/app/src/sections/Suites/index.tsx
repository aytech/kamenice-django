import { useCallback, useEffect, useState } from "react"
import { Button, Col, Input, List, message, Pagination, Row, Skeleton, Tooltip } from "antd"
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
import { PagerHelper } from "../../lib/components/PagerHelper"

export const Suites = () => {

  const { t } = useTranslation()

  const [ activeSuite, setActiveSuite ] = useState<Suites_suites>()
  const [ currentPage, setCurrentPage ] = useState<number>(1)
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ filteredSuites, setFilteredSuites ] = useState<Suites_suites[]>([])
  const [ suites, setSuites ] = useState<Suites_suites[]>([])
  const [ totalSuites, setTotalSuites ] = useState<number>(0)

  const { loading, data, refetch } = useQuery<SuitesData>(SUITES, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const openSuite = (suite: Suites_suites | undefined) => {
    setActiveSuite(suite)
    setDrawerVisible(true)
  }

  const onPageChange = (page: number) => {
    PagerHelper.onPageChange(suites, page, (slice: Suites_suites[]) => {
      setFilteredSuites(slice)
      setCurrentPage(page)
    })
  }

  const onSearch = (value: string) => {
    if (value.length < 1) {
      setTotalSuites(suites.length)
      setFilteredSuites(suites)
    } else {
      const foundSuites = suites.filter(suite => {
        return suite.title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
      })
      setTotalSuites(foundSuites.length)
      setFilteredSuites(foundSuites)
    }
    setCurrentPage(1)
  }

  const updateSuiteList = useCallback((guestsList) => {
    PagerHelper.getPageSlice(guestsList, currentPage, (data: Suites_suites[], page: number) => {
      if (page > 0) {
        setCurrentPage(page)
      }
      setFilteredSuites(data)
    })
  }, [ currentPage ])

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
    setTotalSuites(suitesList.length)
    updateSuiteList(suitesList)
    discountSuiteOptions(discountTypes)
  }, [ data, updateSuiteList ])

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
            <Row>
              <Col lg={ 5 } md={ 5 } sm={ 7 } xs={ 0 }></Col>
              <Col
                className="pagination"
                lg={ 14 } md={ 14 } sm={ 10 } xs={ 12 }>
                <Pagination
                  current={ currentPage }
                  onChange={ onPageChange }
                  pageSize={ PagerHelper.defaultPageSize }
                  total={ totalSuites } />
              </Col>
              <Col lg={ 5 } md={ 5 } sm={ 7 } xs={ 12 }>
                <Text disabled>&reg;{ t("company-name") }</Text>
              </Col>
            </Row>
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
}