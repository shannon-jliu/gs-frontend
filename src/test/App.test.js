import React from 'react'
import ReactDOM from 'react-dom'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { fromJS } from 'immutable'

import { App } from '../App'
import Header from '../components/header.js'
import utilOperations from '../operations/utilOperations.js'

configure({ adapter: new Adapter() })
// Create mock store
const mockStore = configureMockStore()

describe('App Component', () => {
  let wrapper, store

  beforeEach(() => {
    const settings = fromJS({
      usersEnabled: true
    })
    const mappedSettings = fromJS(settings)

    store = mockStore(mappedSettings)

    wrapper = shallow(
      <Provider store={store}>
        <App utilSettings={settings} getUsersEnabled={utilOperations.getUsersEnabled} />
      </Provider>
    )
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(wrapper, div)
  })
})
