function Player(name,token)
{
    this.name=name;
    this.token=token;
}
module.exports={
    Player:function(name,token)
    {
        this.name=name;
        this.token=token;
        this.ready=false;
    },
    Room:function(creator,code,token)
    {
        this.creator=creator
        this.size=2;
        this.status='In lobby';
        this.players=[new Player(creator,token)];
        this.code=code;
    },
    ID:function() {
        return Math.random().toString(36).substr(2, 4);
    }
}