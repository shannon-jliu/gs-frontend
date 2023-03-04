import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useSelector } from "react-redux";

import { GROUND_SERVER_URL } from "../../../constants/links";

const TargetSelector = ({ setTargetSighting }) => {
  const [selected, setSelected] = useState(-1);
  const arr = [0, 1, 2, 3, 4];
  //this is currently undefined
  const savedTargets = useSelector((state) => state.targetReducer.get("saved"));

  function saveTargetSighting(id) {
    const target = savedTargets.find((t) => t.get("airdropId") === id);
    console.log(JSON.stringify(savedTargets));
    setTargetSighting(target);
  }

  return (
    <div style={{ justifyContent: "left" }}>
      {arr.map((id) => {
        return (
          <button
            style={
              selected === id ? { padding: 10, border: 1 } : { padding: 10 }
            }
            onClick={() => {
              setSelected(id);
              saveTargetSighting(id);
            }}
          >
            <img
              src={GROUND_SERVER_URL + "/api/v1/thumbnail/" + id}
              width="100"
            />
          </button>
        );
      })}
    </div>
  );
};
// const mapStateToProps = (state) => ({
//   savedTargets: state.targetReducer.get("saved"),
// });

// export default connect(mapStateToProps, null)(TargetSelector);
export default TargetSelector;
