import React from 'react'
import renderer from 'react-test-renderer'
import { fromJS } from 'immutable'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ImageSighting from '../../../../pages/tag/components/imageSighting'

Enzyme.configure({ adapter: new Adapter() })

describe('Base tests', () => {
  let props, wrapper
  const sighting = fromJS({
    height: 1405,
    localId: '979.6291390728477:526.5298013245033:702.620099040495:0.0006300101418243997',
    pixelX: 980,
    pixelY: 527,
    radiansFromTop: 2.5051419954498755,
    width: 1405,
  })
  beforeEach(() => {
    props = {
      heightWidth: 150,
      imgHeight: 150,
      imgWidth: 150,
      imageUrl: '../../../../img/cuair_default.png',
      sighting: sighting
    }
    wrapper = shallow(<ImageSighting {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('renders the orientation', () => {
    expect(wrapper.find('svg')).toHaveLength(1)
    expect(wrapper.find('line')).toHaveLength(1)
  })
})
