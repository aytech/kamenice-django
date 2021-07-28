import { ApolloError, useMutation, useQuery } from "@apollo/client"
import { Button, Form, Input, Layout, message, Spin } from "antd"
import { useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { FormHelper } from "../../lib/components/FormHelper"
import { setCookie } from "../../lib/Cookie"
import { JWT_TOKEN } from "../../lib/graphql/mutations/User"
import { RetrieveToken, RetrieveTokenVariables } from "../../lib/graphql/mutations/User/__generated__/RetrieveToken"
import { USER } from "../../lib/graphql/queries/User"
import { Whoami } from "../../lib/graphql/queries/User/__generated__/Whoami"
import "./styles.css"

interface Props {
  setIsAuthenticated: (state: boolean) => void
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export const Login = withRouter(({ history, setIsAuthenticated }: RouteComponentProps & Props) => {

  const [ getToken, { loading: loginLoading } ] = useMutation<RetrieveToken, RetrieveTokenVariables>(JWT_TOKEN, {
    onCompleted: (data: RetrieveToken) => {
      if (data.tokenAuth?.token !== undefined) {
        setCookie("authtoken", data.tokenAuth.token)
        setIsAuthenticated(true)
        history.push("/")
      }
    },
    onError: (reason: ApolloError) => {
      console.error(reason);
      message.error("Chyba serveru, kontaktujte správce")
    }
  })

  const { loading: userLoading } = useQuery<Whoami>(USER, {
    onCompleted: (data: Whoami) => {
      if (data?.whoami?.username !== undefined) {
        setIsAuthenticated(true)
        history.push("/")
      }
    },
    onError: (reason: ApolloError) => {
      console.error(reason)
    }
  })

  const [ form ] = Form.useForm()

  const [ spinnerTip, setSpinnerTip ] = useState<string>("Načítám...")

  const submitForm = (variables: any): void => {
    setSpinnerTip("Přihlašování...")
    getToken({ variables })
  }

  return (
    <Layout>
      <Layout.Content>
        <Spin spinning={ userLoading || loginLoading } tip={ spinnerTip }>
          <Form
            { ...layout }
            className="login"
            form={ form }
            name="login"
            onFinish={ submitForm }>
            <Form.Item
              label="Jméno"
              name="username"
              rules={ [ FormHelper.requiredRule ] }>
              <Input type="text" placeholder="uživatelské jméno" />
            </Form.Item>
            <Form.Item
              label="Heslo"
              name="password"
              rules={ [ FormHelper.requiredRule ] }>
              <Input type="password" placeholder="heslo" />
            </Form.Item>
            <Form.Item { ...tailLayout }>
              <Button type="default" htmlType="button" onClick={ () => form.resetFields() }>
                Reset
              </Button>
              <Button type="primary" htmlType="submit">
                Přihlásit
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Layout.Content>
    </Layout>
  )
})