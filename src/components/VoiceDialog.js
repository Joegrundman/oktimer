import React, { Component } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

class VoiceDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voices: [],
            value: 0
        }

        this.populateVoices = this.populateVoices.bind(this)
        this.handleVoiceChange = this.handleVoiceChange.bind(this)
    }

    componentDidMount() {
        window.speechSynthesis.addEventListener('voiceschanged', this.populateVoices)
    }

    populateVoices (e) {
        this.setState ({ voices: window.speechSynthesis.getVoices() })
    }

    handleVoiceChange (e, index, value) {
        this.setState({ value })
    }

    componentWillUnmount() {
        window.speechSynthesis.removeEventListener('voiceschanged')
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
                onTouchTap={() => this.props.handleSubmit(this.state.voices[this.state.value].name)}
            />,
            ]

        const menuItems = this.state.voices.map((v, i) => (
            <MenuItem key={i} value={i} primaryText={v.name} />
        ))
        
        return (
            <Dialog
                title="Select the voice."
                actions={actions}
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
            >
            <SelectField
                id="select-voice"
                floatingLabelText="Select Voice"
                value={this.state.value}
                onChange={this.handleVoiceChange}>
            {menuItems}
            </SelectField>
            </Dialog>
        )
    }
}

export default VoiceDialog