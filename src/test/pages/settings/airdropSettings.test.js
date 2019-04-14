import React from 'react'
import ReactDOM from 'react-dom'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import { fromJS, Map } from 'immutable'

import * as matchers from 'jest-immutable-matchers'

import airdropOperations from '../../../operations/airdropOperations.js'

import { AirdropSettings } from '../../../pages/settings/airdropSettings.js'

configure({ adapter: new Adapter() })
// Create mock store
const mockStore = configureMockStore()

describe('AirdropSettings Component', () => {
  let wrapper, store, initialState

  beforeEach(() => {
    jest.addMatchers(matchers)

    const settings = fromJS({
      timestamp: -1,
      isArmed: false,
      commandDropNow: false,
      gpsTargetLocation: {
        latitude: 0,
        longitude: 0
      },
      acceptableThresholdFt: 0
    })

    initialState = settings

    const overMap = fromJS({ settings: settings, pending: Map() })

    store = mockStore(overMap)
    wrapper = mount(<AirdropSettings settings={overMap} 
      store={store} updateSettingsStart={airdropOperations.updateSettingsStart}/>
    )
  })

  it('should the initial local state', () => {
    expect(wrapper.props().store.getState().get('settings')).toEqualImmutable(initialState)
  })

  describe('componentDidUpdate', () => {
    it('should not update the local state | old and new props should be the same', () => {
      const overMap = fromJS({ settings: initialState, pending: Map() })

      wrapper.setProps({ settings: overMap })

      const wrapperInstance = wrapper.instance()

      expect(wrapperInstance.state.isArmed).toEqualImmutable(wrapper.instance().props.settings.get('settings').get('isArmed'))
      expect(wrapperInstance.state.commandDropNow).toEqualImmutable(wrapper.instance().props.settings.get('settings').get('commandDropNow'))
      expect(wrapperInstance.state.gpsTargetLocation.latitude).toEqualImmutable(wrapper.instance().props.settings.get('settings').get('gpsTargetLocation').get('latitude'))
      expect(wrapperInstance.state.gpsTargetLocation.longitude).toEqualImmutable(wrapper.instance().props.settings.get('settings').get('gpsTargetLocation').get('longitude'))
      expect(wrapperInstance.state.acceptableThresholdFt).toEqualImmutable(wrapper.instance().props.settings.get('settings').get('acceptableThresholdFt'))
    })

    it('should update the local state | old and new props should not be the same', () => {
      initialState = fromJS({
        timestamp: -1,
        isArmed: true,
        commandDropNow: true,
        gpsTargetLocation: {
          latitude: 1,
          longitude: 1
        },
        acceptableThresholdFt: 1
      })
      const overMap = fromJS({ settings: initialState, pending: Map() })
      store = mockStore(overMap)

      wrapper.setProps({ settings: overMap })

      const wrapperInstance = wrapper.instance()

      expect(wrapperInstance.state.isArmed).toEqualImmutable(wrapper.instance().props.settings.get('settings').get('isArmed'))
      expect(wrapperInstance.state.commandDropNow).toEqualImmutable(wrapper.instance().props.settings.get('settings').get('commandDropNow'))
      expect(wrapperInstance.state.gpsTargetLocation.latitude).toEqualImmutable(wrapper.instance().props.settings.get('settings').get('gpsTargetLocation').get('latitude'))
      expect(wrapperInstance.state.gpsTargetLocation.longitude).toEqualImmutable(wrapper.instance().props.settings.get('settings').get('gpsTargetLocation').get('longitude'))
      expect(wrapperInstance.state.acceptableThresholdFt).toEqualImmutable(wrapper.instance().props.settings.get('settings').get('acceptableThresholdFt'))
    })
  })

  describe('getSavedFields', () => {
    it('should return capturing and zoom from the initial state', () => {
      const expected = {
        isArmed: false,
        commandDropNow: false,
        gpsTargetLocation: {
          latitude: 0,
          longitude: 0
        },
        acceptableThresholdFt: 0
      }
      expect(wrapper.instance().getSavedFields()).toEqual(expected)
    })
  })

  describe('getDisplayFields', () => {
    it('should return the local property of the initial local state | getSavedFields() and state are the same', () => {
      const expected = {
        isArmed: false,
        commandDropNow: false,
        gpsTargetLocation: {
          latitude: 0,
          longitude: 0
        },
        acceptableThresholdFt: 0
      }
      expect(wrapper.instance().getDisplayFields()).toEqual(expected)
    })
  })

  describe('getNewFields', () => {
    it('should return newly entered settings from the frontend', () => {
      const settings = fromJS({
        isArmed: false,
        commandDropNow: false,
        gpsTargetLocation: {
          latitude: '0',
          longitude: '0'
        },
        acceptableThresholdFt: '0'
      })

      initialState = settings
      const overMap = fromJS({ settings: initialState, pending: Map() })
      store = mockStore(overMap)
      wrapper = mount(<AirdropSettings settings={overMap} store={store}/>)

      const expected = {
        isArmed: false,
        commandDropNow: false,
        gpsTargetLocation: {
          latitude: 0,
          longitude: 0
        },
        acceptableThresholdFt: 0
      }

      expect(wrapper.instance().getNewFields()).toEqual(expected)
    })

    it('should return capturing and the integer version of integers latitude, longitude, and acceptableThresholdFt', () => {
      const expected = {
        isArmed: false,
        commandDropNow: false,
        gpsTargetLocation: {
          latitude: 0,
          longitude: 0
        },
        acceptableThresholdFt: 0
      }
      expect(wrapper.instance().getNewFields()).toEqual(expected)
    })
  })

  describe('canSave', () => {
    it('should return true/should be able to save the settings when the new fields and saved fields are different', () => {
      initialState = initialState.set('acceptableThresholdFt', 1)
      const overMap = fromJS({ settings: initialState, pending: Map() })
        
      store = mockStore(overMap)
      wrapper = mount(<AirdropSettings settings={overMap} store={store}/>)

      expect(wrapper.instance().canSave()).toBe(true)
    })

    it('should return false/should not be able to save the settings when the new fields and saved fields are the same', () => {
      expect(wrapper.instance().canSave()).toBe(false)
    })
  })

  describe('save', () => {
    it('should set state.gpsTargetLocation.latitude, state.gpsTargetLocation.longitude, and state.acceptableThresholdFt to 0', () => {
      wrapper.instance().save()
      const expected = {
        isArmed: false,
        commandDropNow: false,
        gpsTargetLocation: {
          latitude: 0,
          longitude: 0
        },
        acceptableThresholdFt: 0
      }
      expect(wrapper.instance().state).toEqual(expected)
    })
  })

  describe('drop', () => {
    it('should update the settings on the server | this.state.armed == true', () => {
      const initAirdropState = {
        isArmed: false,
        commandDropNow: false,
        gpsTargetLocation: {
          latitude: 0,
          longitude: 0
        },
        acceptableThresholdFt: 0
      }

      airdropOperations.updateSettingsStart = jest.fn()
      wrapper.setProps({ updateSettingsStart: airdropOperations.updateSettingsStart })

      initialState = initialState.set('isArmed', true)
      initialState = initialState.set('commandDropNow', true)
      initialState = initialState.setIn(['gpsTargetLocation', 'latitude'], 1)
      initialState = initialState.setIn(['gpsTargetLocation', 'longitude'], 1)
      initialState = initialState.set('acceptableThresholdFt', 1)
      const overMap = fromJS({ settings: initialState, pending: Map() })
      store = mockStore(overMap)
      
      wrapper.setProps({ settings: overMap })
      wrapper.instance().drop()

      const expected = initialState.delete('timestamp').toJS()

      expect(airdropOperations.updateSettingsStart).toHaveBeenCalledTimes(1)
      expect(wrapper.instance().state).toEqual(expected)
    })

    it('should update the settings on the server | this.props.settings.get("settings").get("isArmed")) && !this.props.settings.get("settings").get("pending")', () => {
      airdropOperations.updateSettingsStart = jest.fn()
      wrapper.setProps({ updateSettingsStart: airdropOperations.updateSettingsStart })

      initialState = initialState.set('isArmed', true)
      const overMap = fromJS({ settings: initialState, pending: Map() })
      store = mockStore(overMap)

      wrapper.setProps({ settings: overMap })
      wrapper.instance().drop()

      const expected = initialState.delete('timestamp').toJS()

      expect(airdropOperations.updateSettingsStart).toHaveBeenCalledTimes(1)
      expect(wrapper.instance().state).toEqual(expected)
    })
  })

  describe('updateSettingsOnInputChange', () => {
    it('should update the settings based on input values', () => {
      wrapper.instance().latitudeInput.value = 1
      wrapper.instance().longitudeInput.value = 2
      wrapper.instance().thresholdInput.value = 3
      wrapper.instance().isArmedInput.checked = true
      wrapper.instance().updateSettingsOnInputChange()
      const expected = {
        isArmed: true,
        commandDropNow: false,
        gpsTargetLocation: {
          latitude: '1',
          longitude: '2'
        },
        acceptableThresholdFt: '3'
      }
      expect(wrapper.instance().state).toEqual(expected)
    })

    it('should update the settings based on input values | latitudeInput is invalid', () => {
      wrapper.instance().latitudeInput.value = '$'
      wrapper.instance().longitudeInput.value = 2
      wrapper.instance().thresholdInput.value = 3
      wrapper.instance().isArmedInput.checked = true
      wrapper.instance().updateSettingsOnInputChange()
      const expected = {
        isArmed: true,
        commandDropNow: false,
        gpsTargetLocation: {
          latitude: 0,
          longitude: '2'
        },
        acceptableThresholdFt: '3'
      }
      expect(wrapper.instance().state).toEqual(expected)
    })

    it('should update the settings based on input values | longitudeInput is invalid', () => {
      wrapper.instance().latitudeInput.value = 1
      wrapper.instance().longitudeInput.value = '$'
      wrapper.instance().thresholdInput.value = 3
      wrapper.instance().isArmedInput.checked = true
      wrapper.instance().updateSettingsOnInputChange()
      const expected = {
        isArmed: true,
        commandDropNow: false,
        gpsTargetLocation: {
          latitude: '1',
          longitude: 0
        },
        acceptableThresholdFt: '3'
      }
      expect(wrapper.instance().state).toEqual(expected)
    })

    it('should update the settings based on input values | thresholdInput is invalid', () => {
      wrapper.instance().latitudeInput.value = 1
      wrapper.instance().longitudeInput.value = 2
      wrapper.instance().thresholdInput.value = '$'
      wrapper.instance().isArmedInput.checked = true
      wrapper.instance().updateSettingsOnInputChange()
      const expected = {
        isArmed: true,
        commandDropNow: false,
        gpsTargetLocation: {
          latitude: '1',
          longitude: '2'
        },
        acceptableThresholdFt: 0
      }
      expect(wrapper.instance().state).toEqual(expected)
    })
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(wrapper, div)
  })
})
