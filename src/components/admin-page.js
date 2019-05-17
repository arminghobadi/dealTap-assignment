import React from 'react'




export class AdminPage extends React.Component {

  state = {
    data: []
  }

  async componentDidMount(){
    const fetchRes = await fetch(`http://localhost:8080/admin`, 
    { 
      method: 'GET', 
      headers: {
        "Content-Type": "application/json"
      }
    })
    try {
      let res = await fetchRes.json()
      res = res.map( i => JSON.parse(i))
      this.setState({ data: res })
    } catch(error){
      console.log(error)
    }
  }

  eachUser(user){
    return (
      <div>
        {
          Object.keys(user).map((k,i) => (
            <div key={i} className='each-user'>
              <div className={`users-${k}`}>
                <span className='tag'>{k}: </span>
                <span className='value'>{user[k]}</span>
              </div>
            </div>
          ))
        }
        {/* ip: {user.ip},
        <br/> device: {user.device}
        <br/> timestamp: {user.timestamp} */}
      </div>
    )
  }

  eachEntry(entry){
    return (
      <div>
        minified: {entry.minifiedURL}
        <br/> original: {entry.originalURL}
        <br/> views: {entry.views}
        <br/> users: {entry.users.map( user => this.eachUser(user))}
      </div>
    )
  }

  render() {
    const { data } = this.state;
  
    return (
      <div className='main-page'>
        { data.map( entry => this.eachEntry(entry)) }
      </div>
    );
  }
}

