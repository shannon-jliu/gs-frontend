import React, { Component } from 'react'

import {
  LOGIN_PAGE_ID,
  TAGGING_PAGE_ID,
  MERGING_PAGE_ID,
  ADLC_PAGE_ID,
  CAMERA_SETTINGS_PAGE_ID,
  GIMBAL_AIRDROP_PAGE_ID,
  LOGS_PAGE_ID
} from '../constants/links.js'

const LINKS = Object.freeze({
  'Login': {name: 'Login', key: LOGIN_PAGE_ID, href: '/login'},
  'Tag': {name: 'Tagging', key: TAGGING_PAGE_ID, href: '/tag'},
  'Merging': {name: 'Merging', key: MERGING_PAGE_ID, href: '#'},
  'ADLC': {name: 'ADLC', key: ADLC_PAGE_ID, href: '#'},
  'Camera': {name: 'Camera Settings', key: CAMERA_SETTINGS_PAGE_ID, href: '#'},
  'GimbalAirdrop': {name: 'Gimbal and Airdrop', key: GIMBAL_AIRDROP_PAGE_ID, href: '#'},
  'Logs': {name: 'Logs', key: LOGS_PAGE_ID, href: '/logs'},
})


class Header extends Component {
  // try to pass in the current page as a prop so we can set its property to 'active'
  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    return (
      <div>
        <nav>
          <div className="red nav-wrapper">
            <div className="brand-logo" style={{marginLeft:10}}>
              <a href="#"><img src={require('../img/cuair_logo.png')}/></a>
            </div>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {
                Object.keys(LINKS).map((key) => {
                  const link = LINKS[key]
                  return (
                    <li className={window.location.pathname === link.href ? 'active' : ''} key={link.key}>
                      <a href={link.href}>{link.name}</a>
                    </li>
                  )
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
