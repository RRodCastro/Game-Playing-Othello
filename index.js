import io from 'socket.io-client';
import { parseBoard } from './moves';
import { alphaBetaSearch } from './ia';

const socket = io('http://localhost:3000'),
    userName = 'Random',
    tournamentID = 142857;

socket.on('connect', function () {
    socket.emit('signin', {
        user_name: userName,
        tournament_id: tournamentID,
        user_role: 'player'
    });
});

socket.on('ok_signin', function () {
    console.log("Successfully signed in!");
});

socket.on('ready', function (data) {
    const gameID = data.game_id;
    const playerTurnID = data.player_turn_id;
    const board = data.board;
    const movementNumber = data.movementNumber
    let new_mov;
    new_mov = Math.floor(Math.random() * 64) + 0;
    const new_board = parseBoard(board);
    console.log(new_board)
    console.log(playerTurnID)
    console.log("thinking...")
    const mov = alphaBetaSearch(new_board, playerTurnID, playerTurnID, 0, -Infinity, Infinity, movementNumber);
    const test = mov.movement[0].split(',')
    new_mov = 8 * parseInt(test[0]) + parseInt(test[1])
    console.log(new_mov)
    socket.emit('play', {
        tournament_id: tournamentID,
        player_turn_id: playerTurnID,
        game_id: gameID,
        movement: new_mov
    }
    );
});
socket.on('finish', function (data) {
    console.log("Finish")
    if (data.player_turn_id === data.winner_turn_id) {
        console.log(" + Victory!")
    }
    else {
        console.log(" - Failure")
    }
    socket.emit('player_ready', {
        tournament_id: tournamentID,
        game_id: data.game_id,
        player_turn_id: data.player_turn_id,

    });

});