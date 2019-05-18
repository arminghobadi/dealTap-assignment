import React from 'react'

import './main-page.css'

export class MainPage extends React.Component {

  state = {}

  async addUrl(url){
    const fetchRes = await fetch(`http://localhost:8080/mini`, 
      { 
        method: 'POST', 
        body: JSON.stringify({url}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    const response = await fetchRes.json()
    this.setState(response)
  }

  render() {
    const { miniURL, input } = this.state
  
    return (
      <div className='main-page'>
        <div className='info'>
          <div className='header'>
            Minify Your URLs!
          </div>
          <div className='body'> 
            All you need to do is to copy and paste a long URL in the input box below, and we'll generate a minified URL for you!
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
          <button className='send-button' onClick={() => this.addUrl(input)}>
            Minify!
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
    )
  }
}

