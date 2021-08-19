import { useEffect, useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { HomeOutlined } from "@ant-design/icons"
import { Avatar, Button, List, message } from "antd"
import { SuiteDrawer } from "../SuiteDrawer"
import { Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import "./styles.css"
import { AddSuite } from "./components/AddSuite"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { DeleteSuite, DeleteSuiteVariables } from "../../lib/graphql/mutations/Suite/__generated__/DeleteSuite"
import { CREATE_SUITE, DELETE_SUITE, UPDATE_SUITE } from "../../lib/graphql/mutations/Suite"
import { CreateSuite, CreateSuiteVariables } from "../../lib/graphql/mutations/Suite/__generated__/CreateSuite"
import { errorMessages } from "../../lib/Constants"
import { UpdateSuite, UpdateSuiteVariables } from "../../lib/graphql/mutations/Suite/__generated__/UpdateSuite"

interface Props {
  reauthenticate: (callback: () => void, errorHandler?: (reason: ApolloError) => void) => void
  setPageTitle: (title: string) => void
  suitesData?: (Suites_suites | null)[] | null
}

export const Suites = withRouter(({
  reauthenticate,
  setPageTitle,
  suitesData
}: RouteComponentProps & Props) => {

  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)
  const [ activeSuite, setActiveSuite ] = useState<Suites_suites>()
  const [ suites, setSuites ] = useState<Suites_suites[]>([])

  const [ createSuite, { loading: createLoading } ] = useMutation<CreateSuite, CreateSuiteVariables>(CREATE_SUITE)
  const [ updateSuite, { loading: updateLoading } ] = useMutation<UpdateSuite, UpdateSuiteVariables>(UPDATE_SUITE)
  const [ deleteSuite, { loading: deleteLoading } ] = useMutation<DeleteSuite, DeleteSuiteVariables>(DELETE_SUITE)

  const addSuiteState = (suite?: Suites_suites | null): void => {
    if (suite !== undefined && suite !== null) {
      setSuites(suites.concat(suite))
    }
  }

  const updateSuiteState = (suite?: Suites_suites | null): void => {
    if (suite !== undefined && suite !== null) {
      const suitesList = suites.filter(cachedSuite => cachedSuite.id !== suite.id)
      setSuites(suitesList.concat(suite))
    }
  }

  const removeSuiteState = (suiteId?: string): void => {
    setSuites(suites.filter(suite => suite.id !== suiteId))
  }

  const errorHandler = (reason: ApolloError, callback: () => void) => {
    if (reason.message === errorMessages.signatureExpired) {
      reauthenticate(callback, (reason: ApolloError) => message.error(reason.message))
    } else {
      message.error(reason.message)
    }
  }

  const createSuiteAction = (variables: any) => {
    const handler =
      () => createSuite({ variables: { data: { ...variables } } })
        .then((value: FetchResult<CreateSuite>) => {
          setDrawerVisible(false)
          addSuiteState(value.data?.createSuite?.suite)
          message.success("Apartmá byla vytvořena")
        })
    handler().catch((reason: ApolloError) => errorHandler(reason, handler))
  }

  const updateSuiteAction = (suiteId: string, variables: any) => {
    const handler =
      () => updateSuite({ variables: { data: { id: suiteId, ...variables } } })
        .then((value: FetchResult<UpdateSuite>) => {
          setDrawerVisible(false)
          updateSuiteState(value.data?.updateSuite?.suite)
          message.success("Apartmá byla aktualizována")
        })
    handler().catch((reason: ApolloError) => errorHandler(reason, handler))
  }

  const deleteSuiteAction = (suiteId: string) => {
    const handler =
      () => deleteSuite({ variables: { suiteId } })
        .then((value: FetchResult<DeleteSuite>) => {
          setDrawerVisible(false)
          removeSuiteState(value.data?.deleteSuite?.suite?.id)
          message.success("Apartmá byla odstraněna")
        })
    handler().catch((reason: ApolloError) => errorHandler(reason, handler))
  }

  useEffect(() => {
    setPageTitle("Apartmá")
  }, [ setPageTitle ])

  useEffect(() => {
    const suitesList: Suites_suites[] = []
    suitesData?.forEach((suite: Suites_suites | null) => {
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
        close={ () => setDrawerVisible(false) }
        createSuite={ createSuiteAction }
        deleteSuite={ deleteSuiteAction }
        loading={ createLoading || updateLoading || deleteLoading }
        suite={ activeSuite }
        updateSuite={ updateSuiteAction }
        visible={ drawerVisible } />
    </>
  )
})