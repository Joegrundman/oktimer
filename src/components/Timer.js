import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import { amber100 } from 'material-ui/styles/colors'

class Timer extends Component {

    static propTypes = {
        timer: PropTypes.shape({
            name: PropTypes.string.isRequired,
            timeMsg: PropTypes.string.isRequired, 
            expired: PropTypes.bool          
        }),
        cancelTimer: PropTypes.func.isRequired
    }

    render(){

        let style = {
            paddingTop: '10px',
            paddingBottom: '10px',
            width: '80%',
            margin: '0 auto',
            marginTop: '10px',
            backgroundColor: this.props.timer.expired ? amber100 : '#fff'
            
        }

        return (
            <Paper style={style}>
                <span>{this.props.timer.name} - {this.props.timer.timeMsg}</span> 
                <FlatButton
                    label={this.props.timer.expored ? "dismiss" :"cancel"}
                    primary={true}
                    onClick={this.props.cancelTimer}/>
            </Paper>
        )
    }
}

export default Timer