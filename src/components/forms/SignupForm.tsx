'use client'

import { useEffect, useState } from 'react'
import { registerSchema } from '../../lib/validators'
import { api } from '../../lib/api'
import { errorToast, successToast } from '../../utils/toast'
import { useModalStore } from '../../store/modalStore'
import { useRouter } from 'next/navigation'
import Lottie from 'lottie-react'
import successAnim from '../../../public/lottie/Success-animation.json'
import { redirectToDashboard } from '../../lib/helpers'

interface County {
  county_id: number
  county_name: string
}

interface SubCounty {
  sub_county_id: number
  sub_county_name: string
  county_id: number
}

interface FormData {
  firstName: string
  lastName: string
  idNumber: string
  gender: string
  role: string
  county: string
  subCounty: string
  phone: string
  password: string
}

export default function SignupForm({
  counties = [],
  subCounties = [],
}: {
  counties: County[]
  subCounties: SubCounty[]
}) {
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    idNumber: '',
    gender: '',
    role: '',
    county: '',
    subCounty: '',
    phone: '',
    password: '',
  })
  const [filteredSubs, setFilteredSubs] = useState<SubCounty[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { closeModal } = useModalStore()
  const router = useRouter()

  useEffect(() => {
    if (form.county) {
      const filtered = subCounties.filter(
        (s) => s.county_id === parseInt(form.county)
      )
      setFilteredSubs(filtered)
    }
  }, [form.county, subCounties])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const valid = registerSchema.safeParse(form)
    if (!valid.success) return errorToast('Please fill all fields correctly')

    try {
      const res = await api.post('/auth/register', form)
      const user = res.data.user
      const redirectPath = redirectToDashboard(user.role)

      setShowSuccess(true)
      successToast('Account created')
      setTimeout(() => {
        closeModal()
        router.push(redirectPath)
      }, 1800)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Registration failed. Try again.'
      errorToast(msg)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <Lottie
          animationData={successAnim}
          loop={false}
          className="w-32 h-32"
        />
        <p className="text-green-600 font-semibold mt-4">
          Welcome to AgriConnect 🎉
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 animate-slideIn px-1 md:px-2"
    >
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-700">First Name</label>
          <input
            name="firstName"
            placeholder="John"
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">Last Name</label>
          <input
            name="lastName"
            placeholder="Mwangi"
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>

      <input
        name="idNumber"
        placeholder="National ID Number"
        onChange={handleChange}
        className="input"
      />

      <input
        name="phone"
        placeholder="Phone Number"
        onChange={handleChange}
        className="input"
      />

      <div className="grid md:grid-cols-2 gap-3">
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="input"
          aria-label="Select Gender"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="input"
          aria-label="Select Role"
        >
          <option value="">Select Role</option>
          <option value="farmer">Farmer</option>
          <option value="buyer">Buyer</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <select
          name="county"
          value={form.county}
          onChange={handleChange}
          className="input"
          aria-label="Select County"
        >
          <option value="">Select County</option>
          {counties.map((c) => (
            <option key={c.county_id} value={c.county_id}>
              {c.county_name}
            </option>
          ))}
        </select>

        <select
          name="subCounty"
          value={form.subCounty}
          onChange={handleChange}
          className="input"
          aria-label="Select Sub-County"
        >
          <option value="">Select Sub-County</option>
          {filteredSubs.map((s) => (
            <option key={s.sub_county_id} value={s.sub_county_id}>
              {s.sub_county_name}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <input
          name="password"
          type={showPass ? 'text' : 'password'}
          placeholder="Create Password"
          onChange={handleChange}
          className="input pr-10"
        />
        <i
          onClick={() => setShowPass(!showPass)}
          className={`absolute right-3 top-3 cursor-pointer text-gray-500 fas fa-${
            showPass ? 'eye-slash' : 'eye'
          }`}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#297373] to-[#85FFC7] text-white font-bold py-2 rounded-lg shadow hover:shadow-md transform transition hover:scale-105 active:scale-95"
      >
        <i className="fas fa-user-plus mr-2"></i> Create Account
      </button>
    </form>
  )
}
