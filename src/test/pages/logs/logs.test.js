import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import renderer from 'react-test-renderer'
import 'jest-localstorage-mock'

import Logs from '../../../pages/logs/logs.js'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Logs />, div)
})

describe('populateLogs', () => {
  const component = renderer.create(
    <Logs />,
  )
  var logs = component.getInstance()

  it('populates logs', () => {
    logs.populateLogs(['test log'])
    expect(logs.state.logs).toEqual(['test log'])
    expect(logs.state.elided).toEqual([true])
  })

  it('populates multiple logs', () => {
    logs.populateLogs(['test log', 'test log2', 'test log3'])
    expect(logs.state.logs).toEqual(['test log', 'test log2', 'test log3'])
    expect(logs.state.elided).toEqual([true, true, true])
  })
})

describe('listen', () => {
  it('will listen for new logs', () => {
    const component = renderer.create(
      <Logs />,
    )
    var logs = component.getInstance()
    logs.listen({data: 'test log'})
    expect(logs.state.logs).toEqual(['test log'])
    expect(logs.state.elided).toEqual([true])
  })

  it('will align elided array', () => {
    const component = renderer.create(
      <Logs />,
    )
    var logs = component.getInstance()
    logs.listen({data: 'test log'})
    logs.listen({data: 'test log2'})
    expect(logs.state.logs).toEqual(['test log', 'test log2'])
    expect(logs.state.elided).toEqual([true, true])
  })
})
