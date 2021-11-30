import { Button, Layout, Result } from "antd"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { pageTitle, selectedPage } from "../../cache"

export const NotFound = () => {

  const { t } = useTranslation()
  const navigate = useNavigate()

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
              onClick={ () => navigate("/") }
              type="primary">
              { t("go-home") }
            </Button>
          } />
      </Layout.Content>
    </Layout>
  )
}