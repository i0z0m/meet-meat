// Load necessary module
let keypress = require('keypress');

// Associate standard input with the keypress library
keypress(process.stdin);

// Set standard input to raw mode (to receive immediate key input)
process.stdin.setRawMode(true);

// Function to create the screen
function createScreen(rows, columns) {
  const screen = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < columns; x++) {
      row.push('︙'); // Initialize all cells with a pipe symbol
    }
    screen.push(row);
  }
  return screen;
}

// Function to draw the screen
function drawScreen() {
  console.clear(); // Clear the console to perform a fresh drawing
  for (let y = 0; y < screen.length; y++) {
    let line = '';
    for (let x = 0; x < screen[y].length; x++) {
      line += screen[y][x] + ' '; // Separate cell contents with spaces for output
    }
    console.log(line);
  }
}

// Create the initial screen
let screen = createScreen(10, 10); // Create a 10x10 screen
let playerPosition = Math.floor(screen[0].length / 2); // Set initial player position to the center
let meatPosition = Math.floor(Math.random() * screen[0].length); // Set initial meat position randomly
let meatLinePosition = 0; // Position where meat falls (vertical)

// Function to move an icon to a specific position on the screen
function move(row, col, icon) {
  if (screen[row] && screen[row][col] !== undefined) {
    screen[row][col] = icon;
  }
}

// Function to handle player movement
function playerMove(key) {
  move(screen.length - 1, playerPosition, '︙'); // Display a pipe where the player was
  if (key.name === 'left') {
    if (playerPosition > 0) {
      playerPosition -= 1; // Move the player left within the valid range
    }
  }
  if (key.name === 'right') {
    if (playerPosition < screen[0].length - 1) {
      playerPosition += 1; // Move the player right within the valid range
    }
  }
  move(screen.length - 1, playerPosition, '🙌'); // Display 'P' at the new player position
}

// Function to handle meat movement
function meatMove() {
  move(meatLinePosition - 1, meatPosition, '︙'); // Display a pipe where the meat was
  if (meatLinePosition < screen.length) {
    move(meatLinePosition, meatPosition, '🥩'); // Display meat at the new position
  }
}

// Function to check meat and player positions, determine game outcome
function meetCheck() {
  if (meatLinePosition === screen.length - 1) { // If meat reaches the bottom
    if (meatPosition === playerPosition) {
      console.log('You win!'); // You win if meat and player positions match
    } else {
      console.log('You lost!'); // You lose if they don't match
    }
    process.exit(1); // End the game
  }
}

// Function to update game state
function update(ch, key) {
  meatLinePosition += 1; // Move meat position downward
  if (key.ctrl && key.name == 'c') {
    process.exit(1); // Exit the game if Ctrl+C is pressed
  }
  meetCheck(); // Check meat and player positions
  playerMove(key); // Handle player movement
  meatMove(); // Handle meat movement
  drawScreen(); // Draw the screen
}

// Register a listener to update the game based on keyboard input
process.stdin.on('keypress', update);

// Set initial configurations and draw the screen
move(meatLinePosition, meatPosition, '🥩'); // Display initial meat position
move(screen.length - 1, playerPosition, '🙌'); // Display initial player position
drawScreen(); // Draw the screen
