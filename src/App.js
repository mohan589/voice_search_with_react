import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.css'

// Import the Artyom library
import Artyom from 'artyom.js'

// Import the previously created class to handle the commands from another file
import ArtyomCommandsManager from './ArtyomCommands.js'
import SearchTable from './SearchTable'

// Create a "globally" accesible instance of Artyom
const voiceController = new Artyom()

class App extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Add `this` context to the handler functions
    this.startAssistant = this.startAssistant.bind(this)
    this.stopAssistant = this.stopAssistant.bind(this)
    this.speakText = this.speakText.bind(this)
    this.handleTextareaChange = this.handleTextareaChange.bind(this)

    // Prepare simple state
    this.state = {
      artyomActive: false,
      textareaValue: '',
      artyomIsReading: false,
      results: [],
      displayTable: false,
      voiceController: voiceController
    }

    // Load some commands to Artyom using the commands manager
    let CommandsManager = new ArtyomCommandsManager(voiceController)
    CommandsManager.loadCommands()
    this.startAssistant()
  }

  startAssistant () {
    let _this = this

    console.log('Artyom succesfully started !')

    voiceController.initialize({
      lang: 'en-GB',
      debug: true,
      continuous: true,
      soundex: true,
      listen: true
    }).then(() => {
      // Display loaded commands in the console
      console.log(voiceController.getAvailableCommands())

      // voiceController.say('Hello there, how are you?')

      _this.setState({
        artyomActive: true
      })
    }).catch((err) => {
      console.error("Oopsy daisy, this shouldn't happen !", err)
    })

    voiceController.on(['i would like to search for *'], true).then((i, wildcard) => {
      let _this = this
      _this.setState({
        results: [],
        displayTable: false
      })
      const config = {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, HEAD',
          'Access-Control-Allow-Credentials': 'false',
          'Content-Type': 'application/json; charset=utf-8',
          'x-request-id': 'ec8e508fa2cecab8e2c0ee7c1f29d397',
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHbG9iYWxTZXNzaW9uSWQiOiI3ZDNlZTlhOC1mN2M1LTExZTgtODEzYS0wYTU4NjQ2MGM2MzEiLCJhcHBfbmFtZSI6IkxlYXJuZXJEZXNrdG9wQmZmIiwiYXVkIjoiU25jV3pnbTdQS1FpNGxTSWhXdTVpdnZoTWRrWXpZTXIiLCJleHAiOjE1NDQxODgwMjEsImlhdCI6MTU0MzkyODgyMSwiaXNzIjoiVG9rZW5NYW5hZ2VyIiwibGF1bmNoVHlwZSI6ImRlZmF1bHQiLCJvcmdfdXNlcl9pZCI6ImZkNjIzZWUwLWEyOWQtNGZlZS1iODBlLWRiYWExNDUxZjVjYyIsIm9yZ2FuaXphdGlvbl9pZCI6ImQ2NjIwYTk0LWUyNDktNGE3Zi1iMWY1LTlkMTk5ODRlYWE3ZSIsInBvbGljeSI6InBvbF9hcHByZW5hbnQiLCJzdWIiOiJhdXRoMHw1YmUwNDkxYjZjMjkxNDA5MDBhOGQyNzMiLCJ0eXBlIjoiZXhjaGFuZ2VkIiwieC1qdGkiOiI3ZDNlZTlhOC1mN2M1LTExZTgtODEzYS0wYTU4NjQ2MGM2MzEiLCJ4LXJvbGUiOiJsZWFybmVyIn0.ajLHCZFumNWs9WDLDIquNwGnqPYhnREEMrWsggGrRvBsX9DFhSEqjns5Zkz26KiwmbCM7T57BHYOkfavddfkEL44ACk1wQCbFHPpaztxqGIdKzxEGmi_Yy1PykfqK6PEqRNDYs86R8ZySviDWQuSCxLUZxXStlVWayFc2KedtNVCGi8F-vvXc0wcdMsXQNgbOfHa1MbFruTvjMVycubDv9oXcgLqlUuPGK6RcbgkkxHX6QPRO3oo63UopeafD_o9_e7RXaq2ceMnTiVWRgZBmH1GiuDdOa6rZtPwstdIetVOtoMsrD-x9XNWJQalssks51pZcf_NlBg4rz60Quog83oKSMB4pyC3eK3kP-eAF31Ho3pAQfZj5-pOEAM8ninmoIIHmkPZHvqmmZ6hDopFUJhla6pp9iH15aVSz-esmZWF7XmxXwY07Z-PW_eHDtnBPlozX1nh-ANXVIc-uOq6oRAn6SNHUSiVyj7wWLzWICcJizl60rcVIzsHGzPcgW3_6kmsJbU8Y31HALfU69BtmrO5P7EMRVA9rX_dQXVZGdW5BbsR0MyxdC0Z6fb2gu3_SFIzL06qA8APp9PWZjlBBZkkQhhueOUwrju1CdCtRx9L9K-a-y03KwEFOVSRHFBjuW4YiEddk74HmaIDjkqNbdz1SUW4bH1POh-pyuTnuw4'
        },
        params: { q: wildcard }
      }
      const list = ['we found data for you', 'Hey we have that course', 'Enjoy the content', 'Great, data is there']
      axios.get(`http://localhost:3000/v1/search?locale=en`, config)
        .then(function (response) {
          _this.setState({
            results: response.data.results,
            displayTable: true
          })
          voiceController.say(list[Math.floor(Math.random() * list.length)])
        })
    })
  }

  stopAssistant () {
    let _this = this

    voiceController.fatality().then(() => {
      console.log('voiceController has been succesfully stopped')

      _this.setState({
        artyomActive: false
      })
    }).catch((err) => {
      console.error("Oopsy daisy, this shouldn't happen neither!", err)

      _this.setState({
        artyomActive: false
      })
    })
  }

  speakText () {
    let _this = this

    _this.setState({
      artyomIsReading: true
    })

    // Speak text with Artyom
    voiceController.say(_this.state.textareaValue, {
      onEnd () {
        _this.setState({
          artyomIsReading: false
        })
      }
    })
  }

  handleTextareaChange (event) {
    this.setState({
      textareaValue: event.target.value
    })
  }

  render () {
    const { displayTable, results, voiceController } = this.state
    return (
      <div className='App'>
        <center><h1>Welcome to Percipio Assistant</h1></center>

        <p>you can say "Hi" and ask for some thing</p>

        {/* Voice commands action buttons */}
        {/*
        <input type='button' value='Start Artyom' disabled={this.state.artyomActive} onClick={this.startAssistant} />
        */}
        <input type='button' value='Stop Assistant' disabled={!this.state.artyomActive} onClick={this.stopAssistant} />
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='col-md-12 center'>
                {
                  displayTable ? (<SearchTable results={results} voiceController={voiceController} />) : (<div />)
                }
              </div>
            </div>
          </div>
        </div>
        {/* Speech synthesis Area */}
        {/*
        <p>I can read some text for you if you want:</p>

        <textarea rows='5' onChange={this.handleTextareaChange} value={this.state.textareaValue} />
        */}
        <br />
        {/* Read the text inside the textarea with artyom
        <input type='button' value='Read Text' disabled={this.state.artyomIsReading} onClick={this.speakText} />
        */}
      </div>
    )
  }
}

export default App
