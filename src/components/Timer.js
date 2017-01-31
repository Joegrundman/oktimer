import React, { Component } from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import './Timer.css'

class Timer extends Component {
    render(){
        return (
        <Card 
            className="Timer"
            expandable={true}
            >
            <CardHeader
                title={this.props.name}
                subtitle={this.props.timeMsg}
                />
            <CardActions>
                <FlatButton label="cancel" />
            </CardActions>
            <CardText>
                Woot
            </CardText>
        </Card>
        )
    }
}

export default Timer