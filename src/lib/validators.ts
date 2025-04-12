import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  idNumber: z.string(),
  gender: z.enum(['male', 'female']),
  role: z.enum(['farmer', 'buyer', 'admin']),
  county: z.string(),
  subCounty: z.string(),
  phone: z.string().min(7),
  password: z.string().min(6),
})

export const resetSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().min(10),
  newPassword: z.string().min(6),
})