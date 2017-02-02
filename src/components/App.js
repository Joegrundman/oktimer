import React, { Component } from 'react';
import Timer from './Timer'
import Navbar from './Navbar'
import NoInternet from './NoInternet'
import { parseTimer, speak } from '../modules/speech'
import './App.css';

class App extends Component {
  constructor(props: any){
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
      okResponseMsg: 'OK',
      isOnline: true
    }

    this.handleCloseTimer = this.handleCloseTimer.bind(this)
    this.handleSpeechEvent = this.handleSpeechEvent.bind(this)
    this.detectOkTimer = this.detectOkTimer.bind(this)
    this.setNewOkResponse = this.setNewOkResponse.bind(this)
  }

  componentDidMount() {
      // detect online status
      window.addEventListener('online', () => this.setState({isOnline: true}))
      window.addEventListener('offline', () => this.setState({isOnline: false}))

      // load saved data from localStorage
      const okTimerSavedData = JSON.parse(window.localStorage.getItem("OkTimer")) || null
      // load response msg from localstorage if there is one
      if(okTimerSavedData && okTimerSavedData.okResponseMsg) {
        this.setState({
          okResponseMsg: okTimerSavedData.okResponseMsg
        })
      }   

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()

      this.recognition.interimResults = false
      this.recognition.addEventListener('result', this.handleSpeechEvent)
      this.recognition.addEventListener('end', this.recognition.start)
      this.recognition.start()
  }

  handleSpeechEvent(e) {
    switch(this.state.status) {
      case this.STATUS.STANDBY: this.detectOkTimer(e); break
      case this.STATUS.AWAIT_TIME: this.detectTime(e); break
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

  detectTime(e) {
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
          speak(transcript, () => this.setState({
              currentTime: time,
              status: this.STATUS.AWAIT_MSG
            })
          )
        }
     }
  }

  handleCloseTimer (target) {
    console.log('closing', target)
    
    const timers = this.state.timers
      .map(t => {
        if(t.name === target) {
          clearTimeout(t.timer)
        }
        return t
      })
      .filter(t => t.name !== target)

      this.setState({
        timers
      })
  }

  setNewOkResponse(newMsg) {
    this.setState({okResponseMsg: newMsg})
    const okTimerSavedData = JSON.parse(window.localStorage.getItem("OkTimer"))
    const newTimerData = {...okTimerSavedData, okResponseMsg: newMsg}
    window.localStorage.setItem("OkTimer", JSON.stringify(newTimerData)) 
  }

  takeMessageAndSetTimer(e) {
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

      if(e.results[0].isFinal) {
        console.log('message: ',transcript)

        if (transcript === 'no') {
          // go back if time is incorrect and await a new time
          this.setState({
            status: this.STATUS.AWAIT_TIME
          })
        } else {
          // proceed with creating new timer object
          console.log('creating new timer object')
          const newTimer = {
            name: transcript,
            timeMsg: this.state.currentTimeMsg,
            timer: setTimeout(() => this.timeIsUp(transcript), this.state.currentTime)
          }
          speak(transcript + ' ' + this.state.currentTimeMsg)
          this.setState({
            timers: [...this.state.timers, newTimer],
            status: this.STATUS.STANDBY
          })
        }
      }
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

    const bgCols = {
      'STATUS_STANDBY' : '#ebe',
      'STATUS_AWAIT_TIME' : '#bee',
      'STATUS_AWAIT_MSG' : '#eeb'
    }

    const style={
      backgroundColor: bgCols[this.state.status]
    }

    const timers = this.state.timers.map((t,i) => (
      <Timer 
        key={i} 
        onClose={this.handleCloseTimer} 
        name={t.name} 
        timeMsg={t.timeMsg} 
        cancelTimer={() => this.handleCloseTimer(t.name)} />
      ))

    return (
      <div className="App" style={style}>
        <Navbar okResponseMsg={this.state.okResponseMsg} onSubmitNewOkResponseMsg={this.setNewOkResponse}/>
        <h5>Status:{this.state.status}</h5>
        <p className="App-intro">
          To start a new timer, say "OK Timer", then say the time and the message.
        </p>
        {timers}
        {this.state.isOnline ? '' : <NoInternet />}
      </div>
    );
  }
}

export default App;
