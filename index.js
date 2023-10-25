// Main js file, everything is updated here

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // Context


canvas.width = 16 * 64; // '1024 px' tile size * map width in tiles
canvas.height = 16 * 36; // '576 px'

// Game music
let gameMusic = new sound('sounds/backgroundMusic.mp3');

// Sound to play when player wins
let winSound = new sound('sounds/winSound.wav');

const leaderboardRef = db.collection('Leaderboard');

let arrowInterval;

// Variable declaration
let parsedCollisions
let parserTrapCollisions
let trapBlocks
let collisionBlocks
let background
let winFlags
let totalTimePaused = 0
let startTime
let finalTime
let elapsed
let isPaused = false
let levelContainsArrows = false

// Amount of hourglasses grabbed
let grabedHourglasses = 0

let playerName
let leaderboard = []
let leaderboardListElement = document.getElementById("leaderboardList");
let leaderboardList

// Used to prevent animate() run more than once a session
let gameHasStartedOnce = false

const player = new Player({
  imageSrc: './img/character/idle.png',
  frameRate: 11,
  animations: {
    idleRight:{
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/character/idle.png',
    },
    idleLeft:{
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/character/idleLeft.png',
    },
    runRight:{
      frameRate: 12,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/character/run.png',
    },
    runLeft:{
      frameRate: 12,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/character/runLeft.png',
    },
    jumpRight:{
      frameRate: 1,
      frameBuffer: 1,
      loop: true,
      imageSrc: './img/character/jump.png',
    },
    jumpLeft:{
      frameRate: 1,
      frameBuffer: 1,
      loop: true,
      imageSrc: './img/character/jumpLeft.png',
    },
    fallRight:{
      frameRate: 1,
      frameBuffer: 1,
      loop: true,
      imageSrc: './img/character/fall.png',
    },
    fallLeft:{
      frameRate: 1,
      frameBuffer: 1,
      loop: true,
      imageSrc: './img/character/fallLeft.png',
    },
  }
});

let level = 1;

// List of the levels
// Here, initial details of each level are set and called when transitioning to the level
let levels = {
  // Level 1
  1: {
    init: () => {
      player.hasWon = false;
      player.hasBeatLevel = false;
      // Parses map into 2D array, adds colllision blocks
      parsedCollisions = collisionsLevel1.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks

      // This level has not traps
      player.trapBlocks = []

      // Hourglass declaration
      hourglasses = []

      // Set initial position of player
      player.position.x = 200
      player.position.y = 400

      // Sets the background
      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/Level1PixelAdventure.png',
      })

      // No mobile traps this level
      traps = []

      // Win flag declaration
      winFlags = [
        new Sprite({
          position: {
            x: 825,
            y: 465-64,
          },
          imageSrc: './img/roomwin.png',
          frameRate: 10,
          frameBuffer: 4,
          loop: true,
          autoplay: true
        }),
      ]
    }
  },
  // Level 2
  2: {
    init: () => {
      level = 2;
      player.hasBeatLevel = false;
      // Parses map into 2D array, adds colllision blocks
      parsedCollisions = collisionsLevel2.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks

      // Parses traps (spikes)
      parserTrapCollisions = spikesLevel2.parse2D();
      trapBlocks = parserTrapCollisions.createTrapsFrom2D();
      player.trapBlocks = trapBlocks

      // Initial position of player
      player.position.x = 200
      player.position.y = 400
      player.hasBeatLevel = false;

      // Sets the background
      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/Level2PixelAdventure.png',
      })

      // No mobile traps this level
      traps = []

      // Hourglass declaration
      hourglasses = []

      // Win flag declaration
      winFlags = [
        new Sprite({
          position: {
            x: 830,
            y: 448-48,
          },
          imageSrc: './img/roomwin.png',
          frameRate: 10,
          frameBuffer: 4,
          loop: true,
          autoplay: true
        }),
      ]

    }
  },
  // Level 3
  3: {
    init: () => {
      level = 3;
      player.hasBeatLevel = false;
      // Parses map into 2D array, adds colllision blocks
      parsedCollisions = collisionsLevel3.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks

      // Parses traps (spikes)
      parserTrapCollisions = spikesLevel3.parse2D();
      trapBlocks = parserTrapCollisions.createTrapsFrom2D();
      player.trapBlocks = trapBlocks

      // Hourglass declaration
      hourglasses = []

      // Initial position of player
      player.position.x = 200
      player.position.y = 400
      player.hasBeatLevel = false;

      // Sets the backgrouns
      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/Level3PixelAdventureBrown.png',
      })

      // Position of win flag
      winFlags = [
        new Sprite({
          position: {
            x: 830,
            y: 448-48,
          },
          imageSrc: './img/roomwin.png',
          frameRate: 10,
          frameBuffer: 4,
          loop: true,
          autoplay: true
        }),
      ]
    }
  },
  // Level 4
  4: {
    init: () => {
      level = 4;
      player.hasBeatLevel = false;
      // Parses map into 2D array, adds colllision blocks
      parsedCollisions = collisionsLevel4.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks

      // Parses traps (spikes)
      parserTrapCollisions = spikesLevel4.parse2D();
      trapBlocks = parserTrapCollisions.createTrapsFrom2D();
      player.trapBlocks = trapBlocks

      // Hourglass declaration
      hourglasses = []

      // Sets up mobile traps, saws
      traps = [
        new Saw({
          imageSrc: './img/traps/onSaw.png',
          frameRate: 8,
          animations: {},
          x: 418.0,
          y: 214.0,
        }),
      ]

      // Initial position of player
      player.position.x = 200
      player.position.y = 400
      player.hasBeatLevel = false;

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/Level4PixelAdventurePink.png',
      })

      // Win flag declaration
      winFlags = [
        new Sprite({
          position: {
            x: 830,
            y: 448-48,
          },
          imageSrc: './img/roomwin.png',
          frameRate: 10,
          frameBuffer: 4,
          loop: true,
          autoplay: true
        }),
      ]
    }
  },
  // Level 5
  5: {
    init: () => {
      level = 5;
      player.hasBeatLevel = false;
      // Parses map into 2D array, adds colllision blocks
      parsedCollisions = collisionsLevel5.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks

      player.trapBlocks = []

      // Sets up mobile traps, saws
      traps = [
        new Saw({
          imageSrc: './img/traps/onSaw.png',
          frameRate: 8,
          animations: {},
          x: 387.0,
          y: 214.0,
        }),
        new Saw({
          imageSrc: './img/traps/onSaw.png',
          frameRate: 8,
          animations: {},
          x: 515.0,
          y: 214.0,
        }),
        new Saw({
          imageSrc: './img/traps/onSaw.png',
          frameRate: 8,
          animations: {},
          x: 643.0,
          y: 214.0,
        }),
      ]

      // Hourglass declaration
      hourglasses = []

      // Initial position of player
      player.position.x = 200
      player.position.y = 400
      player.hasBeatLevel = false;

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/Level5PixelAdventure.png',
      })

      // Win flag declaration
      winFlags = [
        new Sprite({
          position: {
            x: 875,
            y: 448-48,
          },
          imageSrc: './img/roomwin.png',
          frameRate: 10,
          frameBuffer: 4,
          loop: true,
          autoplay: true
        }),
      ]
    }
  },
  // Level 6
  6: {
    init: () => {
      level = 6;
      player.hasBeatLevel = false;
      // Parses map into 2D array, adds colllision blocks
      parsedCollisions = collisionsLevel6.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks

      // Parses traps (spikes)
      parserTrapCollisions = spikesLevel6.parse2D();
      trapBlocks = parserTrapCollisions.createTrapsFrom2D();
      player.trapBlocks = trapBlocks

      // Sets up mobile traps, saws
      traps = [
        new Saw({
          imageSrc: './img/traps/onSaw.png',
          frameRate: 8,
          animations: {},
          x: 387.0,
          y: 214.0,
        }),
        new Saw({
          imageSrc: './img/traps/onSaw.png',
          frameRate: 8,
          animations: {},
          x: 515.0,
          y: 214.0,
        }),
        new Saw({
          imageSrc: './img/traps/onSaw.png',
          frameRate: 8,
          animations: {},
          x: 643.0,
          y: 214.0,
        }),
        new Saw({
          imageSrc: './img/traps/onSaw.png',
          frameRate: 8,
          animations: {},
          x: 755.0,
          y: 214.0,
        }),
      ]

      // Hourglass declaration
      hourglasses = []

      // Initial position of player
      player.position.x = 150
      player.position.y = 450
      player.hasBeatLevel = false;

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/Level6PixelAdventure.png',
      })

      // Win flag declaration
      winFlags = [
        new Sprite({
          position: {
            x: 875,
            y: 448-48,
          },
          imageSrc: './img/roomwin.png',
          frameRate: 10,
          frameBuffer: 4,
          loop: true,
          autoplay: true
        }),
      ]
    }
  },
  // Level 7
  7: {
    init: () => {
      level = 7;
      player.hasBeatLevel = false;
      // Parses map into 2D array, adds colllision blocks
      parsedCollisions = collisionsLevel7.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks

      // Parses traps (spikes)
      parserTrapCollisions = spikesLevel7.parse2D();
      trapBlocks = parserTrapCollisions.createTrapsFrom2D();
      player.trapBlocks = trapBlocks

      // Sets up mobile traps, saws
      traps = []

      // Hourglass declaration
      hourglasses = []

      // Initial position of player
      player.position.x = 150
      player.position.y = 450
      player.hasBeatLevel = false;

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/Level7PixelAdventure.png',
      })

      // Win flag declaration
      winFlags = [
        new Sprite({
          position: {
            x: 875,
            y: 448-48,
          },
          imageSrc: './img/roomwin.png',
          frameRate: 10,
          frameBuffer: 4,
          loop: true,
          autoplay: true
        }),
      ]
    }
  },
  // Level 8
  8: {
    init: () => {
      level = 8;
      player.hasBeatLevel = false;
      // Parses map into 2D array, adds colllision blocks
      parsedCollisions = collisionsLevel8.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks

      player.trapBlocks = []

      // Initial position of player
      player.position.x = 150
      player.position.y = 450



      // Sets up mobile traps, saws, spike balls, etc
      traps = [
        new SpikeBall({
          imageSrc: './img/traps/SpikedBall.png',
          frameRate: 1,
          x: 500.0,
          y: 240.0,
          chainLength: 200,
          animations: {}
        }),
      ]


      player.hasBeatLevel = false;

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/Level8PixelAdventure.png',
      })

      // Hourglass declaration
      hourglasses = []

      // Win flag declaration
      winFlags = [
        new Sprite({
          position: {
            x: 875,
            y: 448-48,
          },
          imageSrc: './img/roomwin.png',
          frameRate: 10,
          frameBuffer: 4,
          loop: true,
          autoplay: true
        }),
      ]
    }
  },
  // Level 9
  9: {
    init: () => {
      level = 9;
      player.hasBeatLevel = false;
      // Parses map into 2D array, adds colllision blocks
      parsedCollisions = collisionsLevel9.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks

      // Initial position of player
      player.position.x = 150
      player.position.y = 450



      // Sets up mobile traps, saws, spike balls, etc
      traps = []

      // Create an arrow every 1.5 seconds
      levelContainsArrows = true
      arrowInterval = setInterval(createArrow, 1500);

      function createArrow() {
        traps.push(new Arrow({
          imageSrc: './img/traps/PixelArrow.png',
          frameRate: 1,
          startX: 920.0,
          startY:   player.position.y,
          animations: {}
        }));
      }


      player.hasBeatLevel = false;

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/Level9PixelAdventure.png',
      })

      // Hourglass declaration
      hourglasses = []

      // Win flag declaration
      winFlags = [
        new Sprite({
          position: {
            x: 875,
            y: 448-48,
          },
          imageSrc: './img/roomwin.png',
          frameRate: 10,
          frameBuffer: 4,
          loop: true,
          autoplay: true
        }),
      ]
    }
  },
  // Level 10
  10: {
    init: () => {
      level = 10;
      player.hasBeatLevel = false;
      // Parses map into 2D array, adds colllision blocks
      parsedCollisions = collisionsLevel10.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks

      // Initial position of player
      player.position.x = 150
      player.position.y = 450



      // Sets up mobile traps, saws, spike balls, etc
      traps = [
        new SpikeBall({
          imageSrc: './img/traps/SpikedBall.png',
          frameRate: 1,
          x: 500.0,
          y: 255.0,
          chainLength: 200,
          animations: {}
        }),
        new SpikeBall({
          imageSrc: './img/traps/SpikedBall.png',
          frameRate: 1,
          x: 650.0,
          y: 365.0,
          chainLength: 120,
          animations: {}
        }),
        new SpikeBall({
          imageSrc: './img/traps/SpikedBall.png',
          frameRate: 1,
          x: 350.0,
          y: 365.0,
          chainLength: 120,
          animations: {}
        }),
      ]

      levelContainsArrows = false
      clearInterval(arrowInterval);


      player.hasBeatLevel = false;

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/Level10PixelAdventure.png',
      })

      // Hourglass declaration
      hourglasses = []

      // Win flag declaration
      winFlags = [
        new Sprite({
          position: {
            x: 875,
            y: 448-48,
          },
          imageSrc: './img/roomwin.png',
          frameRate: 10,
          frameBuffer: 4,
          loop: true,
          autoplay: true
        }),
      ]
    }
  },
  // Level 11
  11: {
    init: () => {
      level = 11;
      player.hasBeatLevel = false;
      // Parses map into 2D array, adds colllision blocks
      parsedCollisions = collisionsLevel11.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks

      // Initial position of player
      player.position.x = 150
      player.position.y = 450



      // Sets up mobile traps, saws, spike balls, etc
      // Sets up mobile traps, saws
      traps = [
        new Saw({
          imageSrc: './img/traps/onSaw.png',
          frameRate: 8,
          animations: {},
          x: 387.0,
          y: 214.0,
        }),
        new Saw({
          imageSrc: './img/traps/onSaw.png',
          frameRate: 8,
          animations: {},
          x: 643.0,
          y: 214.0,
        }),
        new Saw({
          imageSrc: './img/traps/onSaw.png',
          frameRate: 8,
          animations: {},
          x: 755.0,
          y: 214.0,
        }),
      ]

      levelContainsArrows = false
      clearInterval(arrowInterval);

      player.hasBeatLevel = false;

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/Level11PixelAdventure.png',
      })

      // Hourglass declaration
      hourglasses = [
        new Sprite({
          position: {
            x: 522,
            y: 210,
          },
          imageSrc: './img/objects/PixelHourglass.png',
          frameRate: 1,
          frameBuffer: 1,
          loop: false,
          autoplay: false
        }),
      ]

      // Win flag declaration
      winFlags = [
        new Sprite({
          position: {
            x: 875,
            y: 448-48,
          },
          imageSrc: './img/roomwin.png',
          frameRate: 10,
          frameBuffer: 4,
          loop: true,
          autoplay: true
        }),
      ]
    }
  },
  // Level 12
  12: {
    init: () => {
      level = 12;
      player.hasBeatLevel = false;
      // Parses map into 2D array, adds colllision blocks
      parsedCollisions = collisionsLevel12.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks

      // Initial position of player
      player.position.x = 150
      player.position.y = 450



      // Sets up mobile traps, saws, spike balls, etc
      // Sets up mobile traps, saws
      traps = []

      // Create an arrow every 1 second
      levelContainsArrows = true
      arrowInterval = setInterval(createArrow, 1000);

      function createArrow() {
        traps.push(new Arrow({
          imageSrc: './img/traps/PixelArrow.png',
          frameRate: 1,
          startX: 920.0,
          startY:   player.position.y,
          animations: {}
        }));
      }


      player.hasBeatLevel = false;

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/Level12PixelAdventure.png',
      })

      // Hourglass declaration
      hourglasses = [
        new Sprite({
          position: {
            x: 522,
            y: 210,
          },
          imageSrc: './img/objects/PixelHourglass.png',
          frameRate: 1,
          frameBuffer: 1,
          loop: false,
          autoplay: false
        }),
      ]

      // Win flag declaration
      winFlags = [
        new Sprite({
          position: {
            x: 875,
            y: 448-48,
          },
          imageSrc: './img/roomwin.png',
          frameRate: 10,
          frameBuffer: 4,
          loop: true,
          autoplay: true
        }),
      ]
    }
  },
  // Level 13, win screen
  13: {
    init: () => {
      level = 13;
      levelContainsArrows = false
      clearInterval(arrowInterval);

      showWinScreen();
    }
  }

}

// Keeping track of what keys are pressed helps with player movement
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

// Overlay when transitioning level
const overlay = {
  opacity: 0,
}

// Main game function loop
function animate() {
  window.requestAnimationFrame(animate);

  // Draw collision blocks
  background.draw();
  collisionBlocks.forEach( (collisionBlock) => {
    collisionBlock.draw();
  });

  // Draw flag
  winFlags.forEach( (winFlag) => {
    winFlag.draw();
  });

  // Draw hourglasses
  hourglasses.forEach( (hourglass) => {
    hourglass.draw();
  });

  // Update and draw each moving traps
  traps.forEach( (trap) => {
    trap.update();
  });

  // Check for user input and handle it
  player.handleInput(keys);

  // Draw player sprite
  player.draw();

  // Update player position, hitbox, etc
  player.update();

  // Check if player reached flag to go to next level
  // Takes in the win flag, current level, and list of levels
  player.checkForWinFlag(winFlags[0], level, levels);

  // Check for collision with a moving trap
  // Takes in moving the traps of the current level
  // Stop checking after player won
  if(player.hasWon == false){
    player.checkForCollisionWithMovingTraps(traps);
  }


  // Check for collision with Hourglass
  player.checkForCollisionWithHourglass(hourglasses)

  // Resets canvas
  c.save()
  c.globalAlpha = overlay.opacity
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.restore()

  // draw the time if game is not paused
  if(!isPaused){
    drawElapsedTime();
    drawPauseInstructions();
  }

}

// Start game function when start game button is hit
function startGame() {
  player.hasWon = false
  // Make sure screen is visible
  gsap.to(overlay, {
    opacity: 0,
  })
  // Check if user entered a name
  playerName = document.getElementById('playerName').value;
	if(!playerName) return alert('Please enter your name!');

  gameMusic.play();

  toggleScreen('start-screen', false);
  toggleScreen('canvas', true);
  levels[level].init()
  startTime = new Date();
  totalTimePaused = 0
  if(!gameHasStartedOnce){
    animate()
    gameHasStartedOnce = true
  }
}

// Resume game button function
// Calles by the resume button in the pause menu
function resumeGame() {
  // Get time when game was paused and substract from start time
  totalTimePaused = parseInt((new Date)/1000) - totalTimePaused
  console.log("Game paused for: " + totalTimePaused + " seconds")
  toggleScreen('pause-screen', false);
  toggleScreen('canvas', true);
  isPaused = false
  gameMusic.play();
}

// Reset game button function
// Called by the restart game button in index.html
function restartGame() {
  player.hasWon = false
  gameMusic.play();
  gsap.to(overlay, {
    opacity: 0,
  })
  startTime = new Date();
  totalTimePaused = 0
  level = 1
  isPaused = false
  toggleScreen('start-screen', false);
  toggleScreen('win-screen', false);
  toggleScreen('pause-screen', false);
  toggleScreen('canvas', true);
  toggleScreen('how-to-play', false);

  levels[level].init()

}

// Return to main menu button function
// Called by the go back to main button in pause menu and win screen
function goToStartScreen(){
  startTime = new Date();
  totalTimePaused = 0
  level = 1
  isPaused = false
  toggleScreen('win-screen', false);
  toggleScreen('pause-screen', false);
  toggleScreen('canvas', false);
  toggleScreen('start-screen', true);
  toggleScreen('how-to-play', false);
  gameMusic.stop();
}

// Go to instructions screen
// Called by instructions button in main menu
function goToInstructionsScreen(){
  toggleScreen('win-screen', false);
  toggleScreen('pause-screen', false);
  toggleScreen('canvas', false);
  toggleScreen('start-screen', false);
  toggleScreen('how-to-play', true);
}

// Pause game function (Esc key)
function pauseGame() {
  isPaused = true
  // Get time at when game was paused
  totalTimePaused = parseInt((new Date)/1000)
  toggleScreen('start-screen', false);
  toggleScreen('canvas', false);
  toggleScreen('pause-screen', true);
  toggleScreen('how-to-play', false);
  gameMusic.stop();

}

// Toggles screen between show and no show
function toggleScreen(id, toggle){
  let element = document.getElementById(id);
  let display = (toggle) ? 'block' : 'none';
  element.style.display = display;
}


// Timer functions
// Called by main animate function to display the time
function drawElapsedTime(){
      elapsed = parseInt((new Date() - startTime)/1000) - totalTimePaused - (grabedHourglasses * (10))
      c.save();
      c.beginPath();
      c.fillStyle="red";
      c.font="20px Verdana"
      // draw the running time at half opacity
      c.globalAlpha=0.80;
      c.fillText(elapsed+" secs",canvas.width-100,25);
      c.restore();
    }

// Draws the top left text telling user to press Esc to pase the game
function drawPauseInstructions(){
      c.save();
      c.beginPath();
      c.fillStyle="red";
      c.font="20px Verdana"
      // draw the running time at half opacity
      c.globalAlpha=0.80;
      c.fillText('Press the ESC key to pause the game',100,25);
      c.restore();
    }

  // Called when game is beat
  // Called by level 13 when level 12 is passed
  function drawFinalScore(){
      // set the final score just once
      if(finalTime==null){ finalTime=parseInt((new Date() - startTime)/1000); }
      c.save();
      c.beginPath();
      c.fillStyle="red";
      c.font="30px Verdana"
      c.fillText("Game Over: "+finalTime+" secs",50,35);
      c.restore();
  }

 // Win screen function
 // Called when game is beat
 function showWinScreen() {
   gameMusic.stop();
   winSound.play();
   player.hasWon = true;

   // Get final time
   finalTime=parseInt((new Date() - startTime)/1000) - totalTimePaused;

   // Add player to leaderboard
   addPlayerToLeaderboard(finalTime);

   // Add score to leaderboard
   localStorage.setItem(playerName, finalTime);

   // Display final time
   document.getElementById("timeElapsedSpan").innerHTML = finalTime;
   toggleScreen('canvas', false);
   toggleScreen('win-screen', true);

   // Get top 10 scores from DB
   const query = leaderboardRef.orderBy('Score').limit(10);

   // Display leaderboard from firebase
   query.get().then(scores => {
     scores.forEach(doc => {
       data = doc.data();
       node = document.createElement('li');
       textnode = document.createTextNode(data.Name + ': ' + data.Score + ' seconds');
       node.appendChild(textnode);
       document.getElementById('leaderboardList').appendChild(node);
     })
   })

 }

// Adds players to leaderboard stored on Firebase
// Called by showWinScreen function
 function addPlayerToLeaderboard(finalTime){
   db.collection('Leaderboard').add({
        Name: playerName,
        Score: finalTime
        });
      }

  // Adds sounds
  // Called by the different sounds created in the game
  function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}
