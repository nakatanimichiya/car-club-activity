import React from "react";

const Btn = ({ onStart, onStop, onRestart, status }) => {
  return (
    <div className="button">
      {/* [条件式]&&[任意の処理] */}
      {status === "init" && (
        <button className="btn btn-init" onClick={onStart}>
          start
        </button>
      )}
      {status === "suspended" && (
        <button className="btn btn-suspended" onClick={onStart}>
          start
        </button>
      )}
      {status === "gameover" && (
        <button className="btn btn-gameover" onClick={onRestart}>
          gameover
        </button>
      )}
      {status === "playing" && (
        <button className="btn btn-playing" onClick={onStop}>
          stop
        </button>
      )}
    </div>
  );
};

export default Btn;
