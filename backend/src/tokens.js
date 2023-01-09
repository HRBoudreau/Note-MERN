const { sign } = require('jsonwebtoken');

const createAccessToken = (userId) => {
    console.log("USING USER ID " + userId);
    return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    })
};

const createRefreshToken = (userId) => {
    return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '8h'
    })
};

const sendAccessToken = ( res, req, accesstoken) => {
    res.send({
        accesstoken,
        email: req.body.email
    })
}

const sendRefreshToken = ( res, refreshtoken) => {
    try {
    res.cookie('refreshtoken', refreshtoken , {
        domain: '127.0.0.1'
    });
    }
    catch(err) {
        console.log('Eror: ' + err);
    }
    console.log("cookie sent " + refreshtoken);
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken
}