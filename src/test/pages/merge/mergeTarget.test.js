import React from 'react'
import renderer from 'react-test-renderer'
import { fromJS } from 'immutable'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { MergeTarget } from '../../../pages/merge/mergeTarget.js'

Enzyme.configure({ adapter: new Adapter() })

describe('MergeTarget', () => {
  const props = {
    target: fromJS({
      id: 3,
      type: 'alphanum',
      shapeColor: 'blue',
      shape: 'circle',
      alphaColor: 'orange',
      alpha: 'Q',
      thumbnailTSId: 11,
      offaxis: false,
      geotag:{
        gpsLocation: {
          latitude: '42.447833',
          longitude: '-76.612096'
        }
      }
    }),
    sightings: fromJS([
      {
        id: 11,
        type: 'alphanum',
        shapeColor: 'blue',
        shape: 'circle',
        alphaColor: 'orange',
        alpha: 'Q',
        mdlcClassConf: 'HIGH',
        offaxis: false,
        pixelX: 980,
        pixelY: 527,
        radiansFromTop: 2.5051419954498755,
        width: 20,
        assignment: {
          image: {
            imageUrl: '../../../../img/cuair_default.png'
          }
        }
      },
      {
        id: 12,
        type: 'alphanum',
        shapeColor: 'blue',
        shape: 'circle',
        alphaColor: 'orange',
        alpha: 'Q',
        mdlcClassConf: 'LOW',
        offaxis: false,
        pixelX: 34,
        pixelY: 183,
        radiansFromTop: 1.02343842934829032,
        width: 17,
        assignment: {
          image: {
            imageUrl: 'nonexistent.png'
          }
        }
      }
    ]),
    onTsDragStart: () => false,
    onTsDragEnd: () => false,
    onTsDrop: () => false
  }
  const eProps = {
    target: fromJS({
      id: 3,
      type: 'emergent',
      description: 'a german shepherd on stilts',
      thumbnailTSId: 11,
      geotag: {
        gpsLocation: {
          latitude: '42.447833',
          longitude: '-76.612096'
        }
      }
    }),
    sightings: fromJS([
      {
        id: 11,
        type: 'emergent',
        shapeColor: 'a dog on stilts',
        mdlcClassConf: 'HIGH',
        pixelX: 980,
        pixelY: 527,
        radiansFromTop: 2.5051419954498755,
        width: 20,
        assignment: {
          image: {
            imageUrl: '../../../../img/cuair_default.png'
          }
        }
      },
      {
        id: 12,
        type: 'emergent',
        shapeColor: 'circus canine',
        mdlcClassConf: 'LOW',
        pixelX: 34,
        pixelY: 183,
        radiansFromTop: 1.02343842934829032,
        width: 17,
        assignment: {
          image: {
            imageUrl: 'nonexistent.png'
          }
        }
      }
    ]),
    onTsDragStart: () => false,
    onTsDragEnd: () => false,
    onTsDrop: () => false
  }

  let wrapper

  describe('constructor', () => {
    it('renders correctly', () => {
      wrapper = shallow(<MergeTarget {...props} />)
      expect(wrapper).toBeDefined()
    })

    it('constructs correctly without pending', () => {
      wrapper = shallow(<MergeTarget {...props} />)

      const expectedState = {
        shape: props.target.get('shape'),
        shapeColor: props.target.get('shapeColor'),
        alpha: props.target.get('alpha'),
        alphaColor: props.target.get('alphaColor'),
        thumbnailTSId: props.target.get('thumbnailTSId'),
        description: '',
        longitude: props.target.getIn(['geotag', 'gpsLocation', 'longitude']),
        latitude: props.target.getIn(['geotag', 'gpsLocation', 'latitude']),
        isTsHovering: false,
        iwidth: -1,
        iheight: -1
      }
      expect(wrapper.instance().state).toEqual(expectedState)
    })

    it('constructs correctly with pending', () => {
      const newProps = {
        target: props.target.set('pending', {shape: 'square', alpha: 'd'}),
        sightings: props.sightings,
        onTsDragStart: props.onTsDragStart,
        onTsDragEnd: props.onTsDragEnd,
        onTsDrop: props.onTsDrop
      }
      wrapper = shallow(<MergeTarget {...newProps} />)

      const expectedState = {
        shape: 'square',
        shapeColor: props.target.get('shapeColor'),
        alpha: 'd',
        alphaColor: props.target.get('alphaColor'),
        thumbnailTSId: props.target.get('thumbnailTSId'),
        description: '',
        longitude: props.target.getIn(['geotag', 'gpsLocation', 'longitude']),
        latitude: props.target.getIn(['geotag', 'gpsLocation', 'latitude']),
        isTsHovering: false,
        iwidth: -1,
        iheight: -1
      }
      expect(wrapper.instance().state).toEqual(expectedState)
    })
  })

  describe('componentWillReceiveProps', () => {
    it('has correct componentWillReceiveProps', () => {
      wrapper = shallow(<MergeTarget {...props} />)
      wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})
      wrapper.instance().getHandler('latitude')({target: {value: '41.432432'}})
      wrapper.instance().getHandler('shape')({target: {value: 'trapezoid'}})
      wrapper.instance().getHandler('shape')({target: {value: props.target.get('shape')}})

      const newProps = {
        target: props.target.merge({alphaColor: 'green', shapeColor: 'yellow', shape: 'square', thumbnailTSId: 12}),
        sightings: props.sightings,
        onTsDragStart: props.onTsDragStart,
        onTsDragEnd: props.onTsDragEnd,
        onTsDrop: props.onTsDrop
      }
      wrapper.instance().componentWillReceiveProps(newProps)

      const expectedState = {
        shape: 'square',
        shapeColor: 'yellow',
        alpha: props.target.get('alpha'),
        alphaColor: 'red',
        thumbnailTSId: 12,
        description: '',
        longitude: props.target.getIn(['geotag', 'gpsLocation', 'longitude']),
        latitude: '41.432432',
        isTsHovering: false,
        iwidth: -1,
        iheight: -1
      }
      expect(wrapper.instance().state).toEqual(expectedState)
    })
  })

  describe('canDelete', () => {
    it('cannot delete when updating', () => {
      const newProps = {
        target: props.target.set('pending', {shape: 'square', alpha: 'd'}),
        sightings: props.sightings,
        onTsDragStart: props.onTsDragStart,
        onTsDragEnd: props.onTsDragEnd,
        onTsDrop: props.onTsDrop
      }
      wrapper = shallow(<MergeTarget {...newProps} />)

      expect(wrapper.instance().canDelete()).toEqual(false)
    })

    it('can delete when not updating', () => {
      wrapper = shallow(<MergeTarget {...props} />)

      expect(wrapper.instance().canDelete()).toEqual(true)
    })
  })

  describe('canSave', () => {
    it('can save when alpha field changes', () => {
      wrapper = shallow(<MergeTarget {...props} />)
      wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})

      expect(wrapper.instance().canSave()).toEqual(true)
    })

    it('cannot save when updating', () => {
      const newProps = {
        target: props.target.set('pending', {shape: 'square', alpha: 'd'}),
        sightings: props.sightings,
        onTsDragStart: props.onTsDragStart,
        onTsDragEnd: props.onTsDragEnd,
        onTsDrop: props.onTsDrop
      }
      wrapper = shallow(<MergeTarget {...newProps} />)
      wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})

      expect(wrapper.instance().canSave()).toEqual(false)
    })

    it('cannot save with empty alpha field', () => {
      wrapper = shallow(<MergeTarget {...props} />)
      wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})
      wrapper.instance().getHandler('shape')({target: {value: ''}})

      expect(wrapper.instance().canSave()).toEqual(false)
    })

    it('can save when description changes', () => {
      wrapper = shallow(<MergeTarget {...eProps} />)
      wrapper.instance().getHandler('description')({target: {value: 'a cat in a trapeze'}})

      expect(wrapper.instance().canSave()).toEqual(true)
    })

    it('cannot save with empty description', () => {
      wrapper = shallow(<MergeTarget {...eProps} />)
      wrapper.instance().selectThumb(12)
      wrapper.instance().getHandler('description')({target: {value: ''}})

      expect(wrapper.instance().canSave()).toEqual(false)
    })

    it('can save when thumbnail changes', () => {
      wrapper = shallow(<MergeTarget {...props} />)
      wrapper.instance().selectThumb(12)

      expect(wrapper.instance().canSave()).toEqual(true)
    })

    describe('geotag', () => {
      it('does save because geotag is changed', () => {
        wrapper = shallow(<MergeTarget {...props} />)
        wrapper.instance().getHandler('longitude')({target: {value: '121.0432'}})

        expect(wrapper.instance().canSave()).toEqual(true)
      })

      it('can save when geotag is empty', () => {
        wrapper = shallow(<MergeTarget {...props} />)
        wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})
        wrapper.instance().getHandler('latitude')({target: {value: ''}})
        wrapper.instance().getHandler('longitude')({target: {value: ''}})

        expect(wrapper.instance().canSave()).toEqual(true)
      })

      it('does not save because geotag is empty', () => {
        wrapper = shallow(<MergeTarget {...props} />)
        wrapper.instance().getHandler('latitude')({target: {value: ''}})
        wrapper.instance().getHandler('longitude')({target: {value: ''}})

        expect(wrapper.instance().canSave()).toEqual(false)
      })

      it('cannot save when longitude is NaN', () => {
        wrapper = shallow(<MergeTarget {...props} />)
        wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})
        wrapper.instance().getHandler('longitude')({target: {value: 'blah'}})

        expect(wrapper.instance().canSave()).toEqual(false)
      })

      it('cannot save when latitude is NaN', () => {
        wrapper = shallow(<MergeTarget {...props} />)
        wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})
        wrapper.instance().getHandler('latitude')({target: {value: 'blah'}})

        expect(wrapper.instance().canSave()).toEqual(false)
      })

      it('cannot save when just longitude is empty', () => {
        wrapper = shallow(<MergeTarget {...props} />)
        wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})
        wrapper.instance().getHandler('longitude')({target: {value: ''}})

        expect(wrapper.instance().canSave()).toEqual(false)
      })

      it('cannot save when just latitude is empty', () => {
        wrapper = shallow(<MergeTarget {...props} />)
        wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})
        wrapper.instance().getHandler('latitude')({target: {value: ''}})

        expect(wrapper.instance().canSave()).toEqual(false)
      })

      it('cannot save when longitude is invalid', () => {
        wrapper = shallow(<MergeTarget {...props} />)
        wrapper.instance().getHandler('alphaColor')({target: {value: '180.05'}})
        wrapper.instance().getHandler('longitude')({target: {value: ''}})

        expect(wrapper.instance().canSave()).toEqual(false)
      })

      it('cannot save when latitude is invalid', () => {
        wrapper = shallow(<MergeTarget {...props} />)
        wrapper.instance().getHandler('alphaColor')({target: {value: '-90.05'}})
        wrapper.instance().getHandler('latitude')({target: {value: ''}})

        expect(wrapper.instance().canSave()).toEqual(false)
      })
    })
  })

  describe('getHandler', () => {
    it('updates normal field', () => {
      wrapper = shallow(<MergeTarget {...props} />)
      wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})

      expect(wrapper.instance().state.alphaColor).toEqual('red')
    })

    it('updates and slices alpha field', () => {
      wrapper = shallow(<MergeTarget {...props} />)
      wrapper.instance().getHandler('alpha')({target: {value: 'a letter a'}})

      expect(wrapper.instance().state.alpha).toEqual('A')
    })

    it('allows numeric alpha field', () => {
      wrapper = shallow(<MergeTarget {...props} />)
      wrapper.instance().getHandler('alpha')({target: {value: '2'}})

      expect(wrapper.instance().state.alpha).toEqual('2')
    })
  })

  describe('save', () => {
    const updateTarget = jest.fn()
    const saveTarget = jest.fn()
    const deleteSavedTarget = jest.fn()
    const deleteUnsavedTarget = jest.fn()

    beforeEach(() => {
      updateTarget.mockReset()
      saveTarget.mockReset()
      deleteSavedTarget.mockReset()
      deleteUnsavedTarget.mockReset()
    })

    describe('update saved target', () => {
      const newProps = {
        target: props.target,
        sightings: props.sightings,
        onTsDragStart: props.onTsDragStart,
        onTsDragEnd: props.onTsDragEnd,
        onTsDrop: props.onTsDrop,
        updateTarget,
        saveTarget,
        deleteSavedTarget,
        deleteUnsavedTarget
      }

      beforeEach(() => {
        wrapper = shallow(<MergeTarget {...newProps} />)
      })

      it('updates correct alpha fields', () => {
        wrapper.instance().getHandler('alpha')({target: {value: 'D'}})
        wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})
        wrapper.instance().getHandler('shape')({target: {value: 'triangle'}})
        wrapper.instance().getHandler('shapeColor')({target: {value: 'green'}})
        wrapper.instance().getHandler('thumbnailTSId')({target: {value: 12}})
        wrapper.instance().getHandler('description')({target: {value: 'a dog riding a horse'}})

        wrapper.instance().save()

        expect(saveTarget).toHaveBeenCalledTimes(0)
        expect(deleteSavedTarget).toHaveBeenCalledTimes(0)
        expect(deleteUnsavedTarget).toHaveBeenCalledTimes(0)

        expect(updateTarget).toHaveBeenCalledWith(props.target, fromJS({
          alpha: 'D',
          alphaColor: 'red',
          shape: 'triangle',
          shapeColor: 'green',
          thumbnailTSId: 12
        }))
        expect(updateTarget).toHaveBeenCalledTimes(1)
      })

      it('updates correct e fields', () => {
        const newEProps = {
          target: eProps.target,
          sightings: eProps.sightings,
          onTsDragStart: props.onTsDragStart,
          onTsDragEnd: props.onTsDragEnd,
          onTsDrop: props.onTsDrop,
          updateTarget,
          saveTarget,
          deleteSavedTarget,
          deleteUnsavedTarget
        }
        wrapper = shallow(<MergeTarget {...newEProps} />)
        wrapper.instance().getHandler('alpha')({target: {value: 'D'}})
        wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})
        wrapper.instance().getHandler('shape')({target: {value: 'triangle'}})
        wrapper.instance().getHandler('shapeColor')({target: {value: 'green'}})
        wrapper.instance().getHandler('thumbnailTSId')({target: {value: 12}})
        wrapper.instance().getHandler('description')({target: {value: 'a dog riding a horse'}})

        wrapper.instance().save()

        expect(saveTarget).toHaveBeenCalledTimes(0)
        expect(deleteSavedTarget).toHaveBeenCalledTimes(0)
        expect(deleteUnsavedTarget).toHaveBeenCalledTimes(0)

        expect(updateTarget).toHaveBeenCalledWith(eProps.target, fromJS({
          description: 'a dog riding a horse',
          thumbnailTSId: 12
        }))
        expect(updateTarget).toHaveBeenCalledTimes(1)
      })

      it('only updates changed fields', () => {
        wrapper.instance().getHandler('alpha')({target: {value: 'D'}})
        wrapper.instance().getHandler('alphaColor')({target: {value: props.target.get('alphaColor')}})
        wrapper.instance().getHandler('shape')({target: {value: 'triangle'}})
        wrapper.instance().getHandler('thumbnailTSId')({target: {value: 12}})

        wrapper.instance().save()

        expect(saveTarget).toHaveBeenCalledTimes(0)
        expect(deleteSavedTarget).toHaveBeenCalledTimes(0)
        expect(deleteUnsavedTarget).toHaveBeenCalledTimes(0)

        expect(updateTarget).toHaveBeenCalledWith(props.target, fromJS({
          alpha: 'D',
          shape: 'triangle',
          thumbnailTSId: 12
        }))
        expect(updateTarget).toHaveBeenCalledTimes(1)
      })

      it('includes geotag in update when changed', () => {
        wrapper.instance().getHandler('shape')({target: {value: 'triangle'}})
        wrapper.instance().getHandler('latitude')({target: {value: '31.23214'}})

        wrapper.instance().save()

        expect(saveTarget).toHaveBeenCalledTimes(0)
        expect(deleteSavedTarget).toHaveBeenCalledTimes(0)
        expect(deleteUnsavedTarget).toHaveBeenCalledTimes(0)

        expect(updateTarget).toHaveBeenCalledWith(props.target, fromJS({
          shape: 'triangle',
          geotag: {
            gpsLocation: {
              latitude: '31.23214',
              longitude: props.target.getIn(['geotag', 'gpsLocation', 'longitude'])
            }
          }
        }))
        expect(updateTarget).toHaveBeenCalledTimes(1)
      })

      it('updates when only geotag changed', () => {
        wrapper.instance().getHandler('longitude')({target: {value: '31.23214'}})

        wrapper.instance().save()

        expect(saveTarget).toHaveBeenCalledTimes(0)
        expect(deleteSavedTarget).toHaveBeenCalledTimes(0)
        expect(deleteUnsavedTarget).toHaveBeenCalledTimes(0)

        expect(updateTarget).toHaveBeenCalledWith(props.target, fromJS({
          geotag: {
            gpsLocation: {
              longitude: '31.23214',
              latitude: props.target.getIn(['geotag', 'gpsLocation', 'latitude'])
            }
          }
        }))
        expect(updateTarget).toHaveBeenCalledTimes(1)
      })
    })

    describe('save new target', () => {
      const newProps = {
        target: fromJS({
          type: 'alphanum',
          alpha: '',
          alphaColor: '',
          shape: '',
          shapeColor: '',
          thumbnailTSId: 0,
          localId: '534262436:452345:45324',
          offaxis: false
        }),
        sightings: props.sightings,
        onTsDragStart: props.onTsDragStart,
        onTsDragEnd: props.onTsDragEnd,
        onTsDrop: props.onTsDrop,
        updateTarget,
        saveTarget,
        deleteSavedTarget,
        deleteUnsavedTarget
      }

      beforeEach(() => {
        wrapper = shallow(<MergeTarget {...newProps} />)
      })

      it('saves correct alpha fields', () => {
        wrapper.instance().getHandler('alpha')({target: {value: 'D'}})
        wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})
        wrapper.instance().getHandler('shape')({target: {value: 'triangle'}})
        wrapper.instance().getHandler('shapeColor')({target: {value: 'green'}})
        wrapper.instance().getHandler('thumbnailTSId')({target: {value: 12}})
        wrapper.instance().getHandler('description')({target: {value: 'a dog riding a horse'}})

        wrapper.instance().save()

        expect(updateTarget).toHaveBeenCalledTimes(0)
        expect(deleteSavedTarget).toHaveBeenCalledTimes(0)
        expect(deleteUnsavedTarget).toHaveBeenCalledTimes(0)

        expect(saveTarget).toHaveBeenCalledWith(fromJS({
          alpha: 'D',
          alphaColor: 'red',
          shape: 'triangle',
          shapeColor: 'green',
          thumbnailTSId: 12,
          type: 'alphanum',
          localId: newProps.target.get('localId'),
          offaxis: false
        }), fromJS([]))
        expect(saveTarget).toHaveBeenCalledTimes(1)
      })

      it('includes geotag when set', () => {
        wrapper.instance().getHandler('alpha')({target: {value: 'D'}})
        wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})
        wrapper.instance().getHandler('shape')({target: {value: 'triangle'}})
        wrapper.instance().getHandler('shapeColor')({target: {value: 'green'}})
        wrapper.instance().getHandler('thumbnailTSId')({target: {value: 12}})
        wrapper.instance().getHandler('latitude')({target: {value: '31.23214'}})
        wrapper.instance().getHandler('longitude')({target: {value: '-12.34235'}})

        wrapper.instance().save()

        expect(updateTarget).toHaveBeenCalledTimes(0)
        expect(deleteSavedTarget).toHaveBeenCalledTimes(0)
        expect(deleteUnsavedTarget).toHaveBeenCalledTimes(0)

        expect(saveTarget).toHaveBeenCalledWith(fromJS({
          alpha: 'D',
          alphaColor: 'red',
          shape: 'triangle',
          shapeColor: 'green',
          thumbnailTSId: 12,
          geotag: {
            gpsLocation: {
              latitude: '31.23214',
              longitude: '-12.34235'
            }
          },
          type: 'alphanum',
          localId: newProps.target.get('localId'),
          offaxis: false
        }), fromJS([]))
        expect(saveTarget).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('delete', () => {
    const updateTarget = jest.fn()
    const saveTarget = jest.fn()
    const deleteSavedTarget = jest.fn()
    const deleteUnsavedTarget = jest.fn()

    beforeEach(() => {
      updateTarget.mockReset()
      saveTarget.mockReset()
      deleteSavedTarget.mockReset()
      deleteUnsavedTarget.mockReset()
    })

    it('deletes saved target correctly', () => {
      const newProps = {
        target: props.target,
        sightings: props.sightings,
        onTsDragStart: props.onTsDragStart,
        onTsDragEnd: props.onTsDragEnd,
        onTsDrop: props.onTsDrop,
        updateTarget,
        saveTarget,
        deleteSavedTarget,
        deleteUnsavedTarget
      }
      wrapper = shallow(<MergeTarget {...newProps} />)

      wrapper.instance().delete()

      expect(updateTarget).toHaveBeenCalledTimes(0)
      expect(saveTarget).toHaveBeenCalledTimes(0)
      expect(deleteUnsavedTarget).toHaveBeenCalledTimes(0)

      expect(deleteSavedTarget).toHaveBeenCalledWith(newProps.target)
      expect(deleteSavedTarget).toHaveBeenCalledTimes(1)
    })

    it('deletes unsaved target correctly', () => {
      const newProps = {
        target: fromJS({
          type: 'alphanum',
          alpha: '',
          alphaColor: '',
          shape: '',
          shapeColor: '',
          thumbnailTSId: 0,
          localId: '534262436:452345:45324',
          offaxis: false
        }),
        sightings: props.sightings,
        onTsDragStart: props.onTsDragStart,
        onTsDragEnd: props.onTsDragEnd,
        onTsDrop: props.onTsDrop,
        updateTarget,
        saveTarget,
        deleteSavedTarget,
        deleteUnsavedTarget
      }

      wrapper = shallow(<MergeTarget {...newProps} />)

      wrapper.instance().delete()

      expect(updateTarget).toHaveBeenCalledTimes(0)
      expect(saveTarget).toHaveBeenCalledTimes(0)
      expect(deleteSavedTarget).toHaveBeenCalledTimes(0)

      expect(deleteUnsavedTarget).toHaveBeenCalledWith(newProps.target)
      expect(deleteUnsavedTarget).toHaveBeenCalledTimes(1)
    })
  })

  describe('rendered main div', () => {
    it('has correct fields in main div', () => {
      wrapper = shallow(<MergeTarget {...props} />)
      const mainDiv = wrapper.find('div').first()

      expect(mainDiv.prop('className')).toEqual('target card')
      expect(mainDiv.prop('onDragEnter')).toBe(wrapper.instance().dragEnter)
      expect(mainDiv.prop('onDragLeave')).toBe(wrapper.instance().dragLeave)
      expect(mainDiv.prop('onDragOver')).toBeDefined() //can't check anon. func, but the only option in the ternary is undefined so this works
      expect(mainDiv.prop('onDrop')).toBe(wrapper.instance().drop)
    })

    it('has correct fields in main div for emergent', () => {
      wrapper = shallow(<MergeTarget {...eProps} />)
      const mainDiv = wrapper.find('div').first()

      expect(mainDiv.prop('className')).toEqual('target card')
      expect(mainDiv.prop('onDragEnter')).toBeUndefined()
      expect(mainDiv.prop('onDragLeave')).toBeUndefined()
      expect(mainDiv.prop('onDragOver')).toBeUndefined()
      expect(mainDiv.prop('onDrop')).toBeUndefined()
    })

    it('has correct fields in main div for offaxis', () => {
      const newProps = {
        target: props.target.set('offaxis', true),
        sightings: props.sightings,
        onTsDragStart: props.onTsDragStart,
        onTsDragEnd: props.onTsDragEnd,
        onTsDrop: props.onTsDrop
      }
      wrapper = shallow(<MergeTarget {...newProps} />)
      const mainDiv = wrapper.find('div').first()

      expect(mainDiv.prop('className')).toEqual('target card')
      expect(mainDiv.prop('onDragEnter')).toBeUndefined()
      expect(mainDiv.prop('onDragLeave')).toBeUndefined()
      expect(mainDiv.prop('onDragOver')).toBeUndefined()
      expect(mainDiv.prop('onDrop')).toBeUndefined()
    })
  })

  describe('rendered attributes', () => {
    it('has correct attributes', () => {
      wrapper = shallow(<MergeTarget {...props} />)
      const alphaDiv = wrapper.find('.facts div').first()
      expect(alphaDiv.prop('className')).toEqual('row')
      const alphaFields = alphaDiv.find('TargetAlphanumFields')
      expect(alphaFields.prop('shape')).toEqual('circle')
      expect(alphaFields.prop('shapeColor')).toEqual('blue')
      expect(alphaFields.prop('alpha')).toEqual('Q')
      expect(alphaFields.prop('alphaColor')).toEqual('orange')
      expect(alphaFields.prop('getHandler')).toBe(wrapper.instance().getHandler)

      const eDiv = wrapper.find('.facts div').at(1)
      expect(eDiv.prop('className')).toEqual('hidden')

      const geoDiv = wrapper.find('.facts div').at(2)
      expect(geoDiv.prop('className')).toEqual('row')
      const geoFields = geoDiv.find('TargetGeotagFields')
      expect(geoFields.prop('latitude')).toEqual('42.447833')
      expect(geoFields.prop('longitude')).toEqual('-76.612096')
      expect(geoFields.prop('getHandler')).toBe(wrapper.instance().getHandler)
    })

    it('has correct emergent attributes', () => {
      wrapper = shallow(<MergeTarget {...eProps} />)
      const alphaDiv = wrapper.find('.facts div').first()
      expect(alphaDiv.prop('className')).toEqual('hidden')

      const eDiv = wrapper.find('.facts div').at(1)
      expect(eDiv.prop('className')).toEqual('row')
      const eFields = eDiv.find('TargetEmergentFields')
      expect(eFields.prop('description')).toEqual('a german shepherd on stilts')
      expect(eFields.prop('getHandler')).toBe(wrapper.instance().getHandler)

      const geoDiv = wrapper.find('.facts div').at(2)
      expect(geoDiv.prop('className')).toEqual('row')
      const geoFields = geoDiv.find('TargetGeotagFields')
      expect(geoFields.prop('latitude')).toEqual('42.447833')
      expect(geoFields.prop('longitude')).toEqual('-76.612096')
      expect(geoFields.prop('getHandler')).toBe(wrapper.instance().getHandler)
    })

    it('has correct offaxis attributes', () => {
      const newProps = {
        target: props.target.set('offaxis', true),
        sightings: props.sightings,
        onTsDragStart: props.onTsDragStart,
        onTsDragEnd: props.onTsDragEnd,
        onTsDrop: props.onTsDrop,
      }

      wrapper = shallow(<MergeTarget {...newProps} />)
      const alphaDiv = wrapper.find('.facts div').first()
      expect(alphaDiv.prop('className')).toEqual('row')
      const alphaFields = alphaDiv.find('TargetAlphanumFields')
      expect(alphaFields.prop('shape')).toEqual('circle')
      expect(alphaFields.prop('shapeColor')).toEqual('blue')
      expect(alphaFields.prop('alpha')).toEqual('Q')
      expect(alphaFields.prop('alphaColor')).toEqual('orange')
      expect(alphaFields.prop('getHandler')).toBe(wrapper.instance().getHandler)

      const eDiv = wrapper.find('.facts div').at(1)
      expect(eDiv.prop('className')).toEqual('hidden')

      const geoDiv = wrapper.find('.facts div').at(2)
      expect(geoDiv.prop('className')).toEqual('hidden')
    })

    it('has correct attributes after update', () => {
      wrapper = shallow(<MergeTarget {...props} />)
      wrapper.instance().getHandler('alphaColor')({target: {value: 'red'}})
      wrapper.instance().getHandler('longitude')({target: {value: '13.423522'}})

      const alphaDiv = wrapper.find('.facts div').first()
      expect(alphaDiv.prop('className')).toEqual('row')
      const alphaFields = alphaDiv.find('TargetAlphanumFields')
      expect(alphaFields.prop('shape')).toEqual('circle')
      expect(alphaFields.prop('shapeColor')).toEqual('blue')
      expect(alphaFields.prop('alpha')).toEqual('Q')
      expect(alphaFields.prop('alphaColor')).toEqual('red')
      expect(alphaFields.prop('getHandler')).toBe(wrapper.instance().getHandler)

      const eDiv = wrapper.find('.facts div').at(1)
      expect(eDiv.prop('className')).toEqual('hidden')

      const geoDiv = wrapper.find('.facts div').at(2)
      expect(geoDiv.prop('className')).toEqual('row')
      const geoFields = geoDiv.find('TargetGeotagFields')
      expect(geoFields.prop('latitude')).toEqual('42.447833')
      expect(geoFields.prop('longitude')).toEqual('13.423522')
      expect(geoFields.prop('getHandler')).toBe(wrapper.instance().getHandler)
    })
  })

  describe('rendered sightings', () => {
    it('rendered sightings for normal target', () => {
      wrapper = shallow(<MergeTarget {...props} />)
      const sightings = wrapper.find('div.sighting-images MergeSightingPreview')

      expect(sightings).toHaveLength(2)

      const s0 = sightings.at(0)
      expect(s0.key()).toEqual('11-image-alphanum')
      expect(s0.prop('isMerged')).toEqual(true)
      expect(s0.prop('isThumbnail')).toEqual(true)
      expect(s0.prop('sighting')).toEqual(props.sightings.get(0))
      expect(s0.prop('onDragStart')).toBeDefined()
      expect(s0.prop('onDragEnd')).toBeDefined()
      expect(s0.prop('dragging')).toEqual(false)

      const s1 = sightings.at(1)
      expect(s1.key()).toEqual('12-image-alphanum')
      expect(s1.prop('isMerged')).toEqual(true)
      expect(s1.prop('isThumbnail')).toEqual(false)
      expect(s1.prop('sighting')).toEqual(props.sightings.get(1))
      expect(s1.prop('onDragStart')).toBeDefined()
      expect(s1.prop('onDragEnd')).toBeDefined()
      expect(s1.prop('dragging')).toEqual(false)
    })

    it('updates thumbnail', () => {
      wrapper = shallow(<MergeTarget {...props} />)

      let sightings = wrapper.find('div.sighting-images MergeSightingPreview')
      expect(sightings.at(0).prop('isThumbnail')).toEqual(true)
      expect(sightings.at(1).prop('isThumbnail')).toEqual(false)

      wrapper.instance().selectThumb(12)

      sightings = wrapper.find('div.sighting-images MergeSightingPreview')
      expect(sightings.at(0).prop('isThumbnail')).toEqual(false)
      expect(sightings.at(1).prop('isThumbnail')).toEqual(true)

      wrapper.instance().selectThumb(11)

      sightings = wrapper.find('div.sighting-images MergeSightingPreview')
      expect(sightings.at(0).prop('isThumbnail')).toEqual(true)
      expect(sightings.at(1).prop('isThumbnail')).toEqual(false)
    })

    it('rendered sightings for emergent target', () => {
      wrapper = shallow(<MergeTarget {...eProps} />)
      const sightings = wrapper.find('div.sighting-images MergeSightingPreview')

      expect(sightings).toHaveLength(2)

      const s0 = sightings.at(0)
      expect(s0.key()).toEqual('11-image-emergent')
      expect(s0.prop('isMerged')).toEqual(true)
      expect(s0.prop('isThumbnail')).toEqual(true)
      expect(s0.prop('sighting')).toEqual(eProps.sightings.get(0))
      expect(s0.prop('onDragStart')).toBeUndefined()
      expect(s0.prop('onDragEnd')).toBeUndefined()
      expect(s0.prop('dragging')).toEqual(false)

      const s1 = sightings.at(1)
      expect(s1.key()).toEqual('12-image-emergent')
      expect(s1.prop('isMerged')).toEqual(true)
      expect(s1.prop('isThumbnail')).toEqual(false)
      expect(s1.prop('sighting')).toEqual(eProps.sightings.get(1))
      expect(s1.prop('onDragStart')).toBeUndefined()
      expect(s1.prop('onDragEnd')).toBeUndefined()
      expect(s1.prop('dragging')).toEqual(false)
    })

    it('rendered sightings for offaxis target', () => {
      const newProps = {
        target: props.target.set('offaxis', true),
        sightings: props.sightings.map(s => s.set('offaxis', true)),
        onTsDragStart: props.onTsDragStart,
        onTsDragEnd: props.onTsDragEnd,
        onTsDrop: props.onTsDrop,
      }

      wrapper = shallow(<MergeTarget {...newProps} />)
      const sightings = wrapper.find('div.sighting-images MergeSightingPreview')

      expect(sightings).toHaveLength(2)

      const s0 = sightings.at(0)
      expect(s0.key()).toEqual('11-image-alphanum')
      expect(s0.prop('isMerged')).toEqual(true)
      expect(s0.prop('isThumbnail')).toEqual(true)
      expect(s0.prop('sighting')).toEqual(newProps.sightings.get(0))
      expect(s0.prop('onDragStart')).toBeUndefined()
      expect(s0.prop('onDragEnd')).toBeUndefined()
      expect(s0.prop('dragging')).toEqual(false)

      const s1 = sightings.at(1)
      expect(s1.key()).toEqual('12-image-alphanum')
      expect(s1.prop('isMerged')).toEqual(true)
      expect(s1.prop('isThumbnail')).toEqual(false)
      expect(s1.prop('sighting')).toEqual(newProps.sightings.get(1))
      expect(s1.prop('onDragStart')).toBeUndefined()
      expect(s1.prop('onDragEnd')).toBeUndefined()
      expect(s1.prop('dragging')).toEqual(false)
    })
  })
})