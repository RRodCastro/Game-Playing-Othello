import { getOpponent, getValidMoves, makeFlips, corners, mobility, totalPieces } from './moves';
import { max_depth } from './constants';

// heuristic ideas from :
// https://courses.cs.washington.edu/courses/cse573/04au/Project/mini1/RUSSIA/Final_Paper.pdf
const clone = (board) => { return board.map((element) => { return element.slice(0) }) }


const heuristic = (board, currentPlayer, movement_number) => {
    return corners(board, currentPlayer)
}

export const alphaBetaSearch = (board, evaluatedPlayer, currentPlayer, depth, alpha, beta, movement_number) => {
    if (depth >= max_depth) {
        return { score: heuristic(board, currentPlayer, movement_number), movement: null }
    }
    const possible_moves = getValidMoves(board, currentPlayer);
    if (possible_moves.length === 0) {
        return { score: heuristic(board, currentPlayer, movement_number), movement: null }
    }
    let board_tree = []
    for (let i = 0; i < possible_moves.length; i++) {
        const move = possible_moves[i]
        const child_board = makeFlips(clone(board), move, currentPlayer)
        board_tree.push({ child_board: child_board, movement: move });
    }
    const opponenet = getOpponent(currentPlayer);
    if (evaluatedPlayer === currentPlayer) {
        return maximizePlay(board_tree, evaluatedPlayer, opponenet, depth, alpha, beta, movement_number)
    }
    else {
        return minimizePlay(board_tree, evaluatedPlayer, opponenet, depth, alpha, beta, movement_number)
    }

}

const maximizePlay = (board_tree, evaluated_player, currentPlayer, depth, alpha, beta, movement_number) => {
    let v = -Infinity;
    board_tree.forEach((board) => {
        v = Math.max(v, alphaBetaSearch(
            board.child_board,
            evaluated_player,
            currentPlayer,
            depth + 1,
            alpha,
            beta,
            movement_number
        ).score)
        alpha = Math.max(alpha, v)
        if (beta <= alpha) {
            return { score: v, movement: board.movement }
        }
    });
    let x = 0;
    let index = 0;
    board_tree.forEach((board, board_index) => {
        const temp = heuristic(board.child_board, currentPlayer, movement_number);
        if (temp > x) {
            index = board_index;
            x = temp;
        }
    });
    return { score: v, movement: board_tree[index].movement }
}

const minimizePlay = (board_tree, evaluated_player, currentPlayer, depth, alpha, beta, movement_number) => {
    let v = Infinity;
    board_tree.forEach((board) => {
        v = Math.min(v, alphaBetaSearch(
            board.child_board,
            evaluated_player,
            currentPlayer,
            depth + 1,
            alpha,
            beta,
            movement_number
        ).score)
        beta = Math.min(beta, v)
        if (beta <= alpha) {
            return { score: v, movement: board.movement }
        }
    });
    let x = Infinity;
    let index = 0;
    board_tree.forEach((board, board_index) => {
        const temp = heuristic(board.child_board, currentPlayer, movement_number);
        if (temp < x) {
            index = board_index;
            x = temp;
        }
    });
    return { score: v, movement: board_tree[index].movement }
}
