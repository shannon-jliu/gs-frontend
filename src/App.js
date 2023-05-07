import React, { Component } from 'react'
import { connect } from 'react-redux'

import Header from './components/header.js'
import utilOperations from './operations/utilOperations.js'
import AuthUtil from './util/authUtil'
import { useDispatch } from 'react-redux'

// App is a class component instead of a functional component due to a failing test case in App.test.js
// The only fix seems to be to make App a class component
export class App extends Component {
  constructor(props) {
    super(props)
    this.props = props
    this.authenticated = AuthUtil.authenticated(this.props.utilSettings.get('usersEnabled')) && window.location.pathname !== '/login'
    this.userType = window.location.pathname == '/login'? null: AuthUtil.userType(this.props.utilSettings.get('usersEnabled'))
  }

  componentDidMount() {
    this.props.getUsersEnabled()
  }

  render() {
    return (
      <div>
        <Header authenticated={this.authenticated} userType={this.userType}/>
        {
          this.props.main
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  utilSettings: state.utilReducer
})

const mapDispatchToProps = dispatch => ({
  getUsersEnabled: () => utilOperations.getUsersEnabled(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
