//store game board as an array inside of a gameboard object
//goal is to use as little global values as possible
//put the majority of content in side the objects to make them private, return them as objects if we want to able to edit the content inside
//use modules for one time activities: create gameboard/display the controllers
//use factories for multiple use cases: creating players

//gameboard will store information about the game
//create private functions to add array content inside the box

const gameboard = (() => {
  const gameboard = ["", "", "", "", "", "", "", "", ""];

  const reset = () => {
    Gameboard.gameboard = ["", "", "", "", "", "", "", "", ""];
  };

  const marker = (index, value) => {
    if (
      gameboard[index] === "" &&
      gameboard[index] !== "x" &&
      gameboard[index] !== "o"
    ) {
      gameboard[index] = value;
      return gameboard;
    }
    return gameboard;
  };

  const getBoard = () => gameboard;

  return { gameboard, reset, getBoard, marker };
})();

const render = (() => {
  const gridCell = document.querySelectorAll(".cell");

  const makeGrid = () => {
    gridCell.forEach((index) => {
      gridCell[index.dataset.value].textContent =
        gameboard.gameboard[index.dataset.value];
    });
  };

  return { makeGrid };
})();
