import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from "react-router-dom"
import './index.css'
import { getCookie } from "./lib/Cookie"
import moment from 'moment'
import 'moment/locale/cs'
import { ApolloClient, ApolloError, ApolloLink, ApolloProvider, FetchResult, from, fromPromise, HttpLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { App } from './sections/App'
import { ConfigProvider } from 'antd'
import csCZ from "antd/lib/locale/cs_CZ"
import { errorMessages, refreshTokenName, tokenName, usernameKey } from './lib/Constants'
import { RefreshToken, RefreshToken_refreshToken } from './lib/graphql/mutations/User/__generated__/RefreshToken'
import { TOKEN_REFRESH } from './lib/graphql/mutations/User'

moment.locale("cs")

let apolloClient: any

const httpLink = new HttpLink({
  uri: '/api'
});
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token")
  const csrftoken = getCookie("csrftoken")
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "Authorization": token === null ? "" : `JWT ${ token }`,
      "X-CSRFToken": csrftoken === null ? "" : csrftoken
    }
  }));
  return forward(operation);
})

const refreshToken = () => {
  return apolloClient
    .mutate({ mutation: TOKEN_REFRESH, variables: { refreshToken: localStorage.getItem(refreshTokenName) } })
    .then((value: FetchResult<RefreshToken>) => {
      return value.data?.refreshToken
    })
}

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let reason of graphQLErrors) {
        switch (reason.message) {
          case errorMessages.signatureExpired:
            return fromPromise(
              refreshToken()
                .catch((reason: ApolloError) => console.error(reason))
            )
              .flatMap(authToken => {
                const token = authToken as RefreshToken_refreshToken
                localStorage.setItem(tokenName, token.token)
                localStorage.setItem(refreshTokenName, token.refreshToken)
                localStorage.setItem(usernameKey, token.payload.username)
                // for debugging only
                localStorage.setItem("tokenExpiresIn", token.payload.exp.toString())
                localStorage.setItem("refreshTokenExpiresIn", token.refreshExpiresIn.toString())
                // --- / ---
                return forward(operation)
              })
        }
      }
    }
    if (networkError) {
      console.error(networkError);
    }
  }
)

apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          guests: {
            merge: false
          },
          reservations: {
            merge: false
          },
          suiteReservations: {
            merge: false
          },
          suites: {
            merge: false
          }
        }
      },
      Reservation: {
        fields: {
          roommates: { merge: false }
        }
      }
    }
  }),
  link: from([
    errorLink,
    authMiddleware,
    httpLink
  ]),
})

ReactDOM.render(
  <ApolloProvider client={ apolloClient }>
    <ConfigProvider locale={ csCZ }>
      <Router>
        <App />
      </Router>
    </ConfigProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
