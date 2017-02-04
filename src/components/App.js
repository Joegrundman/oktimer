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
      isOnline: true,
      voice: null
    }

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

      if(e.results[0].isFinal && transcript.toLowerCase() === ("ok timer")) {
          speak(this.state.okResponseMsg, this.state.voice)
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

        // disable speech recognition to avoid collision with speaking
        this.recognition.abort()
        this.recognition.removeEventListener('end', this.recognition.start)
          speak(transcript, 
            this.state.voice, 
            () => {
              this.setState({
              currentTime: time,
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
    console.log('in app, onchangevoice', name)
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
          speak(transcript + ' ' + this.state.currentTimeMsg, this.state.voice)
          this.setState({
            timers: [...this.state.timers, newTimer],
            status: this.STATUS.STANDBY
          })
        }
      }
  }

  timeIsUp(name) {
    console.log('timer has expired:',name)
    speak(name, this.state.voice)
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
        <Navbar 
          okResponseMsg={this.state.okResponseMsg} 
          onSubmitNewOkResponseMsg={this.setNewOkResponse}
          handleChangeVoice={this.onChangeVoice}
          />
        <p className="App-intro">
          To start a new timer, say "OK Timer", and wait for the response message, "{this.state.okResponseMsg}".
        </p>
        <p>
        Then give the time, e.g. "two minutes" or "four minutes thirty seconds" and wait for the response.
        </p>
        <p>
        If you wish to redo the time, say "no!". Otherwise give the message you would like to receive after the time has expired.
        </p>
        {timers}
        <NoInternet open={!this.state.isOnline} />
      </div>
    );
  }
}

export default App;
