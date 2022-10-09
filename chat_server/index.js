const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const path = require('path');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// 配置静态资源返回路径
app.use('/css', express.static(path.join(__dirname, '/chatRoom/css')));
app.use('/js', express.static(path.join(__dirname, '/chatRoom/js')));
app.use('/img', express.static(path.join(__dirname, '/chatRoom/img')));


let users = new Set();
let history = [];
let port = 3000;

const io = new Server(server, {
    path: '/chat',
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

//解决跨域问题
app.all("*", function (req, res, next) {
    // 设置允许跨域的域名,*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', '*');
    // 允许的header类型
    res.header('Access-Control-Allow-Headers', 'content-type');
    // 跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
    next();
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/chatRoom/index.html');
})

// app.get('/css/app.af4cc7bf.css', (req, res) => {
// res.sendFile(__dirname + '/css/app.af4cc7bf.css');
// })

app.post('/login', (req, res) => {
    let username = req.body.username;
    let resmsg = null;
    if (users.has(username)) {
        resmsg = {
            code: 0,
            msg: "该用户名当前已被使用"
        }
    } else {
        resmsg = {
            code: 200,
            msg: { username }
        }

    }
    res.send(resmsg);
})

io.on('connection', (socket) => {
    socket.on('$login', (username) => {
        console.log('已socket连接')
        // 分配用户名
        users.add(username);
        // 广播通知所有用户 sending to all clients, include sender
        io.emit('$updateUser', [...users]);
        // 发送聊天记录 sending to sender-client only
        socket.emit('$history', history);
        // 发送用户名
        socket.emit('$name', username);
        // 监听聊天消息
        socket.on('$message', (name, content) => {
            const msg = {
                name,
                content,
                date: Date.now()
            }
            history.push(msg);
            socket.broadcast.emit('$message', msg);
        })
        // 断开连接时
        socket.on('disconnect', () => {
            console.log('link is break');
            // 清除用户
            users.delete(username);
            // 广播通知所有用户
            socket.broadcast.emit('$updateUser', [...users]);

        })
    })
})

server.listen(port, () => {
    console.log(`服务已打开，端口号为：${port}`);
});



