import { ApolloError, useQuery } from "@apollo/client"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { USER } from "../../lib/graphql/queries/User"
import { Whoami } from "../../lib/graphql/queries/User/__generated__/Whoami"

interface Props {
  setIsAuthenticated: (state: boolean) => void
}

export const Login = withRouter(({ history, setIsAuthenticated }: RouteComponentProps & Props) => {

  const { loading } = useQuery<Whoami>(USER, {
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

  return (
    <h1>Login</h1>
  )
})