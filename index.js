var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var RiveScript = require("rivescript");

var bot = new RiveScript();

var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log("New connection")

    socket.on('chat message', function(msg){
        
      bot.sortReplies();
      
      let username = "local-user";

      bot.reply(username, msg).then(function(reply) {
        if (reply == "ERR: No Reply Matched") {
          reply = "BrrBrr, BOT don't know what to say"
        }
        io.emit('chat message', "BOT : " + reply);
      });


    });
});

bot.loadFile("./brain.rive").then(loading_done).catch(loading_error);


function loading_done() {
  console.log("Bot has finished loading!");

  http.listen(port, function(){
    console.log('listening on *:' + port);
  });

}
 
// It's good to catch errors too!
function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}