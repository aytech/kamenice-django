import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import './index.css'
import { Affix, ConfigProvider, Layout } from 'antd'
import { AppHeader, Home, Overview } from './sections'
import { getCookie } from "./lib/Cookie"
import moment from 'moment'
import 'moment/locale/cs'
import csCZ from "antd/lib/locale/cs_CZ"
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { Suites } from './sections/Suites'
import { Guests } from './sections/Guests'

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
  <ConfigProvider locale={ csCZ }>
    <ApolloProvider client={ client }>
      <Router>
        <Layout id="app">
          <Affix offsetTop={ 0 } className="app__affix-header">
            <AppHeader />
          </Affix>
          <Switch>
            <Route exact path="/" component={ Home } />
            <Route exact path="/apartma" component={ Suites } />
            <Route exact path="/guests" component={ Guests } />
            <Route exact path="/prehled" component={ Overview } />
          </Switch>
        </Layout>
      </Router>
    </ApolloProvider>
  </ConfigProvider >,
  document.getElementById('root')
);
