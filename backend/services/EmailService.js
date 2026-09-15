import { transporter } from "../config/mail.js";

class EmailService {
  async send(to, subject, html) {
    const info = await transporter.sendMail({
      from: `APP <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })

    console.log("Email enviado: ", info.messageId);

    return info;
  }
}

export default new EmailService();
