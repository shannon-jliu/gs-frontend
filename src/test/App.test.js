import React from 'react'
import ReactDOM from 'react-dom'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import { Map } from 'immutable'

import * as matchers from 'jest-immutable-matchers'

import appOperations from '../operations/appOperations.js'

import { App } from '../App.js'

configure({ adapter: new Adapter() })
// Create mock store
const mockStore = configureMockStore()

describe('CameraSettings Component', () => {
  let wrapper, store, initialState

  beforeEach(() => {
    jest.addMatchers(matchers)

    const settings = {
      timestamp: -1,
      mode: 0
    }

    const mappedSettings = new Map(settings)
    initialState = mappedSettings

    const overMap = new Map({ settings: mappedSettings, pending: Map() })

    store = mockStore(overMap)
    wrapper = mount(<App store={store} updateCameraGimbal={appOperations.updateCameraGimbalSettingsLocal}/>)
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
  })
})

