import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import OkResponseDialog from './OkResponseDialog'
import VoiceDialog from './VoiceDialog'

class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            okResponseDialogOpen: false,
            currentTextField: '',
            voiceDialogOpen: false
        }
        this.handleOpenOkResponse = this.handleOpenOkResponse.bind(this)
        this.handleCloseOkResponse = this.handleCloseOkResponse.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleOpenVoiceDialog = this.handleOpenVoiceDialog.bind(this)
        this.handleCloseVoiceDialog = this.handleCloseVoiceDialog.bind(this)
        this.handleChangeVoiceSubmit = this.handleChangeVoiceSubmit.bind(this)
        this.handleOkResponseTextChange = this.handleOkResponseTextChange.bind(this)
    }

    handleOpenOkResponse() {
        this.setState({okResponseDialogOpen: true});
    }

    handleCloseOkResponse() {
        this.setState({okResponseDialogOpen: false});
    }

    handleChangeVoiceSubmit(name) {
        // console.log('new voice name,', name)
        this.props.handleChangeVoice(name)
        this.handleCloseVoiceDialog()
    }

    handleSubmit() {
        if(this.state.currentTextField.trim() === ''){
            this.handleCloseOkResponse()
            return
        }
        console.log('submitting', this.state.currentTextField)
        this.props.onSubmitNewOkResponseMsg(this.state.currentTextField)
        this.handleCloseOkResponse()

    }

    handleOkResponseTextChange (e, newString) {
        console.log(newString)
        this.setState({
            currentTextField: newString
        })
    }

    handleOpenVoiceDialog(e) {
        this.setState({
            voiceDialogOpen: true
        })
    }

    handleCloseVoiceDialog(e) {
        this.setState({
            voiceDialogOpen: false
        })
    }

    render() {
        return (
    <div>
        <AppBar 
            title="OK Timer" 
            iconElementRight={
                <IconMenu
                    iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                >
                    <MenuItem primaryText="Help" />
                    <MenuItem primaryText="Ok Response" onClick={this.handleOpenOkResponse} />
                    <MenuItem primaryText="Set Voice" onClick={this.handleOpenVoiceDialog}/>
                </IconMenu>
            }
        />
        <OkResponseDialog 
            open={this.state.okResponseDialogOpen} 
            handleClose={this.handleCloseOkResponse}
            defaultValue={this.props.okResponseMsg}
            handleTextChange={this.handleOkResponseTextChange}
            handleSubmit={this.handleSubmit}
        />
        <VoiceDialog 
            open={this.state.voiceDialogOpen} 
            handleClose={this.handleCloseVoiceDialog}
            handleSubmit={this.handleChangeVoiceSubmit}
        />

    </div>
        )
    }
}

export default Navbar