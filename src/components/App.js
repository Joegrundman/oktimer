import React, { Component } from 'react';
import Timer from './Timer'
import Navbar from './Navbar'
import { parseTimer, speak } from '../modules/speech'
import './App.css';

class App extends Component {
  constructor(props){
    super(props)

    this.STATUS = {
      STANDBY : 'STATUS_STANDBY',
      AWAIT_TIME: 'STATUS_AWAIT_TIME',
      AWAIT_MSG: 'STATUS_AWAIT_MSG'
    }

    this.state = {
      timers: [],
      status: this.STATUS.STANDBY,
      currentTime: 0,
      currentTimeMsg: '',
      okResponseMsg: 'OK'

    }

    this.handleCloseTimer = this.handleCloseTimer.bind(this)
    this.handleSpeechEvent = this.handleSpeechEvent.bind(this)
    this.detectOkTimer = this.detectOkTimer.bind(this)
    this.setNewOkResponse = this.setNewOkResponse.bind(this)
  }

  componentDidMount() {
      // load saved data from localStorage
      const okTimerSavedData = JSON.parse(window.localStorage.getItem("OkTimer")) 

      if(okTimerSavedData && okTimerSavedData.okResponseMsg) {
        this.setState({
          okResponseMsg: okTimerSavedData.okResponseMsg
        })
      }   
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
      default: this.detectOkTimer(e); break
    }
  }

  detectOkTimer(e) {
    const transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

      if(e.results[0].isFinal && transcript.toLowerCase() === ("ok timer")) {
          speak(this.state.okResponseMsg)
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

  handleCloseTimer (target) {
    const timers = this.state.timers.filter(t => timers !== t)
    this.setState({
      timers
    })
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
        speak(transcript + ' ' + this.state.currentTimeMsg)
        this.setState({
          timers: [...this.state.timers, newTimer],
          status: this.STATUS.STANDBY
        })
      }
  }

  setNewOkResponse(newMsg) {
    this.setState({okResponseMsg: newMsg})
    const okTimerSavedData = JSON.parse(window.localStorage.getItem("OkTimer"))
    const newTimerData = {...okTimerSavedData, okResponseMsg: newMsg}
    window.localStorage.setItem("OkTimer", JSON.stringify(newTimerData)) 
  }

  timeIsUp(name) {
    console.log('timer has expired:',name)
    speak(name)
    const nextTimers = this.state.timers.filter(t => t.name !== name)
    this.setState({
      timers: nextTimers
    })
  }

  render() {

    const timers = this.state.timers.map((t,i) => (
      <Timer key={i} onClose={this.handleCloseTimer}>{t.name}</Timer>
      ))

    return (
      <div className="App">
        <Navbar okResponseMsg={this.state.okResponseMsg} onSubmitNewOkResponseMsg={this.setNewOkResponse}/>
        <p className="App-intro">
          To start a new timer, say "OK Timer", then say the message and the time.
        </p>
        {timers}
      </div>
    );
  }
}

export default App;
