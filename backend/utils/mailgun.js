const Mailgun = require('mailgun-js');
const API_KEY = process.env.MAILGUN_PRIVATE_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = new Mailgun({ apiKey: API_KEY, domain: DOMAIN });

module.exports = (req, res) => {
  // req.data  is ojbect {from, to, subject, html}
  mailgun.messages().send(req.data, (err, body) => {
    if (err) {
      console.log('got an error: ', err);
      return res.json({ error: err });
    }
    return res.json({ success: true, message: `mail sent to ${req.data.to}` });
  });
};
