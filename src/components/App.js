import React, { Component } from 'react';
import { blue50, blue100, blue200 } from 'material-ui/styles/colors'
import Timer from './Timer'
import Navbar from './Navbar'
import NoInternet from './NoInternet'
import { parseTimer, speak } from '../modules/speech'
import './App.css';
import Help from './Help'
import alertSound from '../sms-alert-3-daniel_simon.mp3'

class App extends Component {
  constructor(props: any){
    super(props)

    this.STATUS = {
      STANDBY : 'STATUS_STANDBY',
      AWAIT_TIME: 'STATUS_AWAIT_TIME',
      AWAIT_MSG: 'STATUS_AWAIT_MSG'
    }

    this.state = {
      timers: [], // {[]} array of current timers
      status: this.STATUS.STANDBY, // {string} current status
      currentTime: 0, //{number} time for current timer
      currentTimeMsg: '', // {string} timeMessage for current timer
      okResponseMsg: 'OK', // {string} current response message after "okTimer"
      isOnline: true, // {bool} 
      voice: null, // {nullable string} default if null otherwise name of voice being used,
      showHelp: true, // {bool} shows help panel
      isAlerting: false // {bool} shows if message is currently alerting and waiting to be dismissed
    }

    this.resetTimer = null // {nullable function } contains timer to reset state after 60 seconds

    this.showHelp = this.showHelp.bind(this)
    this.dismissHelp = this.dismissHelp.bind(this)
    this.handleCloseTimer = this.handleCloseTimer.bind(this)
    this.handleSpeechEvent = this.handleSpeechEvent.bind(this)
    this.detectOkTimer = this.detectOkTimer.bind(this)
    this.setNewOkResponse = this.setNewOkResponse.bind(this)
    this.onChangeVoice = this.onChangeVoice.bind(this)
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

      // load presaved voice preference
      if(okTimerSavedData && okTimerSavedData.voice) {
        this.setState({
          voice: okTimerSavedData.voice
        })
      }  

      // initialise the SpeechRecognition api
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

    console.log(transcript)
      if(e.results[0].isFinal && transcript.toLowerCase() === ("ok timer")) {
          speak(this.state.okResponseMsg, this.state.voice)
          this.resetTimer = setTimeout(() => this.setState({status: this.STATUS.STANDBY}), 60000)
          this.setState({
            status: this.STATUS.AWAIT_TIME
          })
        }
  }

  detectTime(e) {
    console.log(this.state.status)
    const transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

      if(e.results[0].isFinal) {
        let time, timeMsg; // ; needed because next line is destructured
        [time, timeMsg] =  parseTimer (transcript)

        if(typeof time === 'number' && time > 0) {

        // disable speech recognition to avoid collision with speaking
        this.recognition.abort()
        this.recognition.removeEventListener('end', this.recognition.start)
          speak(timeMsg, 
            this.state.voice, 
            () => {
              this.setState({
              currentTime: time,
              currentTimeMsg: timeMsg,
              status: this.STATUS.AWAIT_MSG
            }, () => {
              //reenable speech recognition after speaking finished
              this.recognition.addEventListener('end', this.recognition.start)
              this.recognition.start()}
              )
            }
          )
        }
     }
  }

  takeMessageAndSetTimer(e) {
        console.log(this.state.status)

      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

      if(e.results[0].isFinal) {
        console.log('message: ',transcript)

        if (transcript === 'no') {
          // go back if time is incorrect and await a new time
          this.setState({
            status: this.STATUS.AWAIT_TIME,
          })
        } else {
          // proceed with creating new timer object
          console.log('creating new timer object')
          clearTimeout(this.resetTimer)
          const newTimer = {
            name: transcript,
            timeMsg: this.state.currentTimeMsg,
            timer: setTimeout(() => this.timeIsUp(transcript), this.state.currentTime)
          }
          speak(transcript + ' in ' + this.state.currentTimeMsg, this.state.voice)
          this.setState({
            timers: [...this.state.timers, newTimer],
            status: this.STATUS.STANDBY
          })
        }
      }
  }

  timeIsUp(name) {
    console.log('timer has expired:',name)
    var audio = new Audio(alertSound)
    audio.play()

    speak(name, this.state.voice)
    const nextTimers = this.state.timers.filter(t => t.name !== name)
    this.setState({
      timers: nextTimers
    })
  }

  dismissHelp() {
    this.setState({
      showHelp: false
    })
  }

  showHelp() {
    this.setState({
      showHelp: true
    })
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

  onChangeVoice(name) {
    const nextVoice = name
    this.setState({
      voice: nextVoice
    })
    // save to localstorage
    const okTimerSavedData = JSON.parse(window.localStorage.getItem("OkTimer"))
    const newTimerData = {...okTimerSavedData, voice: nextVoice}
    window.localStorage.setItem("OkTimer", JSON.stringify(newTimerData))
  }

  setNewOkResponse(newMsg) {
    this.setState({okResponseMsg: newMsg})
    // save to local storage
    const okTimerSavedData = JSON.parse(window.localStorage.getItem("OkTimer"))
    const newTimerData = {...okTimerSavedData, okResponseMsg: newMsg}
    window.localStorage.setItem("OkTimer", JSON.stringify(newTimerData)) 
  }

  render() {

    const bgCols = {
      'STATUS_STANDBY' : blue50,
      'STATUS_AWAIT_TIME' : blue100,
      'STATUS_AWAIT_MSG' : blue200
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
        <Navbar 
          okResponseMsg={this.state.okResponseMsg} 
          onSubmitNewOkResponseMsg={this.setNewOkResponse}
          handleChangeVoice={this.onChangeVoice}
          showHelp={this.showHelp}
          />
        {this.state.showHelp ? 
          <Help okResponseMsg={this.state.okResponseMsg} dismissHelp={this.dismissHelp}/> : ''}
        {timers}
        <NoInternet open={!this.state.isOnline} />
      </div>
    );
  }
}

export default App;
