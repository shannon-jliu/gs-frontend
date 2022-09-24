import React, { Component } from 'react'
import { connect } from 'react-redux'

import AuthUtil from '../../util/authUtil.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

import './login.css'

export class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: ''
    }
    this.redirect = this.redirect.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.login = this.login.bind(this)
    this.loginCallback = this.loginCallback.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentDidMount() {
    this.redirect(window.location.href)
  }

  // append #force if you want to access login page once
  // already authenticated
  redirect(currentHref) {
    let usersEnabled = this.props.utilSettings.get('usersEnabled')
    if (
      usersEnabled !== undefined &&
      AuthUtil.authenticated(usersEnabled) &&
      !currentHref.endsWith('#force') &&
      !currentHref.endsWith('#force/') &&
      !currentHref.endsWith('#forced') &&
      !currentHref.endsWith('#forced/')
    ) {
      window.location.assign('/tag')
    } else {
      if (
        (currentHref.endsWith('#force') ||
          currentHref.endsWith('#force/')) &&
        !currentHref.endsWith('#forced') &&
        !currentHref.endsWith('#forced/')
      ) {
        window.location.assign('/login#forced')
        window.location.reload(true)
      }
    }
  }

  handleInput(field) {
    return e => {
      var appendableState = {}
      appendableState[field] = e.target.value
      this.setState(appendableState)
    }
  }

  login() {
    AuthUtil.login(this.state.username, (success, res) => {
      this.loginCallback(success, res)
    })
  }

  loginCallback(success, res) {
    if (success) {
      window.location.assign('/tag')
    } else {
      if (!res || res.responseText == null) {
        SnackbarUtil.render('Failed to login')
      } else {
        SnackbarUtil.render(res.responseText)
      }
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') this.login()
  }

  render(e) {
    return (
      <div>
        <div className="vert-center login">
          <div className="row">
            <div className="col offset-m4 m4">
              <div className="card white">
                <div className="card-content white-text">

                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        id="username-input"
                        onChange={this.handleInput('username')}
                        type="text"
                        className="validate"
                        value={this.state.username}
                      />
                      <label className="username-label" htmlFor="username">Username</label>
                    </div>
                  </div>

                  <button
                    to="/tag"
                    onClick={this.login}
                    style={{ width: '100%' }}
                    className="btn waves-effect waves-light red accent-1"
                  >
                    Login
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  utilSettings: state.utilReducer
})

export default connect(mapStateToProps, null)(Login)
