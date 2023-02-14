import { fromJS } from "immutable";
import _ from "lodash";
import localforage from "localforage";

import * as action from "../actions/assignmentActionCreator.js";
import * as imageAction from "../actions/imageActionCreator.js";
import * as thumbnailAction from "../actions/thumbnailActionCreator";
import * as tAction from "../actions/targetActionCreator.js";
import * as tsAction from "../actions/targetSightingActionCreator.js";

import { ThumbnailGetRequests } from "../util/receiveApi.js";
import { UtilRequests } from "../util/sendApi.js";
import SnackbarUtil from "../util/snackbarUtil.js";

const ThumbnailOperations = {
  //change to return all 5 thumbnails

  getTargetThumbnails: (dispatch) => () => {
    let id = 0;
    const successCallback = (data, airdropId) => {
      dispatch(thumbnailAction.receiveImage(fromJS(data), airdropId));
    };
    const failure = () => {
      SnackbarUtil.render("Failed to retrieve thumbnails");
      console.log("fail");
    };

    //gets thumbnails for all ids
    while (id < 5) {
      ThumbnailGetRequests.requestThumbnail(id, successCallback, failure);
      id++;
    }
  },
};

export default ThumbnailOperations;
