import React, { Component } from 'react'
import EventSource from 'eventsource'
import $ from 'jquery'

import {AUTH_TOKEN_ID} from '../../constants/constants.js'
import {GROUND_SERVER_URL} from '../../constants/links.js'
import './logs.css'

class Logs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logs: [],
      searchText: '',
      elided: []
    }
    this.listen = this.listen.bind(this)
    this.updateSearch = this.updateSearch.bind(this)
    this.populateLogs = this.populateLogs.bind(this)
  }

  // adds a new log whenever SSE pushes a new log, and automatically elides content
  listen(e) {
    let log = e.data
    let oldLogs = this.state.logs
    this.setState({
      logs: oldLogs.concat(log),
      elided: this.state.elided.concat(true)
    })
  }

  // open the eventsource to the ground server
  componentWillMount() {
    var eventSourceInitDict = {headers: {'X-AUTH-TOKEN': localStorage.getItem(AUTH_TOKEN_ID)}};
    var eventSource = new EventSource(GROUND_SERVER_URL + "/api/v1/livelogs", eventSourceInitDict)
    eventSource.addEventListener("message", this.listen, false)
  }

  // retrieve the most recent 100 logs on page load
  componentDidMount() {
    $.ajax({
      url: "/api/v1/logs",
      type: "GET",
      complete: response => {
        if (response.status !== 200) {
          this.setState({
            logs: ["No logs"]
          })
        } else {
          let responseArr = response.responseJSON
          this.populateLogs(responseArr)
        }
      }
    })
  }

  populateLogs(responseArr) {
    let elidedArr = new Array(responseArr.length)
    this.setState({
      logs: responseArr,
      elided: elidedArr.fill(true)
    })
  }

  // updates the filter
  updateSearch(s) {
    this.setState({
      searchText: s.target.value
    })
  }

  render() {
    // basic text-based search
    let filteredLogs = this.state.logs.filter(
      log =>
        log.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1
    )
    return (
      <div className="logs">
        <form className="col s12">
          <div className="row">
            <div className="input-field col s12">
              <input placeholder="Filter"
                     id="filter"
                     type="text"
                     className="validate"
                     value={this.state.searchText}
                     onChange={this.updateSearch}
              />
            </div>
          </div>
        </form>
        <div>
          <div>
            <ul className="collection">
            {filteredLogs.map((log, key) => (
              <li key={key} className="collection-item">
                <span className={this.state.elided[key] ? "log-clipped" : ""}>
                  <button
                    className="button-log"
                    onClick={() => {
                      var elided = this.state.elided
                      elided[key] = !elided[key]
                      this.setState({
                        elided: elided
                      })
                    }}
                  >
                    {" "}
                    {this.state.elided[key] ? "\u25BA" : "\u25BC"}{" "}
                  </button>
                  {" "}
                  {log} <br />
                </span>
              </li>
            ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Logs
