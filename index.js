import io from 'socket.io-client';

const socket = io('http://localhost:3000'),
    userName = 'RodCastro' + Math.floor(Math.random() * 20),
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
    // TODO: Make a 'smart' move
    const mov = Math.floor(Math.random() * 64) + 0;

    socket.emit('play', {
        tournament_id: tournamentID,
        player_turn_id: playerTurnID,
        game_id: gameID,
        movement: mov
    }
    );
});
socket.on('finish', function (data) {
    socket.emit('player_ready', {
        tournament_id: tournamentID,
        game_id: data.game_id,
        player_turn_id: data.player_turn_id,

    });

});