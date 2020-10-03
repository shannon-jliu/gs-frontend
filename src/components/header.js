import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import AuthUtil from '../util/authUtil'

import {
  LOGIN_PAGE_ID,
  LOGOUT_PAGE_ID,
  TAGGING_PAGE_ID,
  MERGING_PAGE_ID,
  ADLC_PAGE_ID,
  SETTINGS_PAGE_ID,
  LOGS_PAGE_ID
} from '../constants/links.js'

const LINKS = Object.freeze({
  'Login': {name: 'Login', key: LOGIN_PAGE_ID, href: '/login', 'operator': false},
  'Logout': {name: 'Logout', key: LOGOUT_PAGE_ID, 'operator': false},
  'Tag': {name: 'Tagging', key: TAGGING_PAGE_ID, href: '/tag', 'operator': false},
  'Merging': {name: 'Merging', key: MERGING_PAGE_ID, href: '/merge', 'operator': true},
  'ADLC': {name: 'ADLC', key: ADLC_PAGE_ID, href: '#', 'operator': false},
  'Settings': {name: 'Settings', key: SETTINGS_PAGE_ID, href: '/settings', 'operator': false},
  'Logs': {name: 'Logs', key: LOGS_PAGE_ID, href: '/logs', 'operator': false},
})


export class Header extends Component {
  // try to pass in the current page as a prop so we can set its property to 'active'
  constructor(props) {
    super(props)
    this.props = props
    this.authenticated = this.props.authenticated
    this.operator = this.props.operator
  }

  render() {
    const linksToShow = _.filter(Object.keys(LINKS), key => !LINKS[key].operator || this.operator)
    return (
      <div>
        <nav>
          <div className="red nav-wrapper">
            <div className="brand-logo" style={{marginLeft:10}}>
              <a href="/#"><img src={require('../img/cuair_logo.png')} alt='' /></a>
            </div>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {
                _.map(linksToShow, key => {
                  const link = LINKS[key]
                  if (key === 'Logout') {
                    if (this.authenticated) {
                      return (
                        <li className={window.location.pathname === link.href ? 'active' : ''} key={link.key}>
                          <a href={'#'} onClick={() => AuthUtil.logout()}>{link.name}</a>
                        </li>
                      )
                    }
                  } else {
                    return (
                      <li className={window.location.pathname === link.href ? 'active' : ''} key={link.key}>
                        <a href={link.href}>{link.name}</a>
                      </li>
                    )
                  }
                }
                )}
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default Header
