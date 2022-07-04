function auth (req, res, next) {
    if (req.user.is_admin == true) {
        next()
    } else {
        res.status(400).json({
            errno: '121',
            message: "You are unauthourized to perform this action"
        })
    }
}

module.exports = {
    auth
}