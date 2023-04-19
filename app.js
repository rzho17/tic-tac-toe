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

  const switchPlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;

    return activePlayer;
  };

  const endGame = () => {
    player1 = "";
    player2 = "";

    gridCell.forEach((cell) => {
      cell.removeEventListener("click", getMarker);
    });
  };

  const restart = () => {
    player1 = "x";
    player2 = "o";
    activePlayer = player2;

    gridCell.forEach((cell) => {
      cell.addEventListener("click", getMarker);
    });
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

    const xValues = gameBoard.board.reduce((a, e, i) => {
      if (e === "x") a.push(i);
      return a;
    }, []);

    const oValues = gameBoard.board.reduce((a, e, i) => {
      if (e === "o") a.push(i);
      return a;
    }, []);

    for (let i = 0; i < winningCombo.length; i++) {
      for (let j = 0; j < winningCombo[i].length; j++) {
        if (winningCombo[i].every((v) => xValues.includes(v))) {
          endGame();
          console.log("x wins");
        } else if (winningCombo[i].every((v) => oValues.includes(v))) {
          console.log("o wins");
          endGame();
        }
        if (
          !gameBoard.board.includes("") &&
          !winningCombo[i].every((v) => xValues.includes(v)) &&
          !winningCombo[i].every((v) => oValues.includes(v))
        ) {
          endGame();
        }
      }
    }
  };

  const playRound = () => {
    console.log(`It is player ${activePlayer}'s turn`);

    render.makeGrid();
    checkWin();
  };

  return { switchPlayer, playRound, endGame, restart };
})();

const screenController = (() => {
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "reset";

  gameContainer.append(resetBtn);

  const resetGame = () => {
    gameBoard.reset();
    render.makeGrid();
    gameFlow.restart();
  };

  const displayWinner = (results) => {
    const h1 = document.createElement("h1");
    gameContainer.append(h1);

    h1.textContent = results;
  };

  resetBtn.addEventListener("click", resetGame);

  return { resetGame, displayWinner };
})();
