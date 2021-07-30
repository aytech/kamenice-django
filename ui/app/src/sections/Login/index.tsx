import { ApolloError, useMutation, useQuery } from "@apollo/client"
import { Button, Form, FormProps, Input, Layout, message, Spin } from "antd"
import Title from "antd/lib/typography/Title"
import { useEffect } from "react"
import { useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { FormHelper } from "../../lib/components/FormHelper"
import { JWT_TOKEN_LOGIN } from "../../lib/graphql/mutations/User"
import { RetrieveToken, RetrieveTokenVariables } from "../../lib/graphql/mutations/User/__generated__/RetrieveToken"
import { USER } from "../../lib/graphql/queries/User"
import { Whoami } from "../../lib/graphql/queries/User/__generated__/Whoami"
import "./styles.css"

interface Props {
  setIsAuthenticated: (state: boolean) => void
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

export const Login = withRouter(({ history, location, setIsAuthenticated }: RouteComponentProps & Props) => {

  const [ spinnerTip, setSpinnerTip ] = useState<string>("Načítám...")
  const [ referrer, setReferrer ] = useState<string>("/")

  useEffect(() => {
    const urlParts = location.search.substring(1).split("=")
    if (urlParts.length >= 2 && urlParts[ 1 ] !== undefined) {
      setReferrer(urlParts[ 1 ])
    }
  }, [ location ])

  const [ getToken, { loading: loginLoading } ] = useMutation<RetrieveToken, RetrieveTokenVariables>(JWT_TOKEN_LOGIN, {
    onCompleted: (data: RetrieveToken) => {
      if (data.tokenAuth?.token !== undefined) {
        setIsAuthenticated(true)
        history.push(referrer)
      }
    },
    onError: (reason: ApolloError) => {
      console.error(reason);
      message.error("Nesprávné přihlašovací údaje")
    }
  })

  const { loading: userLoading } = useQuery<Whoami>(USER, {
    onCompleted: (data: Whoami) => {
      if (data?.whoami?.username !== undefined) {
        setIsAuthenticated(true)
        history.push(referrer)
      }
    },
    onError: (reason: ApolloError) => {
      console.error(reason)
    }
  })

  const [ form ] = Form.useForm()

  const submitForm = (data: { password: string, username: string }): void => {
    setSpinnerTip("Přihlašování...")
    getToken({
      variables: {
        password: data.password.trim(),
        username: data.username.trim()
      }
    })
  }

  return (
    <Layout>
      <Layout.Header>
        <Title level={ 3 } className="home__listings-title">
          Přihlášení
        </Title>
      </Layout.Header>
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