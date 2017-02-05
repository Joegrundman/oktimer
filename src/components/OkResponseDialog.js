import React, { Component, PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

class OkResponseDialog extends Component {

    static propTypes = {
        handleClose: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        handleTextChange: PropTypes.func.isRequired,
        open: PropTypes.bool,
        defaultValue: PropTypes.string
    }

    static defaultProps = {
        open: false,
        defaultValue: 'yes?'
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.props.handleSubmit}
            />,
            ]
        return (
            <Dialog
                title="Set OK Timer Response Message"
                actions={actions}
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
            >
            <TextField
                id="text-field-ok-response-message"
                defaultValue={this.props.defaultValue}
                onChange={this.props.handleTextChange}
            />
            </Dialog>
        )
    }
}

export default OkResponseDialog