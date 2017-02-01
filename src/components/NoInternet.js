import React, { Component } from 'react'
import Snackbar from 'material-ui/Snackbar'

class NoInternet extends Component {
    static propTypes = {
        open: React.PropTypes.bool
    }

    static defaultProps = {
        open: true
    }
    render () {
        
        const message = 'No internet connection. Unable to process speech.'

        return (
            <div>
            <Snackbar message={message} open={this.props.open}/>
             </div>
        )
    }
}

export default NoInternet