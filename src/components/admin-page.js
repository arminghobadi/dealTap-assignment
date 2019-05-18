import React from 'react'

import './admin-page.css'

export class AdminPage extends React.Component {

  state = {
    data: []
  }

  async componentDidMount(){
    try {
      const fetchRes = await fetch(`http://localhost:8080/admin`, 
        { 
          method: 'GET', 
          headers: {
            "Content-Type": "application/json"
          }
        })
      let res = await fetchRes.json()
      res = res.map( i => JSON.parse(i))
      this.setState({ data: res })
    } catch(error){
      console.log(error)
    }
  }

  eachUser(user, key){
    return (
      <div className='each-user' key={key}>
        {
          Object.keys(user).map((k,i) => (
            <div key={i} className='each-user-section'>
              <div className={`users-${k}`}>
                <span className='tag'>{k.toUpperCase()}: </span>
                <span className='value'>{user[k]}</span>
              </div>
            </div>
          ))
        }
      </div>
    )
  }

  eachEntry(entry){
    const { minifiedURL, originalURL, views, users } = entry
    const arr = minifiedURL.split('/')
    const key = arr[arr.length - 1]
    return (
      <div key={key} className='each-entry'>
        <div className='url-info'>
          <div className='minified-url'>
            <div className='text'>
              Minified URL:
            </div>
            <div className='data'>
              {minifiedURL}
            </div>
          </div>
          <div className='original-url'>
            <div className='text'>
              Original URL:
            </div>
            <div className='data'>
              {originalURL}
            </div>
          </div>
          <div className='views'>
          <div className='text'>
              Views:
            </div>
            <div className='data'>
              {views}
            </div>
          </div>
        </div>
        <div className='users'>
          {users.map( (user, i) => this.eachUser(user, i))}
        </div>
      </div>
    )
  }

  render() {
    const { data } = this.state
    return (
      <div className='admin-page'>
        { 
          data.length ? 
            data.map( entry => this.eachEntry(entry)) 
          :
            <div className='no-entry'>
              No Entry Found...
            </div>
        }
      </div>
    )
  }
}

