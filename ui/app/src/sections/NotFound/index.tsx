import { Button, Layout, Result } from "antd"
import { RouteComponentProps, withRouter } from "react-router-dom"

export const NotFound = withRouter(({ history }: RouteComponentProps) => {
  return (
    <Layout>
      <Layout.Content>
        <Result
          status="404"
          title="Jejda!"
          subTitle="hledáme vaší stránku... ale nemůžeme ji najít..."
          extra={
            <Button
              onClick={ () => history.push("/") }
              type="primary">
              Přejít na úvod
            </Button>
          } />
      </Layout.Content>
    </Layout>
  )
})