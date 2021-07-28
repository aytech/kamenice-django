import { ApolloError, useMutation, useQuery } from "@apollo/client"
import { message } from "antd"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { setCookie } from "../../lib/Cookie"
import { JWT_TOKEN } from "../../lib/graphql/mutations/User"
import { RetrieveToken, RetrieveTokenVariables } from "../../lib/graphql/mutations/User/__generated__/RetrieveToken"
import { USER } from "../../lib/graphql/queries/User"
import { Whoami } from "../../lib/graphql/queries/User/__generated__/Whoami"

interface Props {
  setIsAuthenticated: (state: boolean) => void
}

export const Login = withRouter(({ history, setIsAuthenticated }: RouteComponentProps & Props) => {

  const [ getToken ] = useMutation<RetrieveToken, RetrieveTokenVariables>(JWT_TOKEN, {
    onCompleted: (data: RetrieveToken) => {
      if (data.tokenAuth?.token !== undefined) {
        setCookie("authtoken", data.tokenAuth.token)
        setIsAuthenticated(true)
        history.push("/")
      }
    },
    onError: (reason: ApolloError) => {
      message.error(reason.message)
    }
  })

  const { loading } = useQuery<Whoami>(USER, {
    onCompleted: (data: Whoami) => {
      if (data?.whoami?.username !== undefined) {
        setIsAuthenticated(true)
        history.push("/")
      } else {
        getToken({ variables: { username: "***", password: "***" } })
      }
    },
    onError: (reason: ApolloError) => {
      console.error(reason)
    }
  })

  return (
    <h1>Login</h1>
  )
})