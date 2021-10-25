const io=require('socket.io')(3000,{
    cors:{
        origin:['https://bikove-kravi.herokuapp.com/']
    }
});
const { Room } = require('./constructors.js');
const { Player } = require('./constructors.js');
const Constructors=require('./constructors.js');
let Rooms=new Map('',Constructors.Room);
let Users=new Map('','');

io.on('connection', socket => {
    console.log(socket.id)

    socket.on('check-for-room',(code,cb)=>
    {
        let SearchedRoom=Rooms.get(code)
        // console.log(SearchedRoom);
        if(SearchedRoom==undefined)cb(false);
        else if(SearchedRoom.players.length==SearchedRoom.size)cb(false);
        else cb(SearchedRoom);
        // io.emit('isRoomAvailable',bool)
    })

    socket.on('create-room',(name,token,code)=>{
        let id=Constructors.ID();
        let R=new Room(name,id,token);
        Rooms.set(id,R);
        code(R)
    })

    socket.on('update',(token,sID)=>{
        let id=sID;
        Users.set(token,id)
        // console.log(Users);
    })

    socket.on('join-room',(name,code,Token,roomInfo)=>
    {
        Rooms.get(code).players.push(new Player(name,Token))
        roomInfo(Rooms.get(code));
        SendUpdates(code)
    })

    socket.on('leave-room',(Token,code)=>{
        Rooms.get(code).players=Rooms.get(code).players.filter(function(p){return p.token!=Token})
        SendUpdates(code);
    })
});

function SendUpdates(code)
{
    Rooms.get(code).players.forEach(p=>{
        io.to(Users.get(p.token)).emit('updatePlayers',Rooms.get(code));
    })
}