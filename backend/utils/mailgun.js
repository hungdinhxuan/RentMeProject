const Mailgun = require('mailgun-js');

const mailgun = new Mailgun({
  apiKey: process.env.MAILGUN_PRIVATE_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});
const MailComposer = require('nodemailer/lib/mail-composer');

module.exports = (req, res) => {
  // req.data  is ojbect {from, to, subject, html}
  const mail = new MailComposer(req.data);
  // mailgun.messages().sendMime(req.data, (err, body) => {
  //   if (err) {
  //     console.log('got an error: ', err);
  //     return res.json({ error: err });
  //   }
  //   return res.json({ success: true, message: `mail sent to ${req.data.to}` });
  // });
  mail.compile().build((err, message) => {
    var dataToSend = {
      to: req.data.to,
      message: message.toString('ascii'),
    };

    mailgun.messages().sendMime(dataToSend, (sendError, body) => {
      if (sendError) {
        console.log(sendError);
        return res.json({
          success: false,
          message: 'Error when send mail',
          error: sendError,
        });
      }
      return res.json({
        success: true,
        message: `Sent mail to ${req.data.to}`,
        body,
      });
    });
  });
};
