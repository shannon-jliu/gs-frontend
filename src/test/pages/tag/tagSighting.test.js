import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { fromJS, toJS } from 'immutable'
import _ from 'lodash'
import { TagSighting } from '../../../pages/tag/tagSighting'

Enzyme.configure({ adapter: new Adapter() })

const sighting = fromJS({
  height: 1405,
  localId: '979.6291390728477:526.5298013245033:702.620099040495:0.0006300101418243997',
  pixelX: 980,
  pixelY: 527,
  radiansFromTop: 2.5051419954498755,
  width: 1405,
})

const savedSighting = fromJS({
  height: 1405,
  id: 50,
  pixelX: 980,
  pixelY: 527,
  radiansFromTop: 2.5051419954498755,
  width: 1405,
  shape: 'cross',
  shapeColor: 'yellow',
  alpha: 'C',
  alphaColor: 'white',
  offaxis: false,
  mdlcClassConf: 'low',
  description: 'asdf'
})

const pendingSighting = fromJS({
  height: 1405,
  pixelX: 980,
  pixelY: 527,
  radiansFromTop: 2.5051419954498755,
  width: 1405,
  pending: {}
})

describe('Base tests with no pending field', () => {
  let props, wrapper, instance
  beforeEach(() => {
    props = {
      sighting: sighting,
      isTracking: true,
      imageUrl: '../../../img/cuair_default.png',
      cameraTilt: true
    }
    wrapper = shallow(<TagSighting {...props} />)
    instance = wrapper.instance()
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('hides div if image is saved', () => {
    instance.setState({saved: true})
    expect(wrapper.find('div').first().hasClass('hidden')).toBe(true)
  })

  it('renders the image', () => {
    const imageSighting = wrapper.find('ImageSighting').first()
    expect(imageSighting).toBeDefined()
  })

  it('renders typeselect if no id', () => {
    const typeSelect = wrapper.find('div').at(1)
    expect(typeSelect.hasClass('hidden')).toBe(false)
  })

  it('renders only alphanum when alphanum selected', () => {
    const typeSelect = wrapper.find('TypeSelect').first()
    typeSelect.simulate('change', { target: { value: 'alphanum'} })
    expect(wrapper.find('div').at(2).hasClass('row')).toBe(true)
    expect(wrapper.find('div').at(3).hasClass('hidden')).toBe(true)
  })

  it('renders only emergent when emergent selected', () => {
    const typeSelect = wrapper.find('TypeSelect').first()
    typeSelect.simulate('change', { target: { value: 'emergent'} })
    expect(wrapper.find('div').at(2).hasClass('hidden')).toBe(true)
    expect(wrapper.find('div').at(3).hasClass('row')).toBe(true)
  })

  it('renders conf when a type is selected', () => {
    // set no type, so should be hidden
    instance.setState({type: ''})
    expect(wrapper.find('div').at(4).hasClass('hidden')).toBe(true)

    const typeSelect = wrapper.find('TypeSelect').first()
    typeSelect.simulate('change', { target: { value: 'alphanum'} })
    expect(wrapper.find('div').at(4).hasClass('row')).toBe(true)

    typeSelect.simulate('change', { target: { value: 'emergent'} })
    expect(wrapper.find('div').at(4).hasClass('row')).toBe(true)
  })

  it('renders button when a type is selected', () => {
    // set no type, so should be hidden
    instance.setState({type: ''})
    expect(wrapper.find('div').at(5).hasClass('hidden')).toBe(true)

    const typeSelect = wrapper.find('TypeSelect').first()
    typeSelect.simulate('change', { target: { value: 'alphanum'} })
    expect(wrapper.find('div').at(5).hasClass('row')).toBe(true)

    typeSelect.simulate('change', { target: { value: 'emergent'} })
    expect(wrapper.find('div').at(5).hasClass('row')).toBe(true)
  })

  describe('canSave', () => {
    it('will properly return true if saveable as alphanum', () => {
      instance.setState({
        type: 'alphanum',
        shape: 'square',
        shapeColor: 'black',
        alpha: 'A',
        alphaColor: 'white',
        mdlcClassConf: 'high'
      })
      expect(instance.canSave()).toBe(true)
    })

    it('will properly return false if not saveable as alphanum', () => {
      instance.setState({
        type: 'alphanum',
        shape: 'square',
        shapeColor: 'black',
        alpha: 'A',
        alphaColor: '',
        mdlcClassConf: 'high'
      })
      expect(instance.canSave()).toBe(false)
    })

    it('will properly return true if saveable as emergent', () => {
      instance.setState({
        type: 'emergent',
        description: 'test',
        mdlcClassConf: 'Low'
      })
      expect(instance.canSave()).toBe(true)
    })

    it('will properly return false if not saveable as emergent', () => {
      instance.setState({
        type: 'emergent',
        description: 'test',
        mdlcClassConf: ''
      })
      expect(instance.canSave()).toBe(false)
    })
  })

  describe('getHandler', () => {
    it('will properly update upon checkbox', () => {
      instance.getHandler('offaxis')({
        target: {
          type:'checkbox',
          checked: true
        }
      })
      expect(instance.state.offaxis).toBe(true)
    })

    it('will properly update type', () => {
      instance.getHandler('type')({
        target: {
          type:'idk',
          value: 'alphanum'
        }
      })
      expect(instance.state.type).toEqual('alphanum')
    })

    it('will properly update on alphanum', () => {
      instance.getHandler('alphaColor')({
        target: {
          type:'idk',
          value: 'white'
        }
      })
      expect(instance.state.alphaColor).toEqual('white')
    })

    it('will properly update on alphanum and restrict it to one char', () => {
      instance.getHandler('alpha')({
        target: {
          type:'idk',
          value: 'fdsafdsa'
        }
      })
      expect(instance.state.alpha).toEqual('F')
    })

    it('will properly update on description', () => {
      instance.getHandler('description')({
        target: {
          type:'idk',
          value: 'asdfasdf'
        }
      })
      expect(instance.state.description).toEqual('asdfasdf')
    })
  })
})

const saveTargetSighting = jest.fn()
const updateTargetSighting = jest.fn()
const deleteSavedTargetSighting = jest.fn()
const deleteUnsavedTargetSighting = jest.fn()
describe.each([
  ['saved', savedSighting, updateTargetSighting, deleteSavedTargetSighting],
  ['unsaved', sighting, saveTargetSighting, deleteUnsavedTargetSighting]])('function tests with %s ts', (name, sightingToUse, saveFunc, deleteFunc) => {
  let props, wrapper, instance
  beforeEach(() => {
    props = {
      sighting: sightingToUse,
      imageUrl: '../../../img/cuair_default.png',
      isTracking: true,
      cameraTilt: true,
      saveTargetSighting: saveTargetSighting,
      updateTargetSighting: updateTargetSighting,
      deleteSavedTargetSighting: deleteSavedTargetSighting,
      deleteUnsavedTargetSighting: deleteUnsavedTargetSighting,
      saveROISighting: jest.fn(),
      deleteSavedROISighting: jest.fn()
    }
    wrapper = shallow(<TagSighting {...props} />)
    instance = wrapper.instance()
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  // these methods also implicitly test findDifference
  it('saves alphanum correctly', () => {
    const ts = {
      type: 'alphanum',
      shape: 'square',
      shapeColor: 'black',
      alpha: 'C',
      alphaColor: 'black',
      offaxis: false,
      mdlcClassConf: 'HIGH'
    }
    instance.canSave = jest.fn(() => true)
    instance.setState(ts)
    instance.save()
    const newSighting = sightingToUse.merge(ts)
    if (saveFunc == updateTargetSighting) {
      const diff = fromJS({
        'shape': 'square',
        'shapeColor': 'black',
        'alphaColor': 'black',
        'mdlcClassConf': 'HIGH'
      })
      expect(saveFunc).toHaveBeenCalledWith(sightingToUse, diff)
    } else expect(saveFunc).toHaveBeenCalledWith(newSighting)
  })

  it('saves emergent correctly', () => {
    const ts = {
      type: 'emergent',
      description: 'i miss u ram',
      mdlcClassConf: 'HIGH'
    }
    instance.canSave = jest.fn(() => true)
    instance.setState(ts)
    instance.save()
    const newSighting = sightingToUse.merge(ts)
    if (saveFunc == updateTargetSighting) {
      const diff = fromJS({ description: 'i miss u ram', mdlcClassConf: 'HIGH' })
      expect(saveFunc).toHaveBeenCalledWith(sightingToUse, diff)
    } else expect(saveFunc).toHaveBeenCalledWith(newSighting)
  })

  it('deletes correctly', () => {
    instance.deleteSighting()
    expect(deleteFunc).toHaveBeenCalledWith(sightingToUse)
  })
})

describe('ROI tests', () => {
  const saveROISighting = jest.fn()
  const deleteSavedROISighting = jest.fn()
  const deleteUnsavedTargetSightingROI = jest.fn()
  let wrapper, instance
  beforeEach(() => {
    let props = {
      sighting: sighting,
      imageUrl: '../../../img/cuair_default.png',
      isTracking: false,
      cameraTilt: true,
      deleteUnsavedTargetSighting: deleteUnsavedTargetSightingROI,
      saveROISighting: saveROISighting,
      deleteSavedROISighting: deleteSavedROISighting
    }
    wrapper = shallow(<TagSighting {...props} />)
    instance = wrapper.instance()
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('saves properly', () => {
    instance.save()
    expect(saveROISighting).toHaveBeenCalledTimes(1)
  })

  it('cannot save after saved once', () => {
    wrapper.setProps({sighting: sighting.set('type', 'roi').set('id', 1)})
    expect(instance.canSave()).toBe(false)
  })

  it('deletes when not saved', () => {
    instance.deleteSighting()
    expect(deleteUnsavedTargetSightingROI).toHaveBeenCalledTimes(1)
  })

  it('deletes saved ROI', () => {
    wrapper.setProps({sighting: sighting.set('id', 1)})
    instance.deleteSighting()
    expect(deleteSavedROISighting).toHaveBeenCalledTimes(1)
  })
})

describe('pending ts tests', () => {
  let props, wrapper, instance
  beforeEach(() => {
    props = {
      sighting: pendingSighting,
      imageUrl: '../../../img/cuair_default.png',
      cameraTilt: true,
      isTracking: true,
      updateTargetSighting: jest.fn(),
      saveTargetSighting: jest.fn(),
      deleteSavedTargetSighting: jest.fn(),
      deleteUnsavedTargetSighting: jest.fn(),
      saveROISighting: jest.fn(),
    }
    wrapper = shallow(<TagSighting {...props} />)
    instance = wrapper.instance()
  })

  it('will properly return false on actionable', () => {
    expect(instance.actionable()).toBe(false)
  })

  it('will properly return false on canSave', () => {
    expect(instance.canSave()).toBe(false)
  })

  it('will properly return if not saveable', () => {
    instance.save()
    expect(props.updateTargetSighting).toHaveBeenCalledTimes(0)
    expect(props.saveTargetSighting).toHaveBeenCalledTimes(0)
  })

  it('will properly return deletable', () => {
    instance.save()
    expect(props.deleteSavedTargetSighting).toHaveBeenCalledTimes(0)
    expect(props.deleteUnsavedTargetSighting).toHaveBeenCalledTimes(0)
  })
})
