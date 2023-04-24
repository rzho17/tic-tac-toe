const body = document.querySelector("body");
const h1 = document.querySelector("h1");
const gameContainer = document.querySelector("main");
const gridCell = document.querySelectorAll(".cell");
const singleCell = document.querySelectorAll(".cell");
const form = document.querySelector("form");

let tempImg;
let foundWinner = false;

let xImg = "url(img/x.png)";
let oImg = "url(img/o.png)";

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  //places a marker on the board array as long as the current marker doesn't contain an x or o
  const marker = (index, value) => {
    if (board[index] === "" && board[index] !== "x" && board[index] !== "o") {
      board[index] = value;
    }
  };

  const getBoard = () => board;

  return { board, reset, getBoard, marker };
})();

//renders the board on to the grid
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
  //create elements to hold values for later on
  const playerTurn = document.createElement("div");
  playerTurn.textContent = "";
  playerTurn.className = "playerTurn";
  const showWinner = document.createElement("h2");
  showWinner.textContent = "";
  showWinner.className = "showWinner";
  let p1Choice = "x";
  let p2Choice = "o";
  let counter = 0;

  let tempPlayer;
  let activePlayer = p2Choice;

  //   console.log(formData.getAll());

  let p1Name = "x";
  let p2Name = "o";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    p1Name = formData.get("p1");
    p2Name = formData.get("p2");
  });

  //function to get the value of the grid cell clicked
  function getMarker(e) {
    //checks if the board cell clicked is empty, places the player marker and switches the player, begins the game
    if (gameBoard.board[e.target.dataset.value] === "") {
      gameBoard.marker(e.target.dataset.value, gameFlow.switchPlayer());
      gameFlow.playRound();
    }
  }

  //adds functionality to each cell
  gridCell.forEach((cell) => {
    cell.addEventListener("click", getMarker);
  });

  const displayWinner = (results) => {
    body.append(showWinner);

    playerTurn.textContent = `The winner is: ${results}`;
  };

  //displays upcoming player turn on board
  const switchImg = (img) => {
    gridCell.forEach((cell) => {
      cell.addEventListener("mouseover", (e) => {
        if (
          gameBoard.board[e.target.dataset.value] !== "x" &&
          gameBoard.board[e.target.dataset.value] !== "o"
        )
          e.target.style.backgroundImage = img;
      });
      cell.addEventListener("mouseleave", (e) => {
        e.target.style.backgroundImage = "none";
      });
      cell.addEventListener("mouseup", (e) => {
        e.target.style.backgroundImage = "none";
      });
    });
  };

  //switches the active player, if the current player is active to the set player it will switch to the other player
  const switchPlayer = () => {
    activePlayer = activePlayer === p1Choice ? p2Choice : p1Choice;

    return activePlayer;
  };

  // ends the game by removing values the event listeners from each cell and resets the counter/display winner
  const endGame = (results) => {
    counter = 0;

    gridCell.forEach((cell) => {
      cell.removeEventListener("click", getMarker);
    });

    foundWinner = true;
    displayWinner(results);
  };

  //resets everything to initial values
  const restart = () => {
    p1Choice = "x";
    p2Choice = "o";
    activePlayer = p2Choice;
    tempPlayer = "";
    foundWinner = false;
    tempImg = "";

    gridCell.forEach((cell) => {
      cell.addEventListener("click", getMarker);
    });

    showWinner.textContent = "";
    playerTurn.textContent = "";
    showWinner.remove();
    playerTurn.remove();
    switchImg();
  };

  //Will run each time an action happens to check if a player has reached the winning condition.
  const checkWin = () => {
    //Every possible winning combination based off of the array indexes of the board.
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

    //creates an array to hold the indexes which contain an X in gameBoard.board's array.
    const xValues = gameBoard.board.reduce((arr, compare, i) => {
      if (compare === "x") arr.push(i);
      return arr;
    }, []);

    //Same as above but for o values.
    const oValues = gameBoard.board.reduce((arr, compare, i) => {
      if (compare === "o") arr.push(i);
      return arr;
    }, []);

    //Loops through each winning combo and compares it to the created X and O arrays.
    for (let i = 0; i < winningCombo.length; i++) {
      for (let j = 0; j < winningCombo[i].length; j++) {
        //Will see if any of the winning combo arrays are stored in the X/O created array.
        //If the values return true, that means that player has won.
        if (winningCombo[i].every((v) => xValues.includes(v))) {
          counter += 1;
          if (counter > 1) {
            endGame(p1Name);
            break;
          }
        } else if (winningCombo[i].every((v) => oValues.includes(v))) {
          counter += 1;
          if (counter >= 1) {
            endGame(p2Name);
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

  const currentPlayerDisplay = () => {
    currentPlayerHolder().append(playerTurn);
    playerTurn.className = "activePlayer";

    tempPlayer = tempPlayer === p2Name ? p1Name : p2Name;
    playerTurn.textContent = `It is ${tempPlayer}'s turn`;
  };

  // gameContainer.addEventListener("click", (e) => {
  //   console.log(foundWinner);
  // });
  const playRound = () => {
    currentPlayerDisplay();
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
    foundWinner,
    switchImg,
  };
})();

const screenController = (() => {
  const resetBtn = document.createElement("button");
  resetBtn.className = "reset";
  resetBtn.textContent = "reset";

  body.append(resetBtn);

  const resetGame = () => {
    gameBoard.reset();
    render.makeGrid();
    gameFlow.restart();
    // screenController.blah(xImg);
  };

  gameContainer.addEventListener("click", (e) => {
    gameFlow.switchImg(xImg);
    tempImg = tempImg === oImg ? xImg : oImg;
    gameFlow.switchImg(tempImg);
  });

  gameContainer.addEventListener("click", (e) => {
    if (foundWinner === true) {
      console.log(foundWinner);
      gameFlow.switchImg("none");
    }
  });

  resetBtn.addEventListener("click", resetGame);

  return { resetGame };
})();
