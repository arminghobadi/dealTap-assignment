import React from 'react'

import './main-page.css'


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
    const response = await fetchRes.json()
    // console.log(await fetchRes.json())
    this.setState(response)
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
    const { miniURL } = this.state;
  
    return (
      <div className='main-page'>
        <div className='info'>
          <div className='header'>
            Minify Your URLs!
          </div>
          <div className='body'> 
            all you need to do is to copy and paste a long URL in the input box below, and we'll generate a minified URL for you!
          </div>
        </div>
        <div className='input-section'>
          <input 
            className='input-box' 
            placeholder='Your URL here...' 
            onChange={(e) => {
              this.setState({ input: e.target.value })} 
            } />
        </div>
        <div className='button-section'>
          <button className='send-button' onClick={() => this.addUrl(this.state.input)}>
            send
          </button>
        </div>
        {
          miniURL ? 
            <div className='shortenned-url-section'>
              Here is your mini URL: <span className='url'>{miniURL}</span>
            </div>
          :
            <div/>
        }
      </div>
    );
  }
}

