import React, { Component } from 'react'
import './Timer.css'

class Timer extends Component {
    render(){
        return (
            <div className="Timer">
                {this.props.children}
            </div>
        )
    }
}

export default Timer