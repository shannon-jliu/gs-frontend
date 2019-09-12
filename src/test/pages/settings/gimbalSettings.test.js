import React from 'react'
import ReactDOM from 'react-dom'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import { fromJS, Map } from 'immutable'

import * as matchers from 'jest-immutable-matchers'

import Modes from '../../../pages/settings/components/Modes.js'

import {
  receiveSettings,
  receiveAndUpdateSettings,
  updateSettingsStart,
  updateSettingsFailed
} from '../../../actions/gimbalSettingsActionCreator.js'

import { GimbalSettings } from '../../../pages/settings/gimbalSettings.js'
import { Settings } from '../../../pages/settings/settings.js'

configure({ adapter: new Adapter() })
// Create mock store
const mockStore = configureMockStore()

describe('GimbalSettings Component', () => {
  let wrapper, store, initialState

  beforeEach(() => {
    jest.addMatchers(matchers)

    const settings = fromJS({
      gps: {
        latitude: 0,
        longitude: 0
      },
      orientation: {
        roll: 0,
        pitch: 0
      }
    })

    const mappedSettings = fromJS(settings)
    initialState = mappedSettings

    const overMap = new fromJS({ settings: mappedSettings, pending: Map() })

    store = mockStore(overMap)
    wrapper = mount(<GimbalSettings settings={overMap}
      store={store}
      cameraGimbalMode={Modes.IDLE}
      receiveSettings={receiveSettings}
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

      expect(wrapper.instance().state.gps).toEqual(wrapper.instance().props.settings.get('settings').get('gps').toJS())
      expect(wrapper.instance().state.orientation).toEqual(wrapper.instance().props.settings.get('settings').get('orientation').toJS())
    })

    it('should update the local state | old and new props should not be the same', () => {
      initialState = initialState.set('mode', Modes.FIXED)
      const overMap = fromJS({ settings: initialState, pending: Map() })
      store = mockStore(overMap)

      wrapper.setProps({ settings: overMap })

      expect(wrapper.instance().state.gps).toEqual(wrapper.instance().props.settings.get('settings').get('gps').toJS())
      expect(wrapper.instance().state.orientation).toEqual(wrapper.instance().props.settings.get('settings').get('orientation').toJS()  )
    })
  })

  describe('getSavedFields', () => {
    it('should return the correct fields based on saved settings and initialState defined at the beginning of this test file', () => {
      expect(wrapper.instance().getSavedFields()).toEqual(
        { gps: {
          latitude: initialState.get('gps').get('latitude'),
          longitude: initialState.get('gps').get('longitude')
        },
        orientation: {
          roll: initialState.get('orientation').get('roll'),
          pitch: initialState.get('orientation').get('pitch')
        }
        }
      )
    })
  })

  describe('getDisplayFields', () => {
    it('should return the input value', () => {
      expect(wrapper.instance().getDisplayFields()).toEqual(
        { gps: {
          latitude: initialState.get('gps').get('latitude'),
          longitude: initialState.get('gps').get('longitude')
        },
        orientation: {
          roll: initialState.get('orientation').get('roll'),
          pitch: initialState.get('orientation').get('pitch')
        }
        }
      )
    })
  })

  describe('getNewFields', () => {
    it('should return the correct fields based on getDisplayFields()', () => {
      expect(wrapper.instance().getNewFields()).toEqual(
        { gps: {
          latitude: initialState.get('gps').get('latitude'),
          longitude: initialState.get('gps').get('longitude')
        },
        orientation: {
          roll: initialState.get('orientation').get('roll'),
          pitch: initialState.get('orientation').get('pitch')
        }
        }
      )
    })
  })

  describe('canSave', () => {
    it('should return true/should be able to save the settings', () => {
      initialState = initialState.set('gps', fromJS({ latitude: 1, longitude: 2}))
      const overMap = fromJS({ settings: initialState, pending: Map() })

      store = mockStore(overMap)
      wrapper = mount(<GimbalSettings settings={overMap} store={store}/>)

      expect(wrapper.instance().canSave()).toBe(true)
    })

    it('should return false/should not be able to save the settings because newFields and savedFields should be the same', () => {
      expect(wrapper.instance().canSave()).toBe(false)
    })

    it('should return false/should not be able to save the settings because mode == -1 (Modes.UNDEFINED)', () => {
      initialState = initialState.set('gps', fromJS({ latitude: 1, longitude: 2}))
      const overMap = fromJS({ settings: initialState, pending: Map() })

      store = mockStore(overMap)
      wrapper = mount(<GimbalSettings settings={overMap} store={store} cameraGimbalMode={Modes.UNDEFINED}/>)

      expect(wrapper.instance().canSave()).toBe(false)
    })
  })

  describe('save', () => {
    it('should update state based on state and getDisplayFields()', () => {
      wrapper.instance().save()
      expect(wrapper.instance().state).toEqual({
        gps: {
          latitude: 0,
          longitude: 0
        },
        orientation: {
          roll: 0,
          pitch: 0
        }
      })
    })
  })

  describe('updateSettingsOnInputChange', () => {
    it('should update properties properly | e.target.id == "Latitude"', () => {
      const target = { target: { value: '3.1', id: 'Latitude' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)
      wrapper.instance().updateSettingsOnInputChange(changeReturn)

      expect(wrapper.instance().state).toEqual({
        gps: {
          latitude: 3.1,
          longitude: 0
        },
        orientation: {
          roll: 0,
          pitch: 0
        }
      })
    })

    it('should update properties properly | e.target.id == "Longitude"', () => {
      const target = { target: { value: '3.1', id: 'Longitude' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)
      wrapper.instance().updateSettingsOnInputChange(changeReturn)

      expect(wrapper.instance().state).toEqual({
        gps: {
          latitude: 0,
          longitude: 3.1
        },
        orientation: {
          roll: 0,
          pitch: 0
        }
      })
    })

    it('should update properties properly | e.target.id == "Roll"', () => {
      const target = { target: { value: '3.1', id: 'Roll' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)
      wrapper.instance().updateSettingsOnInputChange(changeReturn)

      expect(wrapper.instance().state).toEqual({
        gps: {
          latitude: 0,
          longitude: 0
        },
        orientation: {
          roll: 3.1,
          pitch: 0
        }
      })
    })

    it('should update properties properly | e.target.id == "Pitch"', () => {
      const target = { target: { value: '3.1', id: 'Pitch' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)
      wrapper.instance().updateSettingsOnInputChange(changeReturn)

      expect(wrapper.instance().state).toEqual({
        gps: {
          latitude: 0,
          longitude: 0
        },
        orientation: {
          roll: 0,
          pitch: 3.1
        }
      })
    })

    it('should update properties properly | e.target.value is not a float', () => {
      const target = { target: { value: 'Hello there', id: 'Latitude' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)
      wrapper.instance().updateSettingsOnInputChange(changeReturn)

      expect(wrapper.instance().state).toEqual({
        gps: {
          latitude: '',
          longitude: 0
        },
        orientation: {
          roll: 0,
          pitch: 0
        }
      })
    })
  })

  describe('render', () => {
    it('should change the Gimbal Settings panel according to locally-set mode | mode == Modes.IDLE', () => {
      wrapper.setProps({cameraGimbalMode: Modes.IDLE})

      expect(wrapper.find('#gpsRow').prop('style')).toEqual({})
      expect(wrapper.find('#angleRow').prop('style')).toEqual({})
    })

    it('should change the Gimbal Settings panel according to locally-set mode | mode == Modes.FIXED', () => {
      wrapper.setProps({cameraGimbalMode: Modes.FIXED})

      expect(wrapper.find('#gpsRow').prop('style')).toEqual({})
      expect(wrapper.find('#angleRow').prop('style')).toEqual({display: 'none'})
    })

    it('should change the Gimbal Settings panel according to locally-set mode | mode == Modes.TRACKING', () => {
      wrapper.setProps({cameraGimbalMode: Modes.TRACKING})

      expect(wrapper.find('#gpsRow').prop('style')).toEqual({display: 'none'})
      expect(wrapper.find('#angleRow').prop('style')).toEqual({})
    })
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(wrapper, div)
  })
})
