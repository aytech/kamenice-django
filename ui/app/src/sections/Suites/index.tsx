import { useState } from "react"
import { PlusCircleOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { Content } from "antd/lib/layout/layout"
import { SuiteDrawer } from "../SuiteDrawer"

export const Suites = () => {

  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false)

  return (
    <Content className="app-content">
      <Button
        icon={ <PlusCircleOutlined /> }
        onClick={ () => setDrawerVisible(true) }
        type="primary">
        Přidat apartmá
      </Button>
      <SuiteDrawer
        close={ () => setDrawerVisible(false) }
        visible={ drawerVisible } />
    </Content>
  )
}