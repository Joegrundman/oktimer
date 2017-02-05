import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton';

class Timer extends Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        timeMsg: PropTypes.string.isRequired,
        cancelTimer: PropTypes.func.isRequired
    }

    render(){

        const style = {
            paddingTop: '10px',
            paddingBottom: '10px',
            width: '80%',
            margin: '0 auto',
            marginTop: '10px'
        }

        return (
            <Paper style={style}>
                <span>{this.props.name} - {this.props.timeMsg}</span> 
                <FlatButton
                    label="cancel"
                    primary={true}
                    onClick={this.props.cancelTimer}/>
            </Paper>
        )
    }
}

export default Timer