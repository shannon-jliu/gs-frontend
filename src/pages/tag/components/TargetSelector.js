import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { GROUND_SERVER_URL } from "../../../constants/links";

const TargetSelector = ({ getHandler }) => {
  const [selected, setSelected] = useState(-1);
  const arr = [0, 1, 2, 3, 4];

  return (
    <div style={{ justifyContent: "left" }}>
      {arr.map((id) => {
        return (
          <button
            style={
              selected === id ? { padding: 10, border: 1 } : { padding: 10 }
            }
            onClick={() => setSelected(id)}
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

export default TargetSelector;
