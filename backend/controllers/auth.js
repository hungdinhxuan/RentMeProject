

class Auth {
    login(req, res, next) {

    }
    register(req, res, next) {
        return res.status(201).json({
            success: true,
            message: 'created successful !!'
        })
    }
    resetPassword(req, res, next) {

    }
    
}

module.exports = new Auth;