import React, { Component } from 'react'
import _ from 'lodash'

import {
  LOGIN_PAGE_ID,
  TAGGING_PAGE_ID,
  MERGING_PAGE_ID,
  ADLC_PAGE_ID,
  SETTINGS_PAGE_ID,
  /* TODO: Add a FIREWORKS_PAGE_ID to the list. Make sure that there is a comma after it to let the frontend know that
  there will be another page id after FIREWORKS_PAGE_ID. */

  LOGS_PAGE_ID
} from '../constants/links.js'

const LINKS = Object.freeze({
  'Login': {name: 'Login', key: LOGIN_PAGE_ID, href: '/login', 'admin': false},
  'Tag': {name: 'Tagging', key: TAGGING_PAGE_ID, href: '/tag', 'admin': false},
  'Merging': {name: 'Merging', key: MERGING_PAGE_ID, href: '/merge', 'admin': true},
  'ADLC': {name: 'ADLC', key: ADLC_PAGE_ID, href: '#', 'admin': true},
  'Settings': {name: 'Settings', key: SETTINGS_PAGE_ID, href: '/settings', 'admin': true},
  /* TODO: Add Link for Fireworks page. It shoulld be a very similar in format to the ones above. I would recommend setting
  the 'href' field to be '/fireworks'. Again, dont forget the comma after the link. */

  'Logs': {name: 'Logs', key: LOGS_PAGE_ID, href: '/logs', 'admin': true}
})


class Header extends Component {
  // try to pass in the current page as a prop so we can set its property to 'active'
  constructor(props) {
    super(props)
    this.props = props
    this.admin = true
  }

  render() {
    const linksToShow = _.filter(Object.keys(LINKS), key => !LINKS[key].admin || this.admin)
    return (
      <div>
        <nav>
          <div className="red nav-wrapper">
            <div className="brand-logo" style={{marginLeft:10}}>
              <a href="#"><img src={require('../img/cuair_logo.png')}/></a>
            </div>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {
                _.map(linksToShow, key => {
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
