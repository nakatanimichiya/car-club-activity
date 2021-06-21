import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowUp, faArrowDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ControlBtn = ({ onChage }) => {
  const onUp = () => onChage("up");
  const onRight = () => onChage("right");
  const onLeft = () => onChage("left");
  const onDown = () => onChage("down");

  return (
    <div className="manipulation-panel">
      <button className="manipulation-btn btn btn-left" onClick={onLeft}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className="column">
        <button className="manipulation-btn btn btn-up " onClick={onUp}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button className="manipulation-btn btn btn-down " onClick={onDown}>
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>
      <button className="manipulation-btn btn btn-right" onClick={onRight}>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default ControlBtn;
