import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'

class Help extends Component {

    static propTypes = {
        okResponseMsg: PropTypes.string,
        dismissHelp: PropTypes.func.isRequired
    }

    static defaultProps = {
        okResponseMsg: 'yes?'
    }

    render () {
        const style = {
            width: '90%',
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingLeft: '20px',
            paddingRight: '20px',
            margin: '0 auto',
            marginTop: '10px',
            marginBottom: '5px'
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
                When a timer reaches the end it will repeat every ten seconds. The timer can be dismissed by pressing the button, or by calling "dismiss".
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