import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import { amber50, red50, green50 } from 'material-ui/styles/colors'

class Prompt extends Component {

    static propTypes = {
        status: PropTypes.string
    }

    static defaultProps = {
        status: 'STATUS_STANDBY'
    }

    render() {
        const bgCols = {
        'STATUS_STANDBY' : amber50,
        'STATUS_AWAIT_TIME' : red50,
        'STATUS_AWAIT_MSG' : green50
        }

        const styles ={
            width: "60%",
            margin: "0 auto",
            marginTop: "10px",
            paddingTop: "5px",
            paddingBottom: "5px",
            backgroundColor: bgCols[this.props.status]
        }

        return (
            <Paper style={styles}>
                {this.props.children}
            </Paper>
        )
    }
}

export default Prompt