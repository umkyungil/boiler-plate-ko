const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/USer");

// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올수 있게 해주는 구문
app.use(bodyParser.urlencoded({extended: true}));
// application/json 을 분석해서 가져올수 있게 하는 구문
app.use(bodyParser.json());

const mongoose = require('mongoose');
const { json } = require('body-parser');

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, //useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

// req, res 위치 중요
app.get('/', (req, res) => res.send('Hello World'));
app.post('/register', (req, res) => {

    // 회원 가입할때 필요한 정보들을 클라이언트에서 가져오면 
    // 그것들을 DB에 넣어준다
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        })
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
