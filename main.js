const express = require('express');
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/my-app/build'));

//DB 사용을 위한
app.use(express.json());
const cors = require('cors');
app.use(cors());

const teacherRouter = require("./_routers/teacherRouter.js");

//홈페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/react-project/build/index.html'));
});

//선생님 페이지
//app.use("/teacher", teacherRouter);
app.get('/teacher', (req, res) => {
  res.send('teacher page');
});

//학생 페이지
app.get('/student', (req, res) => {
    res.send('student page');
});

//About Us
app.get('/about', (req, res) => {
  res.send('Welcome');
});

//Recruit
app.get('/recruit', (req, res) => {
  res.send('Nice');
});

//Sign In
app.get('/join', (req, res) => {
  res.send('input details');
});

//Login
app.get('/login', (req, res) => {
  res.send('login page');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

//리엑트 라우팅을 위한
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/my-app/build/index.html'));
});