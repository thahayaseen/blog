import nodemailConfig from "@/config/nodemail.config";
import { IMailProvider } from "../interface/Inodemail.provider";
import nodemailer from "nodemailer";
export default class mailProvider implements IMailProvider {
  private transport;
  constructor() {
    console.log(nodemailConfig);

    this.transport = nodemailer.createTransport(nodemailConfig);
  }
  async sendeMail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    await this.transport.sendMail({
      from: nodemailConfig.auth.user,
      to,
      subject,
      text,
      html,
    });
  }
}
