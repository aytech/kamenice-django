import { ApolloError, useMutation } from "@apollo/client"
import { Button, Form, FormProps, Input, Layout, message, Spin } from "antd"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { pageTitle, appSettings } from "../../cache"
import { UrlHelper } from "../../lib/components/UrlHelper"
import { errorMessages, refreshTokenName, tokenName } from "../../lib/Constants"
import { TOKEN_AUTH } from "../../lib/graphql/mutations/Token"
import { TokenAuth, TokenAuthVariables } from "../../lib/graphql/mutations/Token/__generated__/TokenAuth"
import "./styles.css"

interface Props {
  settingsRefetch: () => void
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

export const Login = ({
  settingsRefetch
}: Props) => {

  const { t } = useTranslation()
  const navigate = useNavigate()

  const [ getToken, { loading: loginLoading } ] = useMutation<TokenAuth, TokenAuthVariables>(TOKEN_AUTH, {
    onCompleted: (token: TokenAuth) => {
      if (token.tokenAuth !== null) {
        appSettings(token.tokenAuth.settings)
        localStorage.setItem(tokenName, token.tokenAuth.token)
        localStorage.setItem(refreshTokenName, token.tokenAuth.refreshToken)
        settingsRefetch()
        navigate(UrlHelper.getReferrer())
      }
    },
    onError: (reason: ApolloError) => {
      switch (reason.message) {
        case errorMessages.invalidCredentials:
          message.error(t("login.invalid-login"))
          break
        default:
          message.error(t("generic-error"))
      }
    }
  })

  const [ form ] = Form.useForm()

  const login = (data: { password: string, username: string }): void => {
    getToken({
      variables: {
        password: data.password.trim(),
        username: data.username.trim()
      }
    })
  }

  useEffect(() => {
    pageTitle(t("pages.login"))
  }, [ t ])

  return (
    <Layout.Content>
      <Spin
        spinning={ loginLoading }
        tip={ `${ t("login.in-progress") }...` }>
        <Form
          { ...layout }
          className="login"
          form={ form }
          name="login"
          onFinish={ login }>
          <Form.Item
            label={ t("name") }
            name="username"
            rules={ [ {
              required: true,
              message: t("forms.field-required")
            } ] }>
            <Input type="text" placeholder={ t("forms.user-name") } />
          </Form.Item>
          <Form.Item
            label="Heslo"
            name="password"
            rules={ [ {
              required: true,
              message: t("forms.field-required")
            } ] }>
            <Input type="password" placeholder={ t("forms.password") } />
          </Form.Item>
          <Form.Item { ...tailLayout }>
            <Button type="default" htmlType="button" onClick={ () => form.resetFields() }>
              { t("forms.reset") }
            </Button>
            <Button type="primary" htmlType="submit">
              { t("forms.login") }
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Layout.Content>
  )
}