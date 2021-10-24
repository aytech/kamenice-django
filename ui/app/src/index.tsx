import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from "react-router-dom"
import './index.css'
import { getCookie } from "./lib/Cookie"
import moment from 'moment'
import 'moment/locale/cs'
import { ApolloClient, ApolloError, ApolloLink, ApolloProvider, FetchResult, from, fromPromise, HttpLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { App } from './sections/App'
import { ConfigProvider } from 'antd'
import csCZ from "antd/lib/locale/cs_CZ"
import { csrfTokenName, errorMessages, paths, refreshTokenName, tokenName } from './lib/Constants'
import { RefreshToken, RefreshToken_refreshToken } from './lib/graphql/mutations/Token/__generated__/RefreshToken'
import { TOKEN_REFRESH } from './lib/graphql/mutations/Token'
import "./i18n"
import { Suspense } from 'react'
import { Splash } from './sections/Splash'
import { cache } from './cache'

moment.locale("cs")

let apolloClient: any

const httpLink = new HttpLink({
  uri: '/api'
});
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(tokenName)
  const csrftoken = getCookie(csrfTokenName)
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
    .mutate({
      mutation: TOKEN_REFRESH,
      variables: {
        refreshToken: localStorage.getItem(refreshTokenName)
      }
    })
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
                return forward(operation)
              })
          case errorMessages.refreshTokenExpired:
          case errorMessages.refreshTokenInvalid:
          case errorMessages.unauthorized:
            localStorage.removeItem(tokenName)
            localStorage.removeItem(refreshTokenName)
            window.location.replace(paths.login)
        }
      }
    }
    if (networkError) {
      console.error(networkError);
    }
  }
)

apolloClient = new ApolloClient({
  cache,
  link: from([
    errorLink,
    authMiddleware,
    httpLink
  ]),
})

ReactDOM.render(
  <Suspense fallback={ <Splash /> }>
    <ApolloProvider client={ apolloClient }>
      <ConfigProvider locale={ csCZ }>
        <Router>
          <App />
        </Router>
      </ConfigProvider>
    </ApolloProvider>
  </Suspense>,
  document.getElementById('root')
);
