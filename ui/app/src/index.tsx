import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import './index.css'
import { Affix, ConfigProvider, Layout } from 'antd'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { AppHeader, Home, Overview } from './sections'
import moment from 'moment'
import 'moment/locale/cs'
import csCZ from "antd/lib/locale/cs_CZ"

moment.locale("cs")

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={ client }>
    <ConfigProvider locale={ csCZ }>
      <Router>
        <Layout id="app">
          <Affix offsetTop={ 0 } className="app__affix-header">
            <AppHeader />
          </Affix>
          <Switch>
            <Route exact path="/" component={ Home } />
            <Route exact path="/prehled" component={ Overview } />
          </Switch>
        </Layout>
      </Router>
    </ConfigProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
