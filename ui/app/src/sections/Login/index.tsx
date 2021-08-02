import { ApolloError, useMutation } from "@apollo/client"
import { Button, Form, FormProps, Input, Layout, message, Spin } from "antd"
import { useCallback } from "react"
import { useEffect } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { FormHelper } from "../../lib/components/FormHelper"
import { JWT_TOKEN_LOGIN } from "../../lib/graphql/mutations/User"
import { RetrieveToken, RetrieveTokenVariables } from "../../lib/graphql/mutations/User/__generated__/RetrieveToken"
import { Whoami_whoami } from "../../lib/graphql/queries/User/__generated__/Whoami"
import "./styles.css"

interface Props {
  setPageTitle: (title: string) => void
  setUser: (user: Whoami_whoami) => void
  user: Whoami_whoami | undefined
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
  location,
  setPageTitle,
  setUser,
  user
}: RouteComponentProps & Props) => {

  const getReferrer = useCallback(() => {
    const urlParts = location.search.substring(1).split("=")
    if (urlParts.length >= 2 && urlParts[ 1 ] !== undefined) {
      return urlParts[ 1 ]
    }
    return "/"
  }, [ location ])

  useEffect(() => {
    setPageTitle("Přihlášení")
    if (user !== undefined) {
      history.push(getReferrer())
    }
  }, [ getReferrer, history, setPageTitle, user ])

  const [ getToken, { loading: loginLoading } ] = useMutation<RetrieveToken, RetrieveTokenVariables>(JWT_TOKEN_LOGIN, {
    onCompleted: (data: RetrieveToken) => {
      const user = data.tokenAuth?.user
      if (user !== undefined && user !== null) {
        setUser(user)
        history.push(getReferrer())
      } else {
        message.error("Nesprávné přihlašovací údaje")
      }
    },
    onError: (reason: ApolloError) => {
      console.error(reason);
      message.error("Chyba serveru, kontaktujte správce")
    }
  })

  const [ form ] = Form.useForm()

  const submitForm = (data: { password: string, username: string }): void => {
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
  )
})