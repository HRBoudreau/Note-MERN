const { verify } = require('jsonwebtoken');

const isAuth = req => {
    console.log(req.refreshtoken);
    const token = req.refreshtoken;
    if (!token) throw new Error("you need to login");
    // 'blob asdfj1349jaf910349j1f01ejkfl1f01'
    console.log('token: ' + token);
    const { userId } = verify(token, process.env.REFRESH_TOKEN_SECRET);
    console.log( userId );
    return userId;
}

module.exports = {
    isAuth
}