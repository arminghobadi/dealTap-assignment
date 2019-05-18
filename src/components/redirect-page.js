import React from 'react'

export class RedirectPage extends React.Component {

  state = {
    url: null,
    fetchResReady: false
  }

  async componentDidMount(){
    const fetchRes = await fetch(`http://localhost:8080/g/${this.props.match.params.url}`, 
      { 
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        }
      })
    const url = (await fetchRes.json()).url
    this.setState({ url, fetchResReady: true })
  }

  render() {
    const { url, fetchResReady } = this.state;
    if (fetchResReady && url){
      window.location.href = url
      return null
    }

    if (!fetchResReady)
      return <div> FETCHING RESULTS... </div>

    if (fetchResReady && !url) 
      return <div> ENTRY NOT FOUND </div>
  
    return null
  }
}

