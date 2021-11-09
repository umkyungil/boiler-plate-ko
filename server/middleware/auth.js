const { User } = require('../models/User');

let auth = (req, res, next) => {

    //인증처리를 하는곳
    //클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    //토큰을 복호화 후 유저를 찾는다
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        // user가 없다면 
        if (!user) return res.json({ isAuth: false, error: true});

        // user, token을 req에 넣는 이유는 함수를 호출한 곳에서 사용할수 있게 하기 위해서다
        req.token = token;
        req.user = user;
        next();
    })
    //유저가 있으면 인증 Okay

    //유저가 없으면 인증 No
}

module.exports = {auth};