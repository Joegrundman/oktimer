import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'

class Help extends Component {

    static propTypes = {
        okResponseMsg: PropTypes.string,
        dismissHelp: PropTypes.func.isRequired,
        isHidden: PropTypes.bool
    }

    static defaultProps = {
        okResponseMsg: 'yes?',
        isShowing: false
    }

    render () {
        const style = {
            width: '90%',
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingLeft: '20px',
            paddingRight: '20px',
            margin: '0 auto',
            marginTop: this.props.isHidden ? '0px' : '10px',
            marginBottom: '5px',
            transition: '0.3s ease',
            height: this.props.isHidden ? '0px' : '',
            opacity: this.props.isHidden ? 0 : 1,
            visibility: this.props.isHidden ? 'hidden' : 'visible'
        }
        return (
            <Paper style={style}>
                <p>
                To start a new timer, say "OK Timer", and wait for the response message, "{this.props.okResponseMsg}".
                </p>
                <p>
                Then give the time, e.g. "two minutes" or "four minutes thirty seconds" and wait for the response.
                </p>
                <p>
                If you wish to redo the time, say "no!". Otherwise give the message you would like to receive after the time has expired.
                </p>
                <p>
                When a timer reaches the end it will repeat every 15 seconds. The timer can be dismissed by pressing the button, or by calling "dismiss" or "cancel".
                </p>
                <p>
                    This help panel can be brought back from the Options menu in the top right.
                </p>
                <FlatButton label="Got it" onClick={this.props.dismissHelp} primary={true}/>
                <FlatButton label="Don't show again." onClick={this.props.dismissHelpPermanently} primary={true}/>
            </Paper>
        )
    }
}

export default Help