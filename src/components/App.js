import React, { Component } from 'react';
import logo from './logo.svg';
import Timer from './Timer'
import { isTimer, parseTimer } from '../speechtimes'
import './App.css';

class App extends Component {
  constructor(props){
    super(props)

    this.STATUS = {
      STANDBY : 'STATUS_STANDBY',
      LISTENING: 'LISTENING'
    }

    const defaultTimers = ['eat', 'drink', 'fuck', 'shag sheep', 'drink schnapps', 'talk about submarines']
    const defaultTimersReady = []
    defaultTimers.forEach((defaultTimer, i) => {
        defaultTimersReady.push({
          name: defaultTimer,
          timer: setTimeout(() => this.timeIsUp(defaultTimer), 10000 * (i + 1))
        })
    })

    this.state = {
      timers: defaultTimersReady,
      status: this.STATUS.STANDBY
    }
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.interimResults = true
      this.recognition.addEventListener('result', this.handleSpeechEvent)
      this.recognition.addEventListener('end', this.recognition.start)
      this.recognition.start()
  }

  handleSpeechEvent(e) {
     if (this.state.status === this.STATUS.STANDBY) {
       this.detectOkTimer(e)
     } 
     else if(this.state.status === this.STATUS.LISTENING){
       this.parseMessage(e)
     }
  }

  detectOkTimer(e) {
    const transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

      if(e.results[0].isFinal && transcript.toLowerCase() === ("ok timer")) {
          const msg = new SpeechSynthesisUtterance()
          msg.text = "OK"
          speechSynthesis.speak(msg)
        }
  }

  parseMessage(e) {
    const transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

      if(e.results[0].isFinal) {
        if(isTimer(transcript)) {

        }
      }
  }

  handleClose (target) {
    const timers = this.state.timers.filter(t => timers !== t)
    this.setState({
      timers
    })
  }

  timeIsUp(name) {
    console.log('timer has expired:',name)
    const nextTimers = this.state.timers.filter(t => t.name !== name)
    this.setState({
      timers: nextTimers
    })
  }

  render() {

    const timers = this.state.timers.map((t,i) => (
      <Timer key={i} onClose={this.handleClose}>{t.name}</Timer>
      ))
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>OK Timer</h2>
        </div>
        <p className="App-intro">
          To start a new timer, say "OK Timer", then say the message and the time.
        </p>
        {timers}
      </div>
    );
  }
}

export default App;
