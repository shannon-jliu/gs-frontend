import React from 'react'
import PropTypes from 'prop-types'

const ButtonRow = ({ type, isSaved, saveable, save, deletable, deleteSighting }) => (
  <div className='row'>
    {/*Save button */}
    <div className={type === '' ? 'hidden' : 'button-container input-field col s6'}>
      <a onClick={save} className={(saveable ? '' : 'disabled ') + 'waves-effect waves-light btn'} href='/#'>
        {isSaved ? 'Update' : 'Save'}
      </a>
    </div>
    {/*Delete button */}
    <div className='button-container input-field col s5'>
      <a onClick={deleteSighting} className={(deletable ? '' : 'disabled ') + 'waves-effect waves-light btn'} href='/#'>
        Delete
      </a>
    </div>
  </div>
)

ButtonRow.propTypes = {
  type: PropTypes.string.isRequired,
  isSaved: PropTypes.bool.isRequired,
  saveable: PropTypes.bool.isRequired,
  save: PropTypes.func.isRequired,
  deletable: PropTypes.bool.isRequired,
  deleteSighting: PropTypes.func.isRequired,
}

export default ButtonRow
