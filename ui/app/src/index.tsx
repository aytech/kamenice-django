import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from "react-router-dom"
import './index.css'
import { getCookie } from "./lib/Cookie"
import moment from 'moment'
import 'moment/locale/cs'
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { App } from './sections/App'
import { ConfigProvider } from 'antd'
import csCZ from "antd/lib/locale/cs_CZ"

moment.locale("cs")

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

const client = new ApolloClient({
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
  link: authMiddleware.concat(httpLink),
})

ReactDOM.render(
  <ApolloProvider client={ client }>
    <ConfigProvider locale={ csCZ }>
      <Router>
        <App />
      </Router>
    </ConfigProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
