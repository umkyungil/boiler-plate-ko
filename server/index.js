const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

// application/x-www-form-urlencoded 
// 이렇게 된 데이터를 분석해서 가져올수 있게 해주는 구문
app.use(bodyParser.urlencoded({extended: true}));
// application/json 을 분석해서 가져올수 있게 하는 구문
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
const { json } = require('body-parser');

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, //이전과 달라진 점 이걸 쓰면 에러가 남 -> useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

// req, res 위치 중요
app.get('/', (req, res) => res.send('Hello World'));

app.post('/api/users/register', (req, res) => {
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

app.post('/api/users/login', (req, res) => {
	//요청된 이메일을 데이터베이스에서 찾는다
	User.findOne({email:req.body.email}, (err, user) => {
		// 유저가 없다면
		if (!user) {
			return res.json({
				loginSuccess: false,
				message: "제공된 이메일에 해당하는 유저가 없습니다."
			})
		}
		// 요청된 이메일의 비밀번호가 맞는지 확인
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch) 
				return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."});
			
			// 토큰생성
			user.generateToken((err, user) => {
				if(err) return res.status(400).send(err);
				
				// 토큰을 쿠키에 저장한다 
				res.cookie("x_auth", user.token)
				.status(200)
				.json({loginSuccess: true, userId: user._id});
			});
		});
	});
})

app.get('/api/users/auth', auth, (req, res) => {

	// 여기까지 미들웨어를 통과해 왔다는 애기는 Authentication이 true라는 말
	// role:0 일반유저, 0이 아니면 관리자
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image
	})
});

// Logout
app.get('/api/users/logout', auth, (req, res) => {
	
	User.findOneAndUpdate({_id: req.user._id},{ token: "" }, (err, user) => {
				if (err) return res.json({success: false, err});
				return res.status(200).send({ success: true });
		});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
