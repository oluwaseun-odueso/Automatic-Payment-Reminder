const jwt  = require('jsonwebtoken')
require('dotenv').config()

const mySecretKey = process.env.SECRET

function generateToken(user) {
    return new Promise((resolve, reject) => {
        jwt.sign(user, mySecretKey, function(err, token) {
            if (err) reject(err)
            resolve(token)
        })
    })
}

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, mySecretKey, function(err, user) {
        if (err) return res.status(403).send({
            errno : 106,
            message : "Invalid token, please login again."
        })
        req.user = user
        next()
    }) 
}

const tokenFunctions = {
    generateToken,
    verifyToken
}

module.exports = tokenFunctions