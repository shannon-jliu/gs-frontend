import React from 'react'
import ReactDOM from 'react-dom'
import { configure, mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import { fromJS, Map } from 'immutable'

import Modes from '../../../pages/settings/components/Modes.js'

import * as matchers from 'jest-immutable-matchers'

import {
  receiveSettings,
  receiveAndUpdateSettings,
  updateSettingsStart,
  updateSettingsFailed
} from '../../../actions/cameraGimbalActionCreator.js'

import { CameraGimbalSettings } from '../../../pages/settings/cameraGimbalSettings.js'
import { Settings } from '../../../pages/settings/settings.js'

configure({ adapter: new Adapter() })
// Create mock store
const mockStore = configureMockStore()

describe('CameraGimbalSettings Component', () => {
  let wrapper, store, initialState, settingsProps, settingsWrapper

  beforeEach(() => {
    jest.addMatchers(matchers)

    const settings = fromJS({
      mode: Modes.IDLE
    })

    const mappedSettings = fromJS(settings)
    initialState = mappedSettings

    const overMap = fromJS({ settings: mappedSettings, pending: Map() })

    settingsProps = {
      changeCameraGimbalMode: jest.fn((newCameraGimbalMode) => newCameraGimbalMode)
    }
    settingsWrapper = shallow(<Settings {...settingsProps} />)

    store = mockStore(overMap)
    wrapper = mount(<CameraGimbalSettings changeCameraGimbalMode={settingsWrapper.instance().changeCameraGimbalMode}
      settings={overMap} 
      store={store} receiveSettings={receiveSettings} 
      receiveAndUpdateSettings={receiveAndUpdateSettings} 
      updateSettingsStart={updateSettingsStart} 
      updateSettingsFailed={updateSettingsFailed}/>
    )
  })


  it('should return the initial state', () => {
    expect(wrapper.props().store.getState().get('settings')).toEqualImmutable(initialState)
  })

  describe('componentDidUpdate', () => {
    it('should not update the local state | old and new props should be the same', () => {
      const overMap = fromJS({ settings: initialState, pending: Map() })

      wrapper.setProps({ settings: overMap })

      expect(wrapper.instance().state.mode).toEqual(wrapper.instance().props.settings.get('settings').get('mode'))
    })

    it('should update the local state | old and new props should not be the same', () => {
      initialState = initialState.set('mode', 1)
      const overMap = fromJS({ settings: initialState, pending: Map() })
      store = mockStore(overMap)

      wrapper.setProps({ settings: overMap })

      expect(wrapper.instance().state.mode).toEqual(wrapper.instance().props.settings.get('settings').get('mode'))
    })
  })

  describe('getSavedFields', () => {
    it('should return the correct fields based on justSaved and mode | mode = 0 (Modes.IDLE)', () => {
      expect(wrapper.instance().getSavedFields()).toEqual(
        { mode: initialState.get('mode') }
      )
    })

    it('should return the correct fields based on justSaved and mode | mode = 1 (Modes.FIXED)', () => {
      initialState = initialState.set('mode', Modes.FIXED)
      const overMap = fromJS({ settings: initialState, pending: Map() })

      store = mockStore(overMap)
      wrapper = mount(<CameraGimbalSettings settings={overMap} store={store}/>)

      expect(wrapper.instance().getSavedFields()).toEqual(
        { mode: initialState.get('mode') }
      )
    })

    it('should return the correct fields based on justSaved and mode | mode = 2 (Modes.TRACKING)', () => {
      initialState = initialState.set('mode', Modes.TRACKING)
      const overMap = fromJS({ settings: initialState, pending: Map() })

      store = mockStore(overMap)
      wrapper = mount(<CameraGimbalSettings settings={overMap} store={store}/>)

      expect(wrapper.instance().getSavedFields()).toEqual(
        { mode: initialState.get('mode') }
      )
    })
  })

  describe('getDisplayFields', () => {
    it('should return the input value', () => {
      expect(wrapper.instance().getDisplayFields()).toEqual(
        { mode: initialState.get('mode') }
      )
    })
  })

  describe('getNewFields', () => {
    it('should return the correct fields based on getDisplayFields() | mode = 0 (Modes.IDLE)', () => {
      expect(wrapper.instance().getNewFields()).toEqual(
        { mode: initialState.get('mode') }
      ) 
    })
  })

  describe('canSave', () => {
    it('should return true/should be able to save the settings', () => {
      initialState = initialState.set('mode', Modes.FIXED)
      const overMap = fromJS({ settings: initialState, pending: Map() })

      store = mockStore(overMap)
      wrapper = mount(<CameraGimbalSettings settings={overMap} store={store}/>)

      expect(wrapper.instance().canSave()).toBe(true)
    })
  })

  describe('save', () => {
    it('should update state based on state and getDisplayFields()', () => {
      wrapper.instance().save()
      expect(wrapper.instance().state).toEqual({ mode: Modes.IDLE })
    })
  })

  describe('modeChange', () => {
    it('should set state.mode to 0 (Modes.IDLE)', () => {
      let newMode = 'retract'

      const target = { target: { value: newMode, type: 'radio' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)

      let newL = wrapper.instance().state
      newL = wrapper.instance().modeChange(changeReturn, newL)
      expect(newL.mode).toEqual(Modes.IDLE)
    })

    it('should set state.mode to 1 (Modes.FIXED)', () => {
      let newMode = 'fixed'

      const target = { target: { value: newMode, type: 'radio' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)

      let newL = wrapper.instance().state
      newL = wrapper.instance().modeChange(changeReturn, newL)
      expect(newL.mode).toEqual(Modes.FIXED)
    })

    it('should set state.mode to 2 (Modes.TRACKING)', () => {
      let newMode = 'tracking'

      const target = { target: { value: newMode, type: 'radio' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)

      let newL = wrapper.instance().state
      newL = wrapper.instance().modeChange(changeReturn, newL)
      expect(newL.mode).toEqual(Modes.TRACKING)
    })
  })

  describe('updateSettingsOnInputChange', () => {
    it('should update state properly', () => {
      let newL = wrapper.instance().state

      let newMode = 'fixed'
      const target = { target: { value: newMode, type: 'radio' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)
      newL = wrapper.instance().modeChange(changeReturn, newL)
      wrapper.instance().state = newL
      expect(wrapper.instance().state).toEqual(newL)
      expect(wrapper.instance().state).toEqual({
        mode: Modes.FIXED
      })
    })
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(wrapper, div)
  })
})
