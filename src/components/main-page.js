import React from 'react'


export class MainPage extends React.Component {
  state = {

  }

  async addUrl(url){
    console.log('url is ', JSON.stringify(url))
    const fetchRes = await fetch(`http://localhost:8080/mini`, 
    { 
      method: 'POST', 
      body: JSON.stringify({url}),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  async getUrl(url){
    const fetchRes = await fetch(`http://localhost:8080/g/${url}`, 
    { 
      method: 'GET', 
      headers: {
        "Content-Type": "application/json"
      }
    })
    console.log(await fetchRes.json())
  }

  render() {
    const { } = this.state;
  
    return (
      <div>
        <input onChange={ (e) => {this.setState({ input: e.target.value })} } />
        <div>{this.state.input}</div>
        <button onClick={() => this.addUrl(this.state.input)}>
          send
        </button>
        <button onClick={() => this.getUrl(this.state.input)}>
          get
        </button>
        

        
      </div>
    );
  }
}

