import { z } from 'zod'

// Schema for user login validation 
export const loginSchema = z.object({
  id_number: z.string().nonempty({ message: 'ID number is required' }),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

/**
 * Updated registration schema.
 * The keys have been updated to match the form:
 * - first_name, last_name, and id_number remain the same.
 * - Changed `county` to `county_id` and `subCounty` to `sub_county_id`
 *   to ensure consistency with the database columns.
 */
export const registerSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  id_number: z.string(),
  gender: z.enum(['male', 'female']),
  role: z.enum(['farmer', 'buyer', 'admin']),
  county_id: z.string().min(1, { message: "County is required" }),
  sub_county_id: z.string(),
  phone: z.string().min(7),
  password: z.string().min(6),
})

export const resetSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().min(10),
  newPassword: z.string().min(6),
})