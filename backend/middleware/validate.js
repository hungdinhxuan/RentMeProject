const { check, validationResult } = require('express-validator');

const validateRegisterUser = () => {
  return [
    check('username', 'username does not Empty').not().isEmpty(),
    check('username', 'username must be Alphanumeric').isAlphanumeric(),
    check('username', 'username more than 6 degits').isLength({ min: 6 }),
    check('email', 'Invalid does not Empty').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('fullName', 'Invalid does not Empty').not().isEmpty(),
    check(
      'fullName',
      'Full must be and min Length is 5 characters',
    ).matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W]*$/)
    .isLength({ min: 5})
      ,
    check(
      'password',
      'password is not strong, it should have minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1',
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    }),
  ];
};

const validateLogin = () => {
  return [
    check('username', 'username does not Empty').not().isEmpty(),
    check('username', 'username must be Alphanumeric').isAlphanumeric(),
    check('username', 'username more than 6 degits').isLength({ min: 6 }),
    check('password', 'password more than 8 degits').isLength({ min: 8 }),
  ];
};

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

const validateNewPassword = () => {
  return [
    check(
      'newPassword',
      'newPassword is not strong, it should have minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1',
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    }),
  ]
}

const validateNewUserInfo = () => {
  return [
    check(
      'fullName',
      'Full must be and min Length is 5 characters',
    ).matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W]*$/)
    .isLength({ min: 5}),
    check('birthDate').not().isEmpty(),
    // check('birthDate').isDate(),
    check('gender').not().isEmpty(),
    check('gender').isAlpha(),
    check('province').not().isEmpty(),
    
  ]
}

module.exports = {
  validateRegisterUser: validateRegisterUser,
  validateLogin: validateLogin,
  handleValidationErrors,
  validateNewPassword,
  validateNewUserInfo
};
