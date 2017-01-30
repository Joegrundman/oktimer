import React, { Component } from 'react';
import logo from './logo.svg';
import Timer from './Timer'
import { parseTimer } from '../modules/speech'
import './App.css';

class App extends Component {
  constructor(props){
    super(props)

    this.STATUS = {
      STANDBY : 'STATUS_STANDBY',
      AWAIT_TIME: 'STATUS_AWAIT_TIME',
      AWAIT_MSG: 'STATUS_AWAIT_MSG'
    }

    // const defaultTimers = ['eat', 'drink', 'fuck', 'shag sheep', 'drink schnapps', 'talk about submarines']
    // const defaultTimersReady = []
    // defaultTimers.forEach((defaultTimer, i) => {
    //     defaultTimersReady.push({
    //       name: defaultTimer,
    //       timer: setTimeout(() => this.timeIsUp(defaultTimer), 10000 * (i + 1))
    //     })
    // })

    this.state = {
      timers: [],
      status: this.STATUS.STANDBY,
      currentTime: 0,
      currentTimeMsg: ''
    }

    this.handleClose = this.handleClose.bind(this)
    this.handleSpeechEvent = this.handleSpeechEvent.bind(this)
    this.detectOkTimer = this.detectOkTimer.bind(this)
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
    switch(this.state.status) {
      case this.STATUS.STANDBY: this.detectOkTimer(e); break
      case this.STATUS.AWAIT_TIME: this.parseTime(e); break
      case this.STATUS.AWAIT_MSG: this.takeMessageAndSetTimer(e); break;
      default: this.detectOkTimer(e)
    }
  }

  detectOkTimer(e) {
    const transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

      if(e.results[0].isFinal && transcript.toLowerCase() === ("ok timer")) {
          this.speak('sup bitch?')
          console.log('ready...')
          this.setState({
            status: this.STATUS.AWAIT_TIME
          })
        }
  }

  parseTime(e) {
    const transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

      if(e.results[0].isFinal) {
        console.log(transcript)
        this.setState({
          currentTimeMsg : transcript
        })
        let time =  parseTimer (transcript)
        if(typeof time === 'number' && time > 0) {
          this.setState({
            currentTime: time,
            status: this.STATUS.AWAIT_MSG
          })
        }
     }
  }

  handleClose (target) {
    const timers = this.state.timers.filter(t => timers !== t)
    this.setState({
      timers
    })
  }

  speak (text){
      const msg = new SpeechSynthesisUtterance()
      msg.text = text
      speechSynthesis.speak(msg)
  }

  takeMessageAndSetTimer(e) {
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

      if(e.results[0].isFinal) {
        console.log(transcript)
        const newTimer = {
          name: transcript,
          timer: setTimeout(() => this.timeIsUp(transcript), this.state.currentTime)
        }
        this.speak(transcript + ' ' + this.state.currentTimeMsg)
        this.setState({
          timers: [...this.state.timers, newTimer],
          status: this.STATUS.STANDBY
        })
      }
  }

  timeIsUp(name) {
    console.log('timer has expired:',name)
    this.speak(name)
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
