import ReactDOM from 'react-dom'
import './index.css'
import { getCookie } from "./lib/Cookie"
import moment from 'moment'
import 'moment/locale/cs'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { App } from './sections/App'

moment.locale("cs")

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
  headers: {
    "X-CSRFToken": getCookie("csrftoken")
  },
  uri: "/api"
})

ReactDOM.render(
  <ApolloProvider client={ client }>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
