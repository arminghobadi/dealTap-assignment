import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";

import { MainPage } from './components'
import { AdminPage } from './components'

export default class App extends React.Component {

  render = () => {
    return (
      <Router>
        <Route path="/" exact component={MainPage} />
        <Route path='/g/:url' component={Redirector} />
        <Route path='/admin' component={AdminPage} />
      </Router>
    )
  }

}

const Redirector = ({ match }) => {
  let returnVal = <div/>
  fetch(`http://localhost:8080/g/${match.params.url}`, 
  { 
    method: 'GET', 
    headers: {
      "Content-Type": "application/json"
    }
  }).then( a => {
    a.json().then(a => {
      if (a.url)
        window.location.href = a.url
      else {
        returnVal = <div>page not found</div>
      }
    })
    // window.location = a.json().url
  })

  return returnVal
}