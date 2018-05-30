import { search_positions, players, bord_size, search_positions_labels } from './constants';

const checkColorChange = (changeColor, board, opponent, x, y) => {
    return (!changeColor && board[x][y] === opponent);
}
const checkEmpty = (changeColor, board, x, y, color) => {
    return (changeColor && board[x][y] === 0)
}
const checkColor = (changeColor, board, x, y, color) => {
    return (changeColor && board[x][y] === color)
}
export const getOpponent = (current_player) => {
    return current_player === players.BLACK ? players.WHITE : players.BLACK
}


export const parseBoard = (board) => {
    let new_board = []
    for (let i = 0; i < board.length / 8; i++) {
        new_board.push(board.slice(i * 8, i * 8 + 8))
    }
    return new_board
}
const getNextMove = (search_position, row, column, opponent, board) => {
    let next_moves = [];
    for (let move = 0; move < 8; move++) {
        const current = search_position[move]
        if (row + current.x < 0 || row + current.x > 7) {
            continue;
        }
        opponent === board[row + current.x][column + current.y] ? next_moves.push(search_positions_labels[move]) : ''
    }
    return next_moves;
}

export const getValidMoves = (board, player) => {
    const opponent = getOpponent(player)
    // const board = parseBoard(array_board);
    const posible_moves = {};
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            const element = board[row][column]
            const legal_moves = isLegalMove(board, row, column, element, player, opponent);
            if (legal_moves.length > 0) {
                // posible_moves.push(row * 8 +column)
                posible_moves[`${row},${column}`] = legal_moves.join();
            }
        }
    }
    return Object.entries(posible_moves)
}
const isLegalMove = (board, row, column, element, player, opponent) => {
    // Ocupped position, nothing to do
    if (element !== 0) {
        return false
    }
    const type = getNextMove(search_positions, row, column, opponent, board)
    let found_move = false;
    let possible_moves = []
    if (type.length > 0) {
        if (type.indexOf(0) > -1) {
            found_move = checkUp(row, column, board, player, opponent)
            found_move ? possible_moves.push(0) : ''
        }
        if (type.indexOf(1) > -1) {
            found_move = checkDown(row, column, board, player, opponent)
            found_move ? possible_moves.push(1) : ''
        }
        if (type.indexOf(2) > -1) {
            found_move = checkLeft(row, column, board, player, opponent)
            found_move ? possible_moves.push(2) : ''
        }
        if (type.indexOf(3) > -1) {
            found_move = checkRight(row, column, board, player, opponent)
            found_move ? possible_moves.push(3) : ''
        }
        if (type.indexOf(4) > -1) {
            found_move = upperRight(row, column, board, player, opponent)
            found_move ? possible_moves.push(4) : ''
        }

        if (type.indexOf(5) > -1) {
            found_move = upperLeft(row, column, board, player, opponent)
            found_move ? possible_moves.push(5) : ''
        }

        if (type.indexOf(6) > -1) {
            found_move = bottomRight(row, column, board, player, opponent)
            found_move ? possible_moves.push(6) : ''
        }

        if (type.indexOf(7) > -1) {
            found_move = bottomLeft(row, column, board, player, opponent)
            found_move ? possible_moves.push(7) : ''
        }

    }
    return possible_moves
}
const checkDown = (row, column, board, color, opponent) => {
    let changeColor = false;
    for (let x = row + 1; x < 8; x++) {
        const check_empty = checkEmpty(changeColor, board, x, column, color)
        if (check_empty) { return !check_empty }
        const check_color = checkColor(changeColor, board, x, column, color)
        if (check_color) { return check_color }
        checkColorChange(changeColor, board, opponent, x, column) ? changeColor = true : '';
    }

    return false;
}

const checkUp = (row, column, board, color, opponent) => {
    let changeColor = false;
    for (let x = row - 1; x >= 0; x--) {
        if (checkEmpty(changeColor, board, x, column, color)) { return false }
        if (checkColor(changeColor, board, x, column, color)) { return true }
        checkColorChange(changeColor, board, opponent, x, column) ? changeColor = true : '';
    }

    return false;
}
const checkLeft = (row, column, board, color, opponent) => {
    let changeColor = false;
    for (let y = column - 1; y >= 0; y--) {
        if (checkEmpty(changeColor, board, row, y, color)) { return false }
        if (checkColor(changeColor, board, row, y, color)) { return true }
        checkColorChange(changeColor, board, opponent, row, y) ? changeColor = true : '';
    }
    return false;
}

const checkRight = (row, column, board, color, opponent) => {
    let changeColor = false;
    for (let y = column + 1; y < 8; y++) {
        if (checkEmpty(changeColor, board, row, y, color)) { return false }
        if (checkColor(changeColor, board, row, y, color)) { return true }
        checkColorChange(changeColor, board, opponent, row, y) ? changeColor = true : '';
    }
    return false;
}
const bottomLeft = (row, column, board, color, opponent) => {
    let changeColor = false;
    let y = column - 1;
    for (let x = row + 1; x < 8 && y >= 0; x++) {
        if (checkEmpty(changeColor, board, x, y, color)) { return false }
        if (checkColor(changeColor, board, x, y, color)) { return true }
        checkColorChange(changeColor, board, opponent, x, y) ? changeColor = true : '';
        y--;
    }

    return false;
}

const bottomRight = (row, column, board, color, opponent) => {
    let changeColor = false;
    let y = column + 1;
    for (let x = row + 1; x < 8 && y < 8; x++) {
        if (checkEmpty(changeColor, board, x, y, color)) { return false }
        if (checkColor(changeColor, board, x, y, color)) { return true }
        checkColorChange(changeColor, board, opponent, x, y) ? changeColor = true : '';
        y++;
    }

    return false;
}

const upperLeft = (row, column, board, color, opponent) => {
    let changeColor = false;
    let y = column - 1;
    for (let x = row - 1; x >= 0 && y >= 0; x--) {
        if (checkEmpty(changeColor, board, x, y, color)) { return false }
        if (checkColor(changeColor, board, x, y, color)) { return true }
        checkColorChange(changeColor, board, opponent, x, y) ? changeColor = true : '';
        y--;
    }

    return false;
}

const upperRight = (row, column, board, color, opponent) => {
    let changeColor = false;
    let y = column + 1;
    for (let x = row - 1; x >= 0 && y > 0; x--) {
        if (checkEmpty(changeColor, board, x, y, color)) { return false }
        if (checkColor(changeColor, board, x, y, color)) { return true }
        checkColorChange(changeColor, board, opponent, x, y) ? changeColor = true : '';
        y++;
    }
    return false;
}
const searchFlips = (board, x, y, direction, player) => {
    let flipped_positions = []
    let change_color = false
    while (x <= 7 && x >= 0 && y >= 0 && y <= 7) {
        x += direction.x
        y += direction.y
        flipped_positions.push([x, y])

        if (board[x][y] === player) {
            change_color = true
        }
        if (change_color) {
            return flipped_positions
        }
    }
}
export const makeFlips = (board, valid_movement, player) => {
    const position = valid_movement[0].split(',')
    let y = parseInt(position[1])
    let x = parseInt(position[0])
    const moves = valid_movement[1].split(',')
    let flipped_positions = []
    board[x][y] = player
    moves.map((move) => {
        if (move.indexOf(move) > -1) {
            searchFlips(board, x, y, search_positions[move], player).map((flip) => {
                board[flip[0]][flip[1]] = player;
            })
        }
    })
    return board
}
export const totalPieces = (board, current_player) => {
    let scenarios = []
    const current_opponent = getOpponent(current_player)
    let player = 0;
    let opponent = 0
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const element = board[i][j]
            if (element === current_player) {
                player++
            }
            else if (element === current_opponent) {
                opponent++
            }
        }
    }
    return 100 * player / (player + opponent)
}
export const corners = (board, current_player) => {
    const current_opponent = getOpponent(current_player)
    let player = 0;
    let opponent = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const element = board[i][j]
            if (element === current_player &&
                (i === 0 || i === 1 || i === 6 || i === 7)
                && (j === 0 || j === 1 || j === 6 || j === 7)) {
                player + 3
            }
            else if (element == current_player) {
                player + 1;
            }
            if (element === current_opponent &&
                (i === 0 || i === 1 || i === 6 || i === 7
                    && (j === 0 || j === 1 || j === 6 || j === 7))) {
                opponent + 3
            }
            else if (element === current_opponent) {
                opponent + 1
            }

        }
    }
    if (player + opponent > 0) {
        return 100 * (player) / (player + opponent)
    }
    else {
        return 0
    }
}
export const mobility = (board, current_player) => {
    const opponenet = getOpponent(current_player);
    const player_mobility = getValidMoves(board, current_player).length;
    const opponenet_mobility = getValidMoves(board, opponenet).length;
    if (player_mobility + opponenet_mobility !== 0) {
        return 100 * (player_mobility) / (player_mobility + opponenet_mobility)
    }
    return 0;
}