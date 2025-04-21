// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, phone, role } = req.body
  try {
    await transporter.sendMail({
      from: '"Your App" <no‑reply@yourdomain.com>',
      to: 'support@yourdomain.com',
      subject: `New signup: ${role}`,
      text: `Name: ${name}\nPhone: ${phone}\nRole: ${role}`,
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false })
  }
}
