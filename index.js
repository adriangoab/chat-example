const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const colores = color = new Array ('#000000','#000080','#00008B','#0000CD','#0000FF',
'#006400','#008000','#008B8B','#00BFFF','#00FF00',
'#00FF7F','#00FFFF','#1E90FF','#20B2AA','#228B22',
'#2E8B57','#2F4F4F','#32CD32','#3CB371','#40E0D0',
'#4169E1','#4682B4','#483D8B','#48D1CC','#4B0082',
'#556B2F','#5F9EA0','#6495ED','#66CDAA','#696969',
'#6A5ACD','#6B8E23','#708090','#778899','#7B68EE',
'#7CFC00','#7FFF00','#7FFFD4','#800000','#800080',
'#808000','#808080','#87CEFA','#8A2BE2','#8B0000',
'#8B008B','#8B4513','#8FBC8F','#90EE90','#9370DB',
'#9400D3','#98FB98','#9932CC','#9ACD32','#A0522D',
'#A52A2A','#A9A9A9','#ADD8E6','#ADFF2F','#AFEEEE',
'#B0C4DE','#B0E0E6','#B22222','#B8860B','#BA55D3',
'#BC8F8F','#BDB76B','#C0C0C0','#C71585','#CD5C5C',
'#CD853F','#D2691E','#D2B48C','#D3D3D3','#D8BFD8',
'#DA70D6','#DAA520','#DB7093','#DC143C','#DCDCDC',
'#DDA0DD','#DEB887','#E0FFFF','#E6E6FA','#E9967A',
'#EE82EE','#EEE8AA','#F08080','#F4A460','#FA8072',
'#FC0FC0','#FF0000','#FF6347','#FF69B4','#FF7F50',
'#FF8C00','#FFA07A','#FFA500','#FFB6C1','#FFD700');

const socketColors = new Map();

let numSocketsConectados = 0

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  numSocketsConectados++
  io.emit('socketsConectados', numSocketsConectados)
  const colorIni = colores[Math.floor(Math.random() * 100)]
  socketColors.set(socket.id, colorIni)

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
  socket.on('punto', coord => {
    const color = socketColors.get(socket.id);
    io.local.emit('punto',coord, color)
  });
  socket.on('linea', coord => {
    const color = socketColors.get(socket.id);
    io.local.emit('linea',coord, color)
  });
  socket.on('disconnect', () => {
    numSocketsConectados--;
    io.emit('socketsConectados', numSocketsConectados);    
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
