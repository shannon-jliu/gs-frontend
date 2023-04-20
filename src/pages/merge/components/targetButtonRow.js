import React from "react";
import PropTypes from "prop-types";

const TargetButtonRow = ({
  type,
  offaxis,
  isSaved,
  saveable,
  save,
  deletable,
  deleteFn,
  send,
}) => (
  <div className="row">
    {/*Save button */}
    <div className="button-container input-field col s6">
      <a
        onClick={save}
        className={
          (saveable ? "" : "grey lighten-2 ") + "waves-effect waves-light btn"
        }
        href="/#"
      >
        {isSaved ? "Update" : "Save"}
      </a>
    </div>
    {/*Delete button */}
    <div
      className={
        type === "emergent" || offaxis || "alphanum"
          ? "hidden"
          : "button-container input-field col s5"
      }
    >
      <a
        onClick={deleteFn}
        className={
          (deletable ? "" : "grey lighten-2 ") + "waves-effect waves-light btn"
        }
        href="/#"
      >
        Delete
      </a>
    </div>

    {/*Send button */}
    <div className={"button-container input-field col s5"}>
      <a
        onClick={send}
        className={
          (deletable ? "" : "grey lighten-2 ") + "waves-effect waves-light btn"
        }
        href="/#"
      >
        Send
      </a>
    </div>
  </div>
);

TargetButtonRow.propTypes = {
  type: PropTypes.string.isRequired,
  offaxis: PropTypes.bool, //should be passed in when target is alphanum
  isSaved: PropTypes.bool.isRequired,
  saveable: PropTypes.bool.isRequired,
  save: PropTypes.func.isRequired,
  deletable: PropTypes.bool.isRequired,
  deleteFn: PropTypes.func.isRequired,
};

export default TargetButtonRow;
