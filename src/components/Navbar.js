import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import OkResponseDialog from './OkResponseDialog'

class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            okResponseDialogOpen: false,
            currentTextField: ''
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleOpen() {
        this.setState({okResponseDialogOpen: true});
    }

    handleClose() {
        this.setState({okResponseDialogOpen: false});
    }

    handleSubmit() {
        console.log('submitting', this.state.currentTextField)
        this.props.onSubmitNewOkResponseMsg(this.state.currentTextField)
        this.handleClose()
    }

    handleTextChange = (e, newString) => {
        console.log(newString)
        this.setState({
            currentTextField: newString
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
                    <MenuItem primaryText="Ok Response" onClick={this.handleOpen} />
                </IconMenu>
            }
        />
        <OkResponseDialog 
        open={this.state.okResponseDialogOpen} 
        handleClose={this.handleClose}
        defaultValue={this.props.okResponseMsg}
        handleTextChange={this.handleTextChange}
        handleSubmit={this.handleSubmit}
        />

    </div>
        )
    }
}

export default Navbar