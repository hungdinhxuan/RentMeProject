import Role from '../constants/role';
function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authorize based on user role
        (req, res, next) => {
            if(roles.length && roles.includes(Role.ANY)){
                return next();
            }
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(403).json({ message: 'Forbidden' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}

module.exports = authorize;