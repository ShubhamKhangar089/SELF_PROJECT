import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    // Optional room code so players can join via a shareable ID
    roomCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // Players for this game: X and O are user references
    players: {
      x: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      o: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },

    // Flat 3x3 board represented as an array of 9 cells: '', 'X' or 'O'
    board: {
      type: [String],
      default: ['', '', '', '', '', '', '', '', ''],
      validate: {
        validator: (val) => Array.isArray(val) && val.length === 9,
        message: 'Board must be an array of length 9',
      },
    },

    // Whose turn it is: 'X' or 'O'
    currentTurn: {
      type: String,
      enum: ['X', 'O'],
      default: 'X',
    },

    // Game lifecycle status
    status: {
      type: String,
      enum: ['waiting', 'in_progress', 'finished'],
      default: 'waiting',
    },

    // Winner: 'X', 'O' or 'draw' when finished
    winner: {
      type: String,
      enum: ['X', 'O', 'draw', null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model('Game', gameSchema);

export default Game;
