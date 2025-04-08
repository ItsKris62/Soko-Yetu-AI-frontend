import { z } from 'zod'

export const loginSchema = z.object({
  idNumber: z.string().min(4),
  password: z.string().min(4),
})

export const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  idNumber: z.string(),
  gender: z.enum(['male', 'female']),
  role: z.enum(['farmer', 'buyer', 'other']),
  county: z.string(),
  subCounty: z.string(),
  phone: z.string().min(7),
  password: z.string().min(6),
})
