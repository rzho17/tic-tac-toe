//store game board as an array inside of a gameboard object
//goal is to use as little global values as possible
//put the majority of content in side the objects to make them private, return them as objects if we want to able to edit the content inside
//use modules for one time activities: create gameboard/display the controllers
//use factories for multiple use cases: creating players

//gameboard will store information about the game
//create private functions to add array content inside the box

const gameContainer = document.querySelector("main");
const gridCell = document.querySelectorAll(".cell");

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  const marker = (index, value) => {
    if (board[index] === "" && board[index] !== "x" && board[index] !== "o") {
      board[index] = value;
    }
  };

  const checkWin = (arr) => {
    const winningCombo = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const tempArr = board.reduce((a, e, i) => {
      if (e === "x") a.push(i);
      return a;
    }, []);

    console.log(tempArr);

    for (let i = 0; i < winningCombo.length; i++) {
      for (let j = 0; j < winningCombo[i].length; j++) {
        console.log(winningCombo[i].every((v) => tempArr.includes(v)));

        if (winningCombo[i].every((v) => tempArr.includes(v))) {
          console.log("x wins");
        }
      }
    }
  };

  const getBoard = () => board;

  return { board, reset, getBoard, marker, checkWin };
})();

const render = (() => {
  const makeGrid = () => {
    gridCell.forEach((index) => {
      gridCell[index.dataset.value].textContent =
        gameBoard.board[index.dataset.value];
    });
  };

  return { makeGrid };
})();

const gameFlow = (() => {
  let player1 = "x";
  let player2 = "o";

  let activePlayer = player2;

  const switchPlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;

    return activePlayer;
  };

  const playRound = () => {
    console.log(`It is player ${activePlayer}'s turn`);

    render.makeGrid();
  };

  return { switchPlayer, playRound };
})();

const screenController = (() => {
  gridCell.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      gameBoard.marker(e.target.dataset.value, gameFlow.switchPlayer());
      gameFlow.playRound();
      //   render.makeGrid();
    });
  });
})();
