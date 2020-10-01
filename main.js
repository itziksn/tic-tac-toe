let is_x_turn = true;

/**
 * Represents the board.
 * Empty cells as 0, X's as 1 and O's as -1.
 **/ 
let board = new Array(9);

/**
 * Holding every move done in the current game.
 */
let move_history = [];

/**
 * Setting up event listeners and initalizing new game
 */
function init() {
  document.querySelectorAll(".game-cell").forEach((el, i) => {
    el.addEventListener("click", () => 
    {
      if(board[i] == 0)
        user_move(i);
    });
  });
  new_game();
}

/**
 * Initalize a new game.
 * cleaning the UI and clearing old data
 */
function new_game() {
  board.fill(0);
  move_history = [];
  is_x_turn = true;
  document.querySelectorAll(".game-cell").forEach(el => {
    el.innerHTML = '';
    el.classList.add("empty");
  });
  update_ui();
}

function user_move(cell) {
  do_move(cell);
  if(get_current_state() != 0)
    new_game();
  else
    ai_move();
}

/**
 * @param {number} cell_index index of the cell in board array
 * @param {boolean} update_view determine whether we should update the html
 */
function do_move(cell_index, update_view = true) {
  if(board[cell_index] != 0)
    return;
  move_history.push(cell_index);
  board[cell_index] = is_x_turn ? 1 : -1;
  is_x_turn = !is_x_turn;
  if(update_view)
    update_ui();
}

function undo_move(update_view = true) {
  const last_move = move_history.pop();
  board[last_move] = 0;
  is_x_turn = !is_x_turn;
  if(update_view)
    update_ui();
}

function update_ui() {
  document.querySelectorAll(".game-cell").forEach((el, i) => {
    if(board[i] != 0) {
      el.classList.remove("empty");
      el.innerHTML = board[i] == 1 ? "X" : "O";
    } else {
      el.classList.add("empty");
      el.innerHTML = '';
    }
  });
}

function ai_move() {
  const best_move = get_best_move();
  do_move(best_move);
}

function get_best_move() {
  let best_score = -Infinity;
  let best_move = -1;
  for(let i = 0; i < board.length; ++i) {
    
    if(board[i] != 0) 
      continue;
    
    const current = minimax(i, true, -Infinity, Infinity);
    if(current > best_score) {
      best_score = current;
      best_move = i;
    }
  }
  return best_move;
}

function minimax(cell_index, maximizingPlayer, alpha, beta) {
  let result = maximizingPlayer ? Infinity : -Infinity;
  do_move(cell_index, false);
  const state = get_current_state();
  if(state != 0)
    result = state == 1 ? (maximizingPlayer ? 1 : -1) : 0;
  else {
    for(let i = 0; i < board.length; ++i) {
      if(board[i] != 0)
        continue;
      if(maximizingPlayer)
      {
        result = Math.min(minimax(i, !maximizingPlayer), result)
        alpha = Math.min(alpha, result);
      }
      else
      {
        result = Math.max(minimax(i, !maximizingPlayer), result);
        beta = Math.max(beta, result);
      }
      if(alpha >= beta)
        break;
    }
  }
  undo_move(false);
  return result;
}

/**
 * @returns 1 for win, -1 for tie and 0 otherwise.
 */
function get_current_state() {
  for(let i = 0; i < 3; ++i) {
    if(board[i * 3] != 0 
      && board[i * 3] == board[i * 3 + 1] 
      && board[i * 3] == board[i * 3 + 2])
      return 1;
    if(board[i] != 0 
      && board[i] == board[i + 3] 
      && board[i] == board[i + 6])
      return 1;
  }
  if(board[0] != 0
    && board[0] == board[4]
    && board[0] == board[8])
    return 1;
  if(board[2] != 0
    && board[2] == board[4]
    && board[2] == board[6])
    return 1;
  // if there's no empty cells - it's a draw
  if(board.every(cell => cell != 0))
    return -1;
  else
    return 0;
}
