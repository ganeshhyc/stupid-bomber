const joined = new Map();
let joinedIds = [];

const socketIO = io('https://lime-quasar-minibus.glitch.me', { transports : ['websocket'] });
let myId = null;

socketIO.on('connection', (socket) => {
    console.log('a user connected');
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

socketIO.on('path:disconnected', (id) => {
    joinedIds = joinedIds.filter(j => j!==id);
});

socketIO.on('path:joined', (joinedArray) => {
    joinedIds = [];
    joinedArray.forEach(player => {
        if(player.id!==myId){
            joinedIds.push(player.id)
            joined.set(player.id, {x: player.x, y: player.y})
        }
    });
});

window.onbeforeunload = function(e) {
    // socketIO.disconnect();
    socketIO.emit('disconnect',myId);
};

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