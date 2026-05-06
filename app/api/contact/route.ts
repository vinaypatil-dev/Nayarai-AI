import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, email, company, phone, reason, message } = data

    if (!name || !email || !reason || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Inquiry: ${reason} from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">New Contact Inquiry received</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; width: 30%;"><strong>Name:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #555;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea;"><strong>Email:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #555;">
                <a href="mailto:${email}" style="color: #0066cc;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea;"><strong>Phone:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #555;">${phone || '<i>Not provided</i>'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea;"><strong>Company:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #555;">${company || '<i>Not provided</i>'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea;"><strong>Reason:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #555;">${reason}</td>
            </tr>
          </table>

          <h3 style="margin-top: 30px; color: #333;">Message:</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; color: #555; white-space: pre-wrap; line-height: 1.5;">
            ${message}
          </div>
          
          <p style="margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eaeaea; padding-top: 15px;">
            This email was sent automatically from your website's contact form.
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Contact email sending error:', error)
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 })
  }
}
