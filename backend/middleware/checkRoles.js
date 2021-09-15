module.exports = {
    SuperAdminRole: (req, res, next) => {
        const role = req.user.role_id;
        
        if(role < 2){
            return next();
        }
        return res.status(406).json({success: false, message: 'You are not allowed to access this resource.'});
    },
    AdminRole: (req, res, next) => {
        const role = req.user.role_id;
        if(role < 3){
            return next();
        }
        return res.status(406).json({success: false, message: 'You are not allowed to access this resource.'});
    },
    PlayerRole: (req, res, next) => {
        const role = req.user.role_id;
        if(role < 4){
            return next();
        }
        return res.status(406).json({success: false, message: 'You are not allowed to access this resource.'});
    },
    CustomerRole: (req, res, next) => {
        const role = req.user.role_id;
        console.log(role);
        if(role < 5){
            return next();
        }
        return res.status(406).json({success: false, message: 'You are not allowed to access this resource.'});
    }
}

