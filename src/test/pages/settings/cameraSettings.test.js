import React from 'react'
import ReactDOM from 'react-dom'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import { fromJS, Map } from 'immutable'

import * as matchers from 'jest-immutable-matchers'

import cameraOperations from '../../../operations/cameraOperations.js'

import { CameraSettings } from '../../../pages/settings/cameraSettings.js'

configure({ adapter: new Adapter() })
// Create mock store
const mockStore = configureMockStore()

describe('CameraSettings Component', () => {
  let wrapper, store, initialState

  beforeEach(() => {
    jest.addMatchers(matchers)

    const settings = {
      timestamp: -1,
      capturing: false,
      zoom: 0
    }

    const mappedSettings = fromJS(settings)
    initialState = mappedSettings

    const overMap = fromJS({ settings: mappedSettings, pending: Map() })

    store = mockStore(overMap)
    wrapper = mount(<CameraSettings settings={overMap} 
      store={store} updateSettingsStart={cameraOperations.updateSettingsStart}/>
    )
  })

  it('should the initial local state', () => {
    expect(wrapper.props().store.getState().get('settings')).toEqualImmutable(initialState)
  })

  describe('componentDidUpdate', () => {
    it('should not update the local state | old and new props should be the same', () => {
      const overMap = fromJS({ settings: initialState, pending: Map() })

      wrapper.setProps({ settings: overMap })

      expect(wrapper.instance().state.capturing).toEqual(wrapper.instance().props.settings.get('settings').get('capturing'))
      expect(wrapper.instance().state.zoom).toEqual(wrapper.instance().props.settings.get('settings').get('zoom'))
    })

    it('should update the local state | old and new props should not be the same', () => {
      initialState = initialState.set('capturing', true)
      initialState = initialState.set('zoom', 1)
      const overMap = fromJS({ settings: initialState, pending: Map() })
      store = mockStore(overMap)

      wrapper.setProps({ settings: overMap })

      expect(wrapper.instance().state.capturing).toEqual(wrapper.instance().props.settings.get('settings').get('capturing'))
      expect(wrapper.instance().state.zoom).toEqual(wrapper.instance().props.settings.get('settings').get('zoom'))
    })
  })

  describe('getSavedFields', () => {
    it('should return capturing and zoom from the initial local state', () => {
      expect(wrapper.instance().getSavedFields()).toEqual({
        capturing: false,
        zoom: 0
      })
    })
  })

  describe('getDisplayFields', () => {
    it('should return capturing and zoom from the initial local state | getSavedFields() and state are the same', () => {
      expect(wrapper.instance().getDisplayFields()).toEqual({
        capturing: false,
        zoom: 0
      })
    })
  })

  describe('getNewFields', () => {
    it('should return capturing and the integer version of zoom from the initial local state', () => {
      expect(wrapper.instance().getNewFields()).toEqual({
        capturing: false,
        zoom: Number.parseInt(0.9)
      })
    })
  })

  describe('canSave', () => {
    it('should return true/should be able to save the settings when the new fields and saved fields are different', () => {
      const newSettings = {
        timestamp: -1,
        capturing: false,
        zoom: 1
      }
  
      const newMappedSettings = fromJS(newSettings)
      const newOverMap = fromJS({ settings: newMappedSettings, pending: Map() })

      const store = mockStore(newOverMap)
      wrapper = mount(<CameraSettings settings={newOverMap} store={store}/>)
      expect(wrapper.instance().canSave()).toBe(true)
    })

    it('should return false/should not be able to save the settings when the new fields and saved fields are the same', () => {
      expect(wrapper.instance().canSave()).toBe(false)
    })
  })

  describe('save', () => {
    it('should set state.capturing to false and state.zoom to 0', () => {
      wrapper.instance().save()
      expect(wrapper.instance().state).toEqual({
        capturing: false,
        zoom: 0
      })
    })
  })

  describe('capturingChange', () => {
    it('should set return w/ the changed capturing property', () => {
      let val = true
      let newL = { capturing: false }
      expect(wrapper.instance().capturingChange(val, newL)).toEqual({
        capturing: true
      })
    })
  })

  describe('zoomChange', () => {
    it('should set return w/ the changed zoom property', () => {
      let newZoom = 'max_zoom'
      let newZoomValue = 1

      const target = { target: { value: newZoom, type: 'radio' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)

      let newL = wrapper.instance().state
      newL = wrapper.instance().zoomChange(changeReturn, newL)
      expect(newL.zoom).toEqual(newZoomValue)
    })
  })

  describe('updateSettingsOnInputChange', () => {
    it('should update the capturing and zoom properties based on input values', () => {
      let capturing = true
      let newZoom = 'max_zoom'
      let newZoomValue = 1

      const target = { target: { value: newZoom, type: 'radio' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)

      let newL = wrapper.instance().state
      newL = wrapper.instance().capturingChange(capturing, newL)
      newL = wrapper.instance().zoomChange(changeReturn, newL)
      expect(newL).toEqual({
        capturing: true, zoom: 1
      })
    })
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(wrapper, div)
  })
})
