let keypress = require('keypress');
keypress(process.stdin);
process.stdin.setRawMode(true);

function createScreen(rows, columns) {
  const screen = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < columns; x++) {
      row.push('|');
    }
    screen.push(row);
  }
  return screen;
}

function drawScreen() {
  console.clear();
  for (let y = 0; y < screen.length; y++) {
    let line = '';
    for (let x = 0; x < screen[y].length; x++) {
      line += screen[y][x] + ' ';
    }
    console.log(line);
  }
}

let screen = createScreen(10, 10);
let playerPosition = Math.floor(screen[0].length / 2);
let meatPosition = Math.floor(Math.random() * screen[0].length);
let meatLinePosition = 0;

function move(row, col, icon) {
  if (screen[row] && screen[row][col] !== undefined) {
    screen[row][col] = icon;
  }
}

function playerMove(key) {
  move(screen.length - 1, playerPosition, '|');
  if (key.name === 'left') {
    if (playerPosition > 0) {
      playerPosition -= 1;
    }
  }
  if (key.name === 'right') {
    if (playerPosition < screen[0].length - 1) {
      playerPosition += 1;
    }
  }
  move(screen.length - 1, playerPosition, 'P');
}

function meatMove() {
  move(meatLinePosition - 1, meatPosition, '|');
  if (meatLinePosition < screen.length) {
    move(meatLinePosition, meatPosition, '@');
  }
}

function meetCheck() {
  if (meatLinePosition === screen.length - 1) {
    if (meatPosition === playerPosition) {
      console.log('You win!');
    } else {
      console.log('You lost!');
    }
    process.exit(1);
  }
}

function update(ch, key) {
  meatLinePosition += 1;
  if (key.ctrl && key.name == 'c') {
    process.exit(1);
  }
  meetCheck();
  playerMove(key);
  meatMove();
  drawScreen();
}
process.stdin.on('keypress', update);

move(meatLinePosition, meatPosition, '@');
move(screen.length - 1, playerPosition, 'P');
drawScreen();
