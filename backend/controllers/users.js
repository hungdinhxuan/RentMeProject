const User = require('../models/users')

class UsersController {
    async getOne(req, res) {

        const id = req.params.id
        if(req.user._id == id){
            return res.json({success: true, message: 'User found', user: req.user})
        }
        try {
            const user = await User.findById({_id: id})
            if(!user){
                return res.status(404).json({success: false, message: 'User not found'})
            }
            return res.json({success: true, message: 'User found', user})
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error,
              });
        }
    }
    async getAll(req, res) {
        try {
            const users = await User.find()
            return res.json({success: true, users})
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error,
              });
        }
    }
}

module.exports = new UsersController();