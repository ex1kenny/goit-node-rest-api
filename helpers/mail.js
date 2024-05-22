import "dotenv/config";

import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_USERPASSWORD,
  },
});

export const sendEmail = async (data) => {
  const email = {
    ...data,
    from: process.env.MAILTRAP_USERNAME,
  };
  await transport.sendMail(email).then(console.log).catch(console.error);
  return true;
};
