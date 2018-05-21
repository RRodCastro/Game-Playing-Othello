
const search_positions = {
    up: { x: -1, y: 0 },
    down: { x: 1, y: 0 },
    left: { x: 0, y: -1 },
    rigth: { x: 0, y: 1 },
    upper_right: { x: -1, y: 1 },
    upper_left: { x: -1, y: -1 },
    bottom_right: { x: 1, y: 1 },
    bottom_left: { x: 1, y: -1 }
}
const players = {
    BLACK: 1,
    WHITE: 2
}
const checkColorChange = (changeColor, board, opponent, x, y) => {
    return (!changeColor && board[x][y] === opponent);
}
const checkEmpty = (changeColor, board, x, y, color) => {
    return (changeColor && board[x][y] === 0)
}
const checkColor = (changeColor, board, x, y, color) => {
    return (changeColor && board[x][y] === color)
}

export const parseBoard = (board) => {
    let new_board = []
    for (let i = 0; i < board.length / 8; i++) {
        new_board.push(board.slice(i * 8, i * 8 + 8))
    }
    return new_board
}
const getNextMove = (search_position, row, column, opponent, board) => {
    return Object.keys(search_position).filter((position) => {
        const current = search_position[position]
        if (!!board[row + current.x] && !!board[column + current.y]
            && opponent === board[row + current.x][column + current.y]) {
            return true;
        }
    })
}
export const getValidMoves = (array_board, player) => {
    const opponent = player === players.BLACK ? players.WHITE : players.BLACK
    const board = parseBoard(array_board);
    const posible_moves = {};
    board.map((_, row) => {
        _.map((element, column) => {
            const legal_moves = isLegalMove(board, row, column, element, player, opponent);
            if (legal_moves.length > 0) {
                // posible_moves.push(row * 8 +column)
                posible_moves[`${row},${column}`] = legal_moves.join();
            }
        })
    })
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
        if (type.indexOf('up') > -1) {
            found_move = checkUp(row, column, board, player, opponent)
            found_move ? possible_moves.push('up') : ''
        }
        if (type.indexOf('down') > -1) {
            found_move = checkDown(row, column, board, player, opponent)
            found_move ? possible_moves.push('down') : ''
        }
        if (type.indexOf('left') > -1) {
            found_move = checkLeft(row, column, board, player, opponent)
            found_move ? possible_moves.push('left') : ''
        }
        if (type.indexOf('rigth') > -1) {
            found_move = checkRight(row, column, board, player, opponent)
            found_move ? possible_moves.push('rigth') : ''
        }
        if (type.indexOf('upper_right') > -1) {
            found_move = upperRight(row, column, board, player, opponent)
            found_move ? possible_moves.push('upper_right') : ''
        }

        if (type.indexOf('upper_left') > -1) {
            found_move = upperLeft(row, column, board, player, opponent)
            found_move ? possible_moves.push('upper_left') : ''
        }

        if (type.indexOf('bottom_right') > -1) {
            found_move = bottomRight(row, column, board, player, opponent)
            found_move ? possible_moves.push('bottom_right') : ''
        }

        if (type.indexOf('bottom_left') > -1) {
            found_move = bottomLeft(row, column, board, player, opponent)
            found_move ? possible_moves.push('bottom_left') : ''
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
        const change_color_check = checkColorChange(changeColor, board, opponent, x, column)
        change_color_check ? changeColor = change_color_check : '';
    }

    return false;
}

const checkUp = (row, column, board, color, opponent) => {
    let changeColor = false;
    for (let x = row - 1; x >= 0; x--) {
        const check_empty = checkEmpty(changeColor, board, x, column, color)
        if (check_empty) { return !check_empty }
        const check_color = checkColor(changeColor, board, x, column, color)
        if (check_color) { return check_color }
        const change_color_check = checkColorChange(changeColor, board, opponent, x, column)
        change_color_check ? changeColor = change_color_check : '';
    }

    return false;
}
const checkLeft = (row, column, board, color, opponent) => {
    let changeColor = false;
    for (let y = column - 1; y >= 0; y--) {
        const check_empty = checkEmpty(changeColor, board, row, y, color)
        if (check_empty) { return !check_empty }
        const check_color = checkColor(changeColor, board, row, y, color)
        if (check_color) { return check_color }
        const change_color_check = checkColorChange(changeColor, board, opponent, row, y)
        change_color_check ? changeColor = change_color_check : '';
    }
    return false;
}

const checkRight = (row, column, board, color, opponent) => {
    let changeColor = false;
    for (let y = column + 1; y < 8; y++) {
        const check_empty = checkEmpty(changeColor, board, row, y, color)
        if (check_empty) { return !check_empty }
        const check_color = checkColor(changeColor, board, row, y, color)
        if (check_color) { return check_color }
        const change_color_check = checkColorChange(changeColor, board, opponent, row, y)
        change_color_check ? changeColor = change_color_check : '';
    }
    return false;
}
const bottomLeft = (row, column, board, color, opponent) => {
    let changeColor = false;
    let y = column - 1;
    for (let x = row + 1; x < 8 && y >= 0; x++) {
        const check_empty = checkEmpty(changeColor, board, x, y, color)
        if (check_empty) { return !check_empty }
        const check_color = checkColor(changeColor, board, x, y, color)
        if (check_color) { return check_color }
        const change_color_check = checkColorChange(changeColor, board, opponent, x, y)
        change_color_check ? changeColor = change_color_check : '';
        y--;
    }

    return false;
}

const bottomRight = (row, column, board, color, opponent) => {
    let changeColor = false;
    let y = column + 1;
    for (let x = row + 1; x < 8 && y < 8; x++) {
        const check_empty = checkEmpty(changeColor, board, x, y, color)
        if (check_empty) { return !check_empty }
        const check_color = checkColor(changeColor, board, x, y, color)
        if (check_color) { return check_color }
        const change_color_check = checkColorChange(changeColor, board, opponent, x, y)
        change_color_check ? changeColor = change_color_check : '';
        y++;
    }

    return false;
}

const upperLeft = (row, column, board, color, opponent) => {
    let changeColor = false;
    let y = column - 1;
    for (let x = row - 1; x >= 0 && y >= 0; x--) {
        const check_empty = checkEmpty(changeColor, board, x, y, color)
        if (check_empty) { return !check_empty }
        const check_color = checkColor(changeColor, board, x, y, color)
        if (check_color) { return check_color }
        const change_color_check = checkColorChange(changeColor, board, opponent, x, y)
        change_color_check ? changeColor = change_color_check : '';
        y--;
    }

    return false;
}

const upperRight = (row, column, board, color, opponent) => {
    let changeColor = false;
    let y = column + 1;
    for (let x = row - 1; x >= 0 && y > 0; x--) {
        const check_empty = checkEmpty(changeColor, board, x, y, color)
        if (check_empty) { return !check_empty }
        const check_color = checkColor(changeColor, board, x, y, color)
        if (check_color) { return check_color }
        const change_color_check = checkColorChange(changeColor, board, opponent, x, y)
        change_color_check ? changeColor = change_color_check : '';
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
        if (!change_color) {
            return flipped_positions
        }
    }
}
export const makeFlips = (board, valid_movement, player) => {
    const position = valid_movement[0].split(',')
    let y = parseInt(position[1])
    let x = parseInt(position[0])
    const moves = valid_movement[1].split(',')
    const moves_keys = Object.keys(search_positions)
    let flipped_positions = []
    let flipped_board = board.slice()
    flipped_board[x][y] = player
    moves.map((move) => {
        if (move.indexOf(move) > -1) {
            const flips = searchFlips(board, x, y, search_positions[move], player)
            flips.map((flip) => {
                flipped_board[flip[0]][flip[1]] = player;
            })
        }
    })
    return flipped_board
}