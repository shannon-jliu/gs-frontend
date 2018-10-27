import Snackbar from 'node-snackbar'
import $ from 'jquery'

import 'node-snackbar/dist/snackbar.css'

const SnackbarUtil = {
  render: function(msg) {
  Snackbar.show({
      actionText: 'Hide',
      text: msg,
      onActionClick: function(element) {
         $(element).css('opacity', 0)
      }
    })
  }
}

export default SnackbarUtil
