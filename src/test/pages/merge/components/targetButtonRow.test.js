import React from 'react'
import { fromJS } from 'immutable'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import TargetButtonRow from '../../../../pages/merge/components/targetButtonRow'

Enzyme.configure({ adapter: new Adapter() })

describe('TargetButtonRow', () => {
  const save = jest.fn()
  const deleteFn = jest.fn()
  const props = fromJS({
    type: 'alphanum',
    offaxis: false,
    isSaved: true,
    saveable: true,
    save: save,
    deletable: true,
    deleteFn: deleteFn
  })

  describe('Base tests', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<TargetButtonRow {...props.toJS()} />)
    })

    it('renders correctly', () => {
      expect(wrapper).toBeDefined()
    })

    it('renders all the selectors correctly', () => {
      expect(wrapper.find('a')).toHaveLength(2)
    })
  })

  describe('Prop tests', () => {
    beforeEach(() => {
      save.mockClear()
      deleteFn.mockClear()
    })

    it('is correct for most common settings', () => {
      const wrapper = shallow(<TargetButtonRow {...props.toJS()} />)

      const saveButton = wrapper.find('a').first()
      expect(saveButton.hasClass('disabled')).toBeFalsy()
      expect(saveButton.text()).toEqual('Update')

      expect(wrapper.find('div').at(2).hasClass('hidden')).toBeFalsy()

      const deleteButton = wrapper.find('a').at(1)
      expect(deleteButton.hasClass('disabled')).toBeFalsy()

      saveButton.simulate('click')
      expect(save).toHaveBeenCalledTimes(1)
      expect(deleteFn).toHaveBeenCalledTimes(0)
      save.mockClear()

      deleteButton.simulate('click')
      expect(save).toHaveBeenCalledTimes(0)
      expect(deleteFn).toHaveBeenCalledTimes(1)
    })

    it('is correct for emergent', () => {
      const newProps = props.set('type', 'emergent').delete('offaxis')
      const wrapper = shallow(<TargetButtonRow {...newProps.toJS()} />)

      const saveButton = wrapper.find('a').first()
      expect(saveButton.hasClass('disabled')).toBeFalsy()
      expect(saveButton.text()).toEqual('Update')

      expect(wrapper.find('div').at(2).hasClass('hidden')).toBeTruthy()
    })

    it('is correct for offaxis', () => {
      const newProps = props.set('offaxis', true)
      const wrapper = shallow(<TargetButtonRow {...newProps.toJS()} />)

      const saveButton = wrapper.find('a').first()
      expect(saveButton.hasClass('disabled')).toBeFalsy()
      expect(saveButton.text()).toEqual('Update')

      expect(wrapper.find('div').at(2).hasClass('hidden')).toBeTruthy()
    })

    it('is correct for not saveable', () => {
      const newProps = props.set('saveable', false)
      const wrapper = shallow(<TargetButtonRow {...newProps.toJS()} />)

      const saveButton = wrapper.find('a').first()
      expect(saveButton.hasClass('disabled')).toBeTruthy()
      expect(saveButton.text()).toEqual('Update')

      expect(wrapper.find('div').at(2).hasClass('hidden')).toBeFalsy()

      const deleteButton = wrapper.find('a').at(1)
      expect(deleteButton.hasClass('disabled')).toBeFalsy()
    })

    it('is correct for not deletable', () => {
      const newProps = props.set('deletable', false)
      const wrapper = shallow(<TargetButtonRow {...newProps.toJS()} />)

      const saveButton = wrapper.find('a').first()
      expect(saveButton.hasClass('disabled')).toBeFalsy()
      expect(saveButton.text()).toEqual('Update')

      expect(wrapper.find('div').at(2).hasClass('hidden')).toBeFalsy()

      const deleteButton = wrapper.find('a').at(1)
      expect(deleteButton.hasClass('disabled')).toBeTruthy()
    })

    it('is correct for false isSaved', () => {
      const newProps = props.set('isSaved', false)
      const wrapper = shallow(<TargetButtonRow {...newProps.toJS()} />)

      const saveButton = wrapper.find('a').first()
      expect(saveButton.hasClass('disabled')).toBeFalsy()
      expect(saveButton.text()).toEqual('Save')

      expect(wrapper.find('div').at(2).hasClass('hidden')).toBeFalsy()

      const deleteButton = wrapper.find('a').at(1)
      expect(deleteButton.hasClass('disabled')).toBeFalsy()
    })
  })
})
