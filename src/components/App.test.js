import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import App from './App';

injectTapEventPlugin()

const OkTimer = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
)

window.localStorage = {
  getItem: (name) => {return  {"okTimer" : "test"} }
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<OkTimer />, div);
});
