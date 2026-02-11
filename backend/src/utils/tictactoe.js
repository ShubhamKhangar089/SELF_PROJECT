// Pure game logic helpers for Tic Tac Toe.
// No Express, no DB, easy to unit test.

/**
 * Check if a move is valid: board index is in range and empty.
 * @param {string[]} board - length 9 array of '', 'X', or 'O'
 * @param {number} index - 0..8
 */
export const isValidMove = (board, index) => {
  if (!Array.isArray(board) || board.length !== 9) return false;
  if (index < 0 || index > 8) return false;
  return board[index] === '';
};

/**
 * Apply a move and return a new board (does not mutate original).
 * Assumes the move was already validated.
 * @param {string[]} board
 * @param {number} index
 * @param {'X'|'O'} symbol
 */
export const applyMove = (board, index, symbol) => {
  const next = [...board];
  next[index] = symbol;
  return next;
};

/**
 * Determine if there is a winner or a draw.
 * @param {string[]} board
 * @returns {'X' | 'O' | 'draw' | null}
 */
export const checkWinner = (board) => {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // 'X' or 'O'
    }
  }

  // If no empty cells and no winner, it's a draw
  const hasEmpty = board.some((cell) => cell === '');
  if (!hasEmpty) {
    return 'draw';
  }

  return null;
};

/**
 * Get next player's symbol.
 * @param {'X'|'O'} currentTurn
 */
export const getNextTurn = (currentTurn) => (currentTurn === 'X' ? 'O' : 'X');


