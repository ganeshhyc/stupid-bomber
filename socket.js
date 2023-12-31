const socketIO = io('https://lime-quasar-minibus.glitch.me', { transports : ['websocket'] });
let myId = null;

const joined = new Map();
const joinedIds = [];

socketIO.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

socketIO.on('path:id', (id) => {
    if(myId){
        joined.set(id, { x: 0, y: 0 });
        joinedIds.push(id);
        socketIO.on(`path:position:${id}`, ({ x, y }) => {
            joined.set(id, { x, y })
        });
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

function changePosition(x, y) {
    socketIO.emit(`path:position`, { id: myId, x, y });
}

function sendPlayerPosition(msg){
    socketIO.emit('chat message', msg);
}