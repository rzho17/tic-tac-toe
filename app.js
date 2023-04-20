//store game board as an array inside of a gameboard object
//goal is to use as little global values as possible
//put the majority of content in side the objects to make them private, return them as objects if we want to able to edit the content inside
//use modules for one time activities: create gameboard/display the controllers
//use factories for multiple use cases: creating players

//gameboard will store information about the game
//create private functions to add array content inside the box

const body = document.querySelector("body");
const h1 = document.querySelector("h1");
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

  const getBoard = () => board;

  return { board, reset, getBoard, marker };
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
  let counter = 0;

  let activePlayer = player2;

  function getMarker(e) {
    if (gameBoard.board[e.target.dataset.value] === "") {
      gameBoard.marker(e.target.dataset.value, gameFlow.switchPlayer());
      gameFlow.playRound();
    }
  }

  gridCell.forEach((cell) => {
    cell.addEventListener("click", getMarker);
  });

  const displayWinner = (results) => {
    const h2 = document.createElement("h2");
    body.append(h2);

    h2.textContent = `The winner is: ${results}`;
  };

  const switchPlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;

    return activePlayer;
  };

  const endGame = (results) => {
    player1 = "";
    player2 = "";
    counter = 0;

    gridCell.forEach((cell) => {
      cell.removeEventListener("click", getMarker);
    });

    displayWinner(results);
  };

  const restart = () => {
    const h2 = document.querySelector("h2");
    player1 = "x";
    player2 = "o";
    activePlayer = player2;

    gridCell.forEach((cell) => {
      cell.addEventListener("click", getMarker);
    });

    h2.remove();
  };

  const checkWin = () => {
    let xWin = false;
    let oWin = false;
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

    const xValues = gameBoard.board.reduce((arr, compare, i) => {
      if (compare === "x") arr.push(i);
      return arr;
    }, []);

    const oValues = gameBoard.board.reduce((arr, compare, i) => {
      if (compare === "o") arr.push(i);
      return arr;
    }, []);

    for (let i = 0; i < winningCombo.length; i++) {
      for (let j = 0; j < winningCombo[i].length; j++) {
        if (winningCombo[i].every((v) => xValues.includes(v))) {
          counter += 1;
          if (counter > 1) {
            endGame(activePlayer);
            break;
          }
        } else if (winningCombo[i].every((v) => oValues.includes(v))) {
          counter += 1;
          if (counter >= 1) {
            endGame(activePlayer);
            break;
          }
        }
        if (
          !gameBoard.board.includes("") &&
          !winningCombo[i].every((v) => xValues.includes(v)) &&
          !winningCombo[i].every((v) => oValues.includes(v))
        ) {
          counter += 1;
          if (counter >= 22) {
            endGame(".... no one");
            console.log("draw");
          }
        }
      }
    }
  };

  const currentPlayerHolder = () => {
    const testContainer = document.createElement("div");
    h1.append(testContainer);
    return testContainer;
  };

  const playRound = () => {
    console.log(`It is ${activePlayer}'s turn`);

    const test = document.createElement("div");
    currentPlayerHolder().append(test);
    test.className = "activePlayer";

    const tempPlayer = activePlayer === player2 ? player1 : player2;
    test.textContent = `It is ${tempPlayer}'s turn`;

    render.makeGrid();
    checkWin();
  };

  return {
    switchPlayer,
    playRound,
    endGame,
    restart,
    displayWinner,
    activePlayer,
  };
})();

const screenController = (() => {
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "reset";

  body.append(resetBtn);

  const resetGame = () => {
    gameBoard.reset();
    render.makeGrid();
    gameFlow.restart();
  };

  const displayActivePlayer = (e) => {
    const test = document.querySelector(".activePlayer");
    if (
      gameBoard.board[e.target.dataset.value] !== "x" ||
      gameBoard.board[e.target.dataset.value] !== "o"
    ) {
      test.remove();
    }
  };

  gameContainer.addEventListener("mouseup", displayActivePlayer);

  resetBtn.addEventListener("click", resetGame);

  return { resetGame, displayActivePlayer };
})();
