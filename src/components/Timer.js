import React, { Component } from 'react'
// import {Card, CardActions, CardHeader} from 'material-ui/Card';
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton';
import './Timer.css'

class Timer extends Component {

    render(){

        const style = {
            paddingTop: '10px',
            paddingBottom: '10px',
            width: '80%',
            margin: '0 auto',
            marginBottom: '5px'
        }

        return (
            <Paper style={style}>
                <span>{this.props.name} - {this.props.timeMsg}</span> 
                <FlatButton
                    label="cancel"
                    onClick={this.props.cancelTimer}/>
            </Paper>
        )
    }
}

export default Timer