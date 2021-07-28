import ReactDOM from 'react-dom'
import './index.css'
import { getCookie } from "./lib/Cookie"
import moment from 'moment'
import 'moment/locale/cs'
import { ApolloClient, ApolloLink, ApolloProvider, concat, HttpLink, InMemoryCache } from '@apollo/client'
import { App } from './sections/App'

moment.locale("cs")

const httpLink = new HttpLink({ uri: '/api' });
const authMiddleware = new ApolloLink((operation, forward) => {
  const authtoken = getCookie("authtoken")
  const csrftoken = getCookie("csrftoken")
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: authtoken === null ? null : `JWT ${ authtoken }`,
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
  link: concat(authMiddleware, httpLink),
})

ReactDOM.render(
  <ApolloProvider client={ client }>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
