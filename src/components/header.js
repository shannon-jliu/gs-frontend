import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import AuthUtil from '../util/authUtil'

import {
  LOGIN_PAGE_ID,
  LOGOUT_PAGE_ID,
  TAGGING_PAGE_ID,
  MERGING_PAGE_ID,
  SETTINGS_PAGE_ID,
  LOGS_PAGE_ID,
} from '../constants/links.js'

import { fromJS } from 'immutable'

const LINKS = Object.freeze({
  'Login': { name: 'Login', key: LOGIN_PAGE_ID, href: '/login', 'operator': false },
  'Logout': { name: 'Logout', key: LOGOUT_PAGE_ID, 'operator': false },
  'Tag': { name: 'Tagging', key: TAGGING_PAGE_ID, href: '/tag', 'operator': false },
  'Merging': { name: 'Merging', key: MERGING_PAGE_ID, href: '/merge', 'operator': true },
  'Settings': { name: 'Settings', key: SETTINGS_PAGE_ID, href: '/settings', 'operator': false },
  'Logs': { name: 'Logs', key: LOGS_PAGE_ID, href: '/logs', 'operator': false },
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
    const targets = Array.from(this.props.savedTargets)
    console.log(targets[0])
    const sightings = Array.from(this.props.sightings).map(ts => Object.fromEntries(ts))

    const isAdlc = (ts) => {
      return ts.creator.get('username') === 'adlc'
    }

    const getStats = (target) => {

      console.log('target', target)
      console.log('sighting', sightings[0])
      console.log('mdlc', sightings.filter(ts => ts.type !== 'adlc'))
      const mdlc_count = sightings.filter(ts => !isAdlc(ts) &&( ts.target && ts.target.get('id') === target.id)).length
      const adlc_count = sightings.filter(ts => isAdlc(ts)&& ( ts.target && ts.target.get('id') === target.id)).length
      return <div className='stat'>{"Target " + target.id + ": " + mdlc_count + ", " + adlc_count}</div>
    }

    return (
      <div>
        <nav>
          <div className="red nav-wrapper">
            <div className="brand-logo" style={{ marginLeft: 10 }}>
              <a href="/#"><img src={require('../img/cuair_logo.png')} alt='' /></a>
            </div>
            <div className="stats">
              {targets?.map(t => getStats(Object.fromEntries(t))) || "No Sightings"}
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

const mapStateToProps = (state) => ({
  selectedTsids: state.mergeReducer.get('selectedTsids'),
  sightings: state.targetSightingReducer.get('saved'),
  savedTargets: state.targetReducer.get('saved'),
})

export default connect(mapStateToProps, _)(Header)
