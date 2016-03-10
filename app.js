window.onload = function () {
  'use strict';
  
  // Declare variables.
  var
    // Constant color.
    BACKGROUND_COLOR, // string
    /* Displayed elements */
    // Squares that will be interactive with the user.
    squares, // td.
    // Show user if he is doing ok, or whats going on at least.
    statusMessage, // div.
    // The color that tells the user which square they should be trying to select.
    displayedColor, // div.
    // Button to start the game.
    bStartNewGame, // button
    // Button to put game in easy mode - 3 squares.
    bEasyMode, // button
    // Button to put game in hard mode - 6 squares.
    bHardMode, // button
    // The color that was randomly picked and is the color we need to find.
    pickedColor, // string
    /**************************************   WORKING ON REFACTORING CODE HERE AND COMMENTING IT ALL UP. **************************************************************/
    // The colors that the squares are shades of.
    colors, // array
    theColor,
    /* Logical Functions that either set the game's state or change the game's state. */
    // Initialize and start everything, this is the entry point to the game.
    init,
    // Set the squares and their color and their ability to receive clicks.
    setSquares,
    // Toggles between easy and hard mode.
    switchActiveMode;
  
  /* Instantiate variables. */
  // Colors
  colors = new Array(6);
  // The six square divs
  squares = document.querySelectorAll(".square");
  // Span that is displaying current color.
  displayedColor = document.querySelector('#color-display');
  // Grab the message to adjust message to user.
  statusMessage = document.querySelector("#message");
  // set the background color.
  BACKGROUND_COLOR = "#232323";
  
  /****************************************** LOGICAL FUNCTIONS ********************************************************************************************/
  // Lets change every square to a particular color.
  function changeAllSquareColors(color, theCount) {
    var i;
    for (i = 0; i < theCount; i += 1) {
      squares[i].style.background = color;
      squares[i].style.pointerEvents = "none"; // make sure we can't trigger event handler again.
    }
  }
  
  // Pick out random colors to stuff into colors.
  function pickColor() {
    var random = Math.floor(Math.random() * colors.length + 1);
    return colors[random];
  }
  
  // Get a random number 0 - 255
  function randomizeNumber() {
    return (Math.floor(Math.random() * 256)).toString();
  }
  
  // Let's select one color out of the availably set colors.
  // theCount = the size in which we set our randomizer at.
  function selectFromColors(theCount) {
    var
      // Random number 0 - 3 or 0 - 6; depends on the mode we are in.
      random,
      // Randomly chosen color from the array of colors.
      theColor;
    
    random = Math.floor(Math.random() * theCount);
    theColor = colors[random];
    return theColor;
  }
  
  // Lets generate a random rgb color.
  function generateRandomColor() {
    return "rgb(" + randomizeNumber() + ", " + randomizeNumber() + ", " + randomizeNumber() + ")";
  }
  
  /****************************************** LOGICAL FUNCTIONS ********************************************************************************************/
  // OnClick event listener function
  // color = the shade the square is set to
  // theCount = the number of squares and colors we are working with.
  function selectSquare(color, square, theCount) {
    // if the color doesn't equal the background color, register the click! - otherwise the square is shaded out.
    return function () {
      // User selected the correct color.
      if (color === pickedColor) {
        statusMessage.textContent = "Correct!"; // inform user of a job well done   
        bStartNewGame.textContent = "Play Again?";
        changeAllSquareColors(color, theCount); // turn all squares to the color that was the solution.
      } else { // User selected the wrong color.
        statusMessage.textContent = "Wrong! Try again."; // ask user to try again.
        this.classList.add("hide"); // this will allow us to face.
        this.style.background = BACKGROUND_COLOR; // remove the wrong selection.
        this.style.pointerEvents = "none"; // make sure we can't trigger event handler again.
      }
    };
  }
  
 /* Set the squares - i.e. how many are visible and interactive. 
  * isHard = true = means all 6 are visible and clickable. 
  * isHard = false = only 3 are visible and clickable.
  * return theCount = is the amount of colored squares we will be interacting with.
  */
  setSquares = function (isHard) {
    var
      // Element for iteration.
      i,
      // the count we will return.
      theCount = 0;
    
    switch (isHard) {
    case true:
      // Colors
      colors = new Array(6);
      // lets hide the last 3 of the memory game.
      for (i = squares.length - 1; i > 2; i -= 1) {
        squares[i].style.display = "block"; // To make sure they show back up set them back to block.
      }
      theCount = 6;
      break;
    case false:
      colors = new Array(3);

      // lets hide the last 3 of the memory game.
      for (i = squares.length - 1; i > 2; i -= 1) {
        squares[i].style.display = "none"; // To make sure we don't click it we set it to none
      }
      theCount = 3;
      break;
    }
    // remove the hide class from the squares.
    for (i = 0; i < squares.length; i += 1) {
      squares[i].classList.remove("hide");
    }
    return theCount;
  };
  
  /* 
  * This function must be called to start a new game, this sets the squares up, the colors up and is the central function to do everything.
  * All we need is whether the user is in hard mode or easy, we can figure out the rest.
  *
  * isHard = boolean, is this a hard game or easy?
  */
  init = function (isHard) {
    var
      // Element for iteration.
      i,
      // How many squares and how many colors.
      theCount;
    
    // set visibility and interactive of squares and the count.
    theCount = setSquares(isHard);
    
    // Stuff colors array with random colors.
    for (i = 0; i < theCount; i += 1) {
      colors[i] = generateRandomColor();
    }
    
    // Set the decided color.
    pickedColor = selectFromColors(theCount);
    // Display which color has been the picked color.
    displayedColor.textContent = pickedColor.toUpperCase();
    // Set initial message to user.
    statusMessage.textContent = "";
    
    // Change the colors of the squares.
    for (i = 0; i < theCount; i += 1) {
      // Add initial colors to squares.
      squares[i].style.backgroundColor = colors[i];
      // Add the possibility to have eventListeners
      squares[i].style.pointerEvents = "auto";
      // Add event handler to squares.
      squares[i].addEventListener("click", selectSquare(colors[i],  squares[i], theCount));
    }
  };
  
  /* Toggle which mode we are in, and toggle which btn should get the active class [which indicates which mode we are in]. */
  // theBTN = the button we have just selected. Currently is either Easy or Hard mode. 
  // isHard = whether this is hard mode or easy mode.
  switchActiveMode = function (theBTN, isHard) {
    var
      // iterator
      i,
      // Easy and Hard button modes.
      bModes;
    // grab all mode buttons (easy and hard).
    bModes = document.querySelectorAll(".mode-btn");
    for (i = 0; i < bModes.length; i += 1) {
      // we want to make sure we remove active and add active based off of the user's choice.
      if (bModes[i] !== theBTN) {
        theBTN.classList.add("active");
        bModes[i].classList.remove("active");
      }
    }
    // lets start a new game.
    init(isHard);
  };
  
  
  
  
  /***********************************************************************************************       THE GAME ************************************/
  
  // This initiates the game.
  init(true);
  
  // New Game Button
  bStartNewGame = document.querySelector("#new-game");
  // Set the New Game Button Listener
  bStartNewGame.addEventListener("click", function () {
    // count to determine which mode we are in.
    var theCount;
    // Set the text of the button to start a new game.
    bStartNewGame.textContent = "New Color";
    // Re initiate the game.
    theCount = squares.length;
    // start the game.
    if (theCount === 6) {
      init(true);
    } else {
      init(false);
    }
  });
  
  // Instantiate the mode-btns.
  bEasyMode = document.querySelector("#easy-btn");
  bHardMode = document.querySelector("#hard-btn");
  
  bHardMode.addEventListener("click", function () {
    switchActiveMode(this, true);

  });
  
  bEasyMode.addEventListener("click", function () {
    switchActiveMode(this, false);
  });
  
 
  
};