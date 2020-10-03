import { fromJS } from 'immutable'
import { receiveUsersEnabled } from '../../actions/utilActionCreator.js'

it('should create an action when it receives a users-enabled state', () => {
  const usersEnabled = fromJS({
    usersEnabled: true
  })
  const expectedAction = {
    type: 'RECEIVE_USERS_ENABLED',
    usersEnabled
  }
  expect(receiveUsersEnabled(usersEnabled)).toEqual(expectedAction)
})
