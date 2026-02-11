import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private transporter: nodemailer.Transporter | null = null

  constructor(private config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST')
    const port = Number(this.config.get<string>('SMTP_PORT') || 0)
    const user = this.config.get<string>('SMTP_USER')
    const pass = this.config.get<string>('SMTP_PASS')

    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: { user, pass },
      })
      // Verify transporter
      this.transporter.verify().then(() => {
        this.logger.log('SMTP transporter verified')
      }).catch((err) => {
        this.logger.warn('SMTP transporter verification failed: ' + err.message)
        this.transporter = null
      })
    } else {
      this.logger.warn('SMTP configuration incomplete, email sending disabled')
    }
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    if (!this.transporter) {
      this.logger.warn(`No SMTP transporter available. Skipping email to ${to}`)
      return false
    }

    const from = this.config.get<string>('MAIL_FROM') || this.config.get<string>('SMTP_USER')

    const info = await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    })

    this.logger.log(`Email sent to ${to}: ${info.messageId}`)
    return info
  }
}

export default MailService
