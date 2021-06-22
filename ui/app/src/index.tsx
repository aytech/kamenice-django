import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import './index.css'
import { Affix, Layout } from 'antd'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { AppHeader, Home } from './sections'

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={ client }>
    <Router>
      <Layout id="app">
        <Affix offsetTop={ 0 } className="app__affix-header">
          <AppHeader />
        </Affix>
        <Switch>
          <Route exact path="/" component={ Home } />
        </Switch>
      </Layout>
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
);
