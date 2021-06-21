import React, { useState, useEffect, useCallback } from "react";
import Navigation from "./components/Navigation";
import Field from "./components/Field";
import Btn from "./components/Btn";
import ControlBtn from "./components/ControlBtn";
import { initFields, getFoodPosition } from "./utils";
const initialPosition = { x: 17, y: 17 };
const initialValues = initFields(35, initialPosition);

const defaultInterval = 100;
const defaultDifficulty = 3;
const Difficulty = [1000, 500, 100, 50, 10];

const GameStatus = Object.freeze({
  init: "init",
  playing: "playing",
  suspended: "suspended",
  gameover: "gameover",
});

const Direction = Object.freeze({
  up: "up",
  right: "right",
  left: "left",
  down: "down",
});

const DirectionKeyCodeMap = Object.freeze({
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down,
});

const OppositeDirection = Object.freeze({
  up: "up",
  right: "right",
  left: "left",
  down: "down",
});

const Delta = Object.freeze({
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
});

let timer = undefined;

const unsubscribe = () => {
  if (!timer) {
    return;
  }
  clearInterval(timer);
};

const isCollision = (fieldSize, position) => {
  if (position.y < 0 || position.x < 0) {
    return true;
  }

  if (position.y > fieldSize - 1 || position.x > fieldSize - 1) {
    return true;
  }

  return false;
};

const isEatingMyself = (fields, position) => {
  return fields[position.y][position.x] === "snake";
};

function App() {
  const [fields, setFields] = useState(initialValues);
  const [body, setBody] = useState([]);
  const [status, setStatus] = useState(GameStatus.init);
  const [direction, setDirection] = useState(Direction.up);
  const [difficulty, setDifficulty] = useState(defaultDifficulty);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setBody([initialPosition]);
    //ゲームの中の時間を管理する
    const interval = Difficulty[difficulty - 1];
    timer = setInterval(() => {
      setTick((tick) => tick + 1);
    }, interval);
    return unsubscribe;
  }, [difficulty]);

  useEffect(() => {
    if (body.length === 0 || status !== GameStatus.playing) {
      return;
    }
    const canContinue = handleMoving();
    if (!canContinue) {
      unsubscribe();
      setStatus(GameStatus.gameover);
    }
  }, [tick]);

  const onStart = () => setStatus(GameStatus.playing);
  const onRestart = () => {
    timer = setInterval(() => {
      setTick((tick) => tick + 1);
    }, defaultInterval);
    setStatus(GameStatus.init);
    setBody([initialPosition]);
    setDirection(Direction.up);
    setFields(initFields(35, initialPosition));
  };

  const onStop = () => setStatus(GameStatus.suspended);

  const onChangeDirection = useCallback(
    (newDirection) => {
      if (status !== GameStatus.playing) {
        return direction;
      }
      if (OppositeDirection[direction] === newDirection) {
        return;
      }
      setDirection(newDirection);
    },
    [direction, status]
  );

  const onChangeDifficulty = useCallback(
    (difficulty) => {
      if (status !== GameStatus.init) {
        return;
      }
      if (difficulty < 1 || difficulty > Difficulty.length) {
        return;
      }
      setDifficulty(difficulty);
    },
    [status, difficulty]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.keycode];
      if (!newDirection) {
        return;
      }

      onChangeDirection(newDirection);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onChangeDirection]);

  const handleMoving = () => {
    console.log(body);
    const { x, y } = body[0];
    const delta = Delta[direction];
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y,
    };
    if (isCollision(fields.length, newPosition) || isEatingMyself(fields, newPosition)) {
      return false;
    }

    const newBody = [...body];
    if (fields[newPosition.y][newPosition.x] !== "food") {
      const removingTrack = newBody.pop(); //末尾の配列を取り出して削除
      fields[removingTrack.y][removingTrack.x] = "";
    } else {
      const food = getFoodPosition(fields.length, [...newBody, newPosition]);
      fields[food.y][food.x] = "food";
    }
    fields[newPosition.y][newPosition.x] = "snake";
    newBody.unshift(newPosition); //配列の先頭に要素を追加
    setBody(newBody);
    setFields(fields);
    return true;
  };

  console.log("direction", direction);

  return (
    <div className="App">
      <header className="header">
        <div className="titleContents">
          <h1>Snake Game</h1>
          <Navigation length={body.length} difficulty={difficulty} onChangeDifficulty={onChangeDifficulty} />
        </div>
      </header>
      <main className="main">
        <Field fields={fields} />
      </main>

      <footer className="footer">
        <Btn status={status} onStart={onStart} onStop={onStop} onRestart={onRestart} />
        <ControlBtn onChage={onChangeDirection} />
      </footer>
    </div>
  );
}

export default App;
