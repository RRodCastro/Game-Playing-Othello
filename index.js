import io from 'socket.io-client';
import { getValidMoves, parseBoard, makeFlips } from './moves';

const socket = io('http://localhost:3000'),
    userName = 'RodCastro' + Math.floor(Math.random() * 40),
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
    // TODO: Make a 'smart' move
    // mov = Math.floor(Math.random() * 64) + 0;
    const mov = getValidMoves(board, playerTurnID).slice(-1)[0]
    const test = mov[0].split(',')
    const new_mov = 8 * parseInt(test[0]) + parseInt(test[1])
    if (movementNumber == 0 || movementNumber == 1 || movementNumber === 2 || movementNumber === 3 || movementNumber === 4 || movementNumber === 5) {
        // console.log(makeFlips(parseBoard(board), mov, playerTurnID));

    }
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