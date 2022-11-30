import React from 'react'
import PropTypes from 'prop-types'

import Selector from './selector'

const letters = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
  H: 'H',
  I: 'I',
  J:'J',
  K:'K',
  L:'L',
  M:'M',
  N:'N',
  O:'O',
  P:'P',
  Q:'Q',
  R:'R',
  S:'S',
  T:'T',
  U:'U',
  V:'V',
  W:'W',
  X:'X',
  Y:'Y',
  Z:'Z',
  0:'0',
  1:'1',
  2:'2',
  3:'3',
  4:'4',
  5:'5',
  6:'6',
  7:'7',
  8:'8',
  9:'9'
}

const LetterSelect = ({ className, onChange, value, title }) => (
  <Selector
    value={value}
    onChange={onChange}
    className={className}
    title={title}
    options={letters}
  />
)

LetterSelect.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default LetterSelect
