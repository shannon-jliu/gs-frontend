import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useSelector } from 'react-redux'

const TargetSelector = ({ setTargetSighting }) => {
  const [selected, setSelected] = useState(-1)
  const arr = [0, 1, 2, 3, 4]

  //access redux state
  const savedTargets = useSelector((state) => state.targetReducer.get('saved'))

  function saveTargetSighting(id) {
    const target = savedTargets.find((t) => t.get('airdropId') === id)
    setTargetSighting(target)
  }

  const RenderTarget = ({ target }) => {
    let alpha = target.get("alpha");
    let alphaColor = (shape = target.get("alphaColor"));
    let shape = target.get("shape").toUpperCase();
    let shapeColor = target.get("shapeColor");

    if (shapeColor == "white") {
      shapeColor = "#FFF8DC";
    }

    return (
      <>
        <div
          className="mask"
          style={{
            maskImage: `url("/img/thumbnails/${shape}.png")`,
            WebkitMaskImage: `url("/img/thumbnails/${shape}.png")`,
            backgroundColor: shapeColor,
          }}
        >
          <div style={{ color: alphaColor }}>
            <svg
              style={{ width: "100px", height: "100px" }}
              viewBox={"0 0 100 100"}
            >
              <text
                stroke={"black"}
                strokeWidth={1}
                fill={alphaColor}
                style={{
                  fontSize: "50px",
                  textAlign: "center",
                  textAnchor: "middle",
                  dominantBaseline: "central",
                  fontWeight: "bold",
                }}
                x={50}
                y={50}
              >
                {alpha}
              </text>
            </svg>
          </div>
        </div>
      </>
    );
  }

  return (
    <div style={{ justifyContent: 'left' }}>
      {
        savedTargets.map(target => {
          const id = target.get("airdropId")
          return (
            <button className='target-button'
              style={
                selected === id ? { border: 1 } : { border: 0 }
              }
              onClick={() => {
                setSelected(id)
                saveTargetSighting(id)
              }}
            >
              <RenderTarget target={target} />
            </button>
          )
        })
      }
    </div>
  )
}

export default TargetSelector
