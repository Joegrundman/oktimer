import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Radium from 'radium'
import { blue50, blue100, blue200, blue300, blue400 } from 'material-ui/styles/colors'
import Timer from './Timer'
import Navbar from './Navbar'
import NoInternet from './NoInternet'
import Prompt from './Prompt'
import { getTranscript, parseTimer, speak } from '../modules/speech'
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
      hideHelp: false, // {bool} shows help panel
      isAlerting: false // {bool} shows if message is currently alerting and waiting to be dismissed
    }

    this.resetTimer = null // {nullable function } contains timer to reset state after 60 seconds
    this.audio = null
    this.timeInterval = null;

    this.showHelp = this.showHelp.bind(this)
    this.dismissHelp = this.dismissHelp.bind(this)
    this.handleCloseTimer = this.handleCloseTimer.bind(this)
    this.handleSpeechEvent = this.handleSpeechEvent.bind(this)
    this.detectOkTimer = this.detectOkTimer.bind(this)
    this.setNewOkResponse = this.setNewOkResponse.bind(this)
    this.onChangeVoice = this.onChangeVoice.bind(this)
    this.resetOkTimer = this.resetOkTimer.bind(this)
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

      // load presaved showHelp preference
      if(okTimerSavedData && okTimerSavedData.hideHelp) {
        this.setState({
          hideHelp: !okTimerSavedData.hideHelp
        })
      }  

      // initialise the audio sound
      this.audio = new Audio(alertSound)

      // initialise the SpeechRecognition api
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()

      this.recognition.interimResults = false
      this.recognition.addEventListener('result', this.handleSpeechEvent)
      this.recognition.addEventListener('end', this.recognition.start)
      this.recognition.start()

      //initialise the interval to mark the countdowns
      this.timeInterval = setInterval(() => {
        const nextTimers = this.state.timers.map(t => {
          if(t.timeRemaining > 0){ 
            t.timeRemaining -= 1000
          }
          return t
        })
        this.setState({
          timers: nextTimers
        })
      }, 1000)
  }

  componentWillUnmount(){
    // remove interval when app closed just in case
    clearInterval(this.timeInterval)
  }

  handleSpeechEvent(e) {
    // depending on status, the speech event is sent to different handlers
    switch(this.state.status) {
      case this.STATUS.STANDBY: this.detectOkTimer(e); break
      case this.STATUS.AWAIT_TIME: this.detectTime(e); break
      case this.STATUS.AWAIT_MSG: this.takeMessageAndSetTimer(e); break;
      default: this.detectOkTimer(e); break
    }
  }

  resetOkTimer() {
    this.setState({status: this.STATUS.STANDBY})
                  //reenable speech recognition after speaking finished
    try {
      this.recognition.addEventListener('end', this.recognition.start)
      this.recognition.start()
    } 
    catch (err) {
      console.log('attempting to reattach speech listeners failed', err)
    }
  }

  detectOkTimer(e) {
    const transcript = getTranscript(e)

    console.log(transcript)
      if(e.results[0].isFinal && transcript.toLowerCase() === ("ok timer")) {
          speak(this.state.okResponseMsg, this.state.voice)
          this.resetTimer = setTimeout(this.resetOkTimer, 60000)
          this.setState({
            status: this.STATUS.AWAIT_TIME
          })
      } else if (e.results[0].isFinal && (transcript.toLowerCase() === ("dismiss") || transcript.toLowerCase() === ("cancel"))) {
        this.dismissExpiredTimers()
      }
  }

  detectTime(e) {
    console.log(this.state.status)
    const transcript = getTranscript(e)

    console.log(transcript)

      if(e.results[0].isFinal) {
        let time, timeMsg; // ; needed because next line is destructured
        [time, timeMsg] =  parseTimer (transcript)

        if(typeof time === 'number' && time > 0) {
        console.log('valid time received at app', time)
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

  dismissExpiredTimers() {
    const expiredTimers = this.state.timers.filter(t => t.expired === true)
    expiredTimers.forEach(t => this.handleCloseTimer(t.name))
  }

  takeMessageAndSetTimer(e) {
        console.log(this.state.status)

      const transcript = getTranscript(e)

        console.log(transcript)

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
            timeRemaining: this.state.currentTime,
            timer: setTimeout(() => this.timeIsUp(transcript), this.state.currentTime),
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
    // play once
    this.audio.play()
    speak(name, this.state.voice)
    const nextTimers = this.state.timers.map(t => {

      if(t.name !== name) { return t }
        t.expired = true
      // time interval repeats until dismissed
      t.interval = setInterval(() => {
        this.audio.play()
        speak(name, this.state.voice)
      }, 15000)    
      return t
    })

    this.setState({
      timers: nextTimers
    })
  }

  dismissHelp(permanently) {
    if(permanently) {
      // save to localstorage
      const okTimerSavedData = JSON.parse(window.localStorage.getItem("OkTimer"))
      const newTimerData = {...okTimerSavedData, hideHelp: true}
      window.localStorage.setItem("OkTimer", JSON.stringify(newTimerData))     
    }
    this.setState({
      hideHelp: true
    })
  }

  showHelp() {
    this.setState({
      hideHelp: false
    })
  }

  handleCloseTimer (target) {
    console.log('closing', target)    
    const timers = this.state.timers
      .map(t => {
        if(t.name === target) {
          clearTimeout(t.timer)
          clearInterval(t.interval)
          clearInterval(t.timeRemaining)
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
     const bgColsStart = {
      'STATUS_STANDBY' : blue200,
      'STATUS_AWAIT_TIME' : blue300,
      'STATUS_AWAIT_MSG' : blue400
     }
    
    const statusMessage = {
      'STATUS_STANDBY' : 'Say "OK Timer" to start.',
      'STATUS_AWAIT_TIME' : "Give the time delay.",
      'STATUS_AWAIT_MSG' : "Give the message to be said after the delay."     
    }

    const style = {
        background: `linear-gradient(${bgColsStart[this.state.status]}, ${bgCols[this.state.status]})`
    }

    const timers = this.state.timers.map((t,i) => (
      <Timer 
        key={i} 
        onClose={this.handleCloseTimer} 
        timer={t}
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
        <div className="scrollable">
        <Help okResponseMsg={this.state.okResponseMsg} 
              dismissHelp={this.dismissHelp}
              isHidden={this.state.hideHelp} 
              dismissHelpPermanently={() => this.dismissHelp(true)/* true:  permanent*/}/>

        <Prompt status={this.state.status}>
          {statusMessage[this.state.status]}
        </Prompt>

          <ReactCSSTransitionGroup
            transitionName="timers"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
          {timers}
          </ReactCSSTransitionGroup>
        </div>
        <NoInternet open={!this.state.isOnline} />
      </div>
    );
  }
}

export default Radium(App);
