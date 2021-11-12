const fetch = require("isomorphic-fetch");
module.exports = (req, res, next) => {
  const response_key = req.body['captcha'];
  
  // Put secret key here, which we get from google console
  const secret_key = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;
  fetch(url, {
    method: 'post',
  })
    .then((response) => response.json())
    .then((google_response) => {
      // google_response is the object return by
      // google as a response
      if (google_response.success == true) {
        //   if captcha is verified
        console.log('Captcha verified');
        return next();
      } else {
        // if captcha is not verified
        return res
          .status(406)
          .json({ success: false, message: 'Recaptcha error' });
      }
    })
    .catch((error) => {
      // Some error while verify captcha
      return res
        .status(500)
        .json({ success: false, message: 'Internal Server Error', error });
    });
};
