import React, { Component } from 'react'
import { connect } from 'react-redux'

import AuthUtil from '../../util/authUtil.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

import './intsys.css'

export class Intsys extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render(e){
    return (
      <div></div>
    )
  }
}

const mapStateToProps = state => ({
  utilSettings: state.utilReducer
})

export default connect(mapStateToProps, null)(Intsys)
