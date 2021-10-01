import { Button, Layout, Result } from "antd"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { pageTitle, selectedPage } from "../../cache"

export const NotFound = withRouter(({ history }: RouteComponentProps) => {

  const { t } = useTranslation()

  useEffect(() => {
    pageTitle("")
    selectedPage("user")
  }, [])

  return (
    <Layout>
      <Layout.Content>
        <Result
          status="404"
          title={ t("errors.oops") }
          subTitle={ t("errors.404") }
          extra={
            <Button
              onClick={ () => history.push("/") }
              type="primary">
              { t("go-home") }
            </Button>
          } />
      </Layout.Content>
    </Layout>
  )
})