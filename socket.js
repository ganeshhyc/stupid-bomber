const socketIO = io('https://lime-quasar-minibus.glitch.me', { transports : ['websocket'] });
let myId = null;

// const joined = [];

socketIO.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

socketIO.on('path:id', (id) => {
    if(myId){
        // new join
    }else{
        myId = id;
    }
});

function join(name) {
    // if(){}
    socketIO.emit('path-join', {
        id: myId,
        name
    });

}

function sendPlayerPosition(msg){
    socketIO.emit('chat message', msg);
}