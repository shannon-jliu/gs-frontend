import { fromJS } from "immutable";

const initialState = fromJS({
  all: {},
  // lastIdPreloaded: -1,
  // recent: {
  //   timestamp: -1
  // }
});

const thumbnailReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RECEIVE_IMAGE":
      var image = action.image;
      var airdropId = action.id;
      //sets the state
      var all = state.setIn(["all", String(airdropId)], image);
      return all;
    case "CLEAR_STATE":
      return initialState;
    default:
      return state;
  }
};

export default thumbnailReducer;
