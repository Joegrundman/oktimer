import React, { Component } from 'react'
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import './Timer.css'

class Timer extends Component {

    render(){

        const style={
            width: '80%',
            margin: '0 auto',
            marginBottom: '5px'
        }

        return (
        <Card style={style}>
            <CardHeader
                title={this.props.name}
                subtitle={this.props.timeMsg}
                />
            <CardActions>
                <FlatButton 
                    label="cancel" 
                    onClick={this.props.cancelTimer}/>
            </CardActions>
        </Card>
        )
    }
}

export default Timer