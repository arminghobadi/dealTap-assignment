import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { MainPage } from './components'

export default class App extends React.Component {

  render = () => {
    return (
      <Router>
        <Route path="/" exact component={MainPage} />
        <Route path='/g/:url' component={Redirector} />
      </Router>
    )
  }

}

const Redirector = ({ match }) => {
  fetch(`http://localhost:8080/g/${match.params.url}`, 
  { 
    method: 'GET', 
    headers: {
      "Content-Type": "application/json"
    }
  }).then( a => {
    a.json().then(a => {
      console.log(a)
      // window.location.href = 'http://www.'+a.url
    })
    // window.location = a.json().url
  })

  return <div></div>
}