// import React, { Component } from 'react'
// import { connect } from 'react-redux'

// import AuthUtil from '../../util/authUtil.js'
// import SnackbarUtil from '../../util/snackbarUtil.js'
// import { GROUND_SERVER_URL } from '../../constants/links'

// import './confirm.css'
// import './penot.png'

// export class Confirm extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       x: -1,
//       y: -1
//     }
//     this.handleDragStart = this.handleDragStart.bind(this)
//     this.handleDragEnd = this.handleDragEnd.bind(this)
//   }

//   handleDragStart(event) {
//     // This method runs when the dragging starts
//     console.log("Started")
//   }

//   handleDrag(event) {
//     // This method runs when the component is being dragged
//     console.log("Dragging...")
//     console.log(event.clientX)
//   }
//   handleDragEnd(event) {
//     // This method runs when the dragging stops
//     this.setState({
//       x: event.clientX,
//       y: event.clientY
//     })
//     if (event.clientX == event.clientX) {

//     }
//   }

//   render(e) {
//     let targets = [1, 2, 3, 4, 5]
//     let tagged_images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//     return (
//       <div className="confirm">
//         <img
//           src={require('./penot.png')}
//           alt={"trash"}
//           width="110"
//           style={{
//             position: "sticky",
//             top: 5,
//             left: "91%"
//           }}
//         />
//         <div className="rows">
//           {targets.map((currentValue, index) => {
//             return (<>
//               <div className="row">
//                 <div className="target-images">
//                   <img
//                     src={require('./penot.png')}
//                     alt={index + 1}
//                     // src={GROUND_SERVER_URL + '/api/v1/thumbnail/' + index - 1}
//                     width="200"
//                   />
//                 </div>
//               </div>
//             </>
//             )
//           })}
//           {tagged_images.map((currentValue, index) => {
//             return (<>
//               <div className="tagged-images">
//                 <div className={index}>
//                   <img
//                     src={require('./penot.png')}
//                     draggable
//                     onDragStart={this.handleDragStart}
//                     onDrag={this.handleDrag}
//                     onDragEnd={this.handleDragEnd}
//                     alt={index + 1}
//                     width="100"
//                   />
//                   <img
//                     src={require('./penot.png')}
//                     alt={index + 1}
//                     width="100"
//                   />
//                 </div>
//               </div>
//             </>
//             )
//           })}
//         </div>
//       </div>
//     )
//   }
// }

// const mapDispatchToProps = (dispatch) => ({
// });

// const mapStateToProps = state => ({
//   utilSettings: state.utilReducer
// })

// export default connect(mapStateToProps, null)(Confirm)
