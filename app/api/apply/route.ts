import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    // Extract fields
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const coverLetter = formData.get('coverLetter') as string
    const jobRole = formData.get('jobRole') as string
    const jobId = formData.get('jobId') as string
    const resume = formData.get('resume') as File | null

    // Validate required
    if (!fullName || !email || !phone || !resume) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Process file
    const fileBuffer = await resume.arrayBuffer()
    const buffer = Buffer.from(fileBuffer)

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can adjust this based on the SMTP host or service
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL}>`,
      to: process.env.RECIPIENT_EMAIL, // Receiver
      subject: `New Job Application: ${jobRole} (${jobId}) from ${fullName}`,
      html: `
        <h2>New Job Application Received</h2>
        <p><strong>Applying for:</strong> ${jobRole} (ID: ${jobId})</p>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <h3>Cover Letter</h3>
        <p>${coverLetter ? coverLetter.replace(/\n/g, '<br/>') : '<em>No cover letter provided.</em>'}</p>
      `,
      attachments: [
        {
          filename: resume.name,
          content: buffer,
          contentType: resume.type,
        },
      ],
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Email sending error:', error)
    return NextResponse.json({ error: error.message || 'Failed to send application' }, { status: 500 })
  }
}
