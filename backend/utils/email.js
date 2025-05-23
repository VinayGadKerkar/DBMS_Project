const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: "vinaygadkerkar09@gmail.com",
    pass: "qlfs ektr vqlk cyud"

  },
});

module.exports = transporter;