import { ApolloError, useMutation } from "@apollo/client"
import { Button, Form, FormProps, Input, Layout, message, Spin } from "antd"
import { useEffect } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { FormHelper } from "../../lib/components/FormHelper"
import { UrlHelper } from "../../lib/components/UrlHelper"
import { errorMessages, refreshTokenName, tokenName } from "../../lib/Constants"
import { TOKEN_AUTH } from "../../lib/graphql/mutations/User"
import { TokenAuth, TokenAuthVariables } from "../../lib/graphql/mutations/User/__generated__/TokenAuth"
import { User } from "../../lib/Types"
import "./styles.css"

interface Props {
  refetch: () => void
  setPageTitle: (title: string) => void
  setUser: (user: User) => void
}

const layout: FormProps = {
  labelCol: {
    lg: 8,
    md: 8,
    sm: 8
  },
  wrapperCol: {
    lg: 16,
    md: 16,
    sm: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    lg: {
      offset: 8,
      span: 16,
    },
    xs: {
      offset: 0,
      span: 24
    }
  },
};

export const Login = withRouter(({
  history,
  refetch,
  setPageTitle,
  setUser
}: RouteComponentProps & Props) => {

  const [ getToken, { loading: loginLoading } ] = useMutation<TokenAuth, TokenAuthVariables>(TOKEN_AUTH, {
    onCompleted: (token: TokenAuth) => {
      if (token.tokenAuth !== null) {
        localStorage.setItem(tokenName, token.tokenAuth.token)
        localStorage.setItem(refreshTokenName, token.tokenAuth.refreshToken)
        setUser({ username: token.tokenAuth.payload.username })
        refetch()
        // for debugging only
        localStorage.setItem("tokenExpiresIn", token.tokenAuth.payload.exp)
        localStorage.setItem("refreshTokenExpiresIn", token.tokenAuth.refreshExpiresIn.toString())
        // --- / ---
        history.push(UrlHelper.getReferrer())
      }
    },
    onError: (reason: ApolloError) => {
      switch (reason.message) {
        case errorMessages.invalidCredentials:
          message.error("Prosím zadejte platné přihlašovací údaje")
          break
        default:
          message.error("Chyba serveru, kontaktujte správce")
      }
    }
  })

  useEffect(() => {
    setPageTitle("Přihlášení")
  }, [ history, setPageTitle ])

  const [ form ] = Form.useForm()

  const login = (data: { password: string, username: string }): void => {
    getToken({
      variables: {
        password: data.password.trim(),
        username: data.username.trim()
      }
    })
  }

  return (
    <Layout.Content>
      <Spin spinning={ loginLoading } tip="Přihlašování...">
        <Form
          { ...layout }
          className="login"
          form={ form }
          name="login"
          onFinish={ login }>
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
  )
})