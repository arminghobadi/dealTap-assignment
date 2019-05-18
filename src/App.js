import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";

import { MainPage } from './components'
import { AdminPage } from './components'
import { RedirectPage } from './components'

export default class App extends React.Component {
  render = () => {
    return (
      <Router>
        <Route path="/" exact component={MainPage} />
        <Route path='/g/:url' component={RedirectPage} />
        <Route path='/admin' component={AdminPage} />
      </Router>
    )
  }
}