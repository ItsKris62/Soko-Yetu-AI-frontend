'use client'

import { useEffect, useState } from 'react'
import { registerSchema } from '../../lib/validators'
import { api } from '../../lib/api'
import { errorToast, successToast } from '../../utils/toast'
import { useModalStore } from '../../store/modalStore'
import { useRouter } from 'next/navigation'
import Lottie from '../ui/LottiePlayer'
import successAnim from '../../../public/lottie/Success-animation.json'
import { redirectToDashboard } from '../../lib/helpers'
import { AxiosError } from 'axios'

import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'


// Define interface for a County received from the backend
interface County {
  county_id: number
  county_name: string
}

// Define interface for a SubCounty received from the backend
interface SubCounty {
  sub_county_id: number
  sub_county_name: string
  county_id: number
}

// Define the form data interface using keys that match our DB columns
interface FormData {
  first_name: string
  last_name: string
  id_number: string
  gender: string
  role: string
  county_id: string      // stored as a string to avoid precision issues
  sub_county_id: string  // stored as a string
  phone: string
  password: string
}

// Define a specific type for API errors
interface ApiError {
  message: string;
}

/**
 * SignupForm component renders the registration form.
 * It expects two props: an array of counties and an array of sub_counties.
 *
 * With the nested endpoint approach, you could alternatively fetch and pass
 * a nested structure, but here we assume flat lists.
 */
export default function SignupForm() {
  const [form, setForm] = useState<FormData>({
    first_name: '', last_name: '', id_number: '', gender: '', role: '',
    county_id: '', sub_county_id: '', phone: '', password: '',
  })
  const [counties, setCounties] = useState<County[]>([])
  const [filteredSubs, setFilteredSubs] = useState<SubCounty[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { width, height } = useWindowSize()
  const { closeModal } = useModalStore()
  const router = useRouter()

  // Load counties once on mount
  useEffect(() => {
    ;(async () => {
      try {
        const response = await api.get<County[]>('/location/counties')
        setCounties(response.data)
      } catch (err) {
        console.error('Error fetching counties:', err)
      }
    })()
  }, [])

  // Load sub-counties when county_id changes
  useEffect(() => {
    if (!form.county_id) {
      setFilteredSubs([])
      return
    }
    ;(async () => {
      try {
        const response = await api.get<SubCounty[]>(`/location/sub-counties/${form.county_id}`)
        setFilteredSubs(response.data)
      } catch (err) {
        console.error('Error fetching sub-counties:', err)
        setFilteredSubs([])
      }
    })()
  }, [form.county_id])

  // Handle input changes for all form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate form data using the schema
    const valid = registerSchema.safeParse(form)
    if (!valid.success) return errorToast('Please fill all fields correctly')

    try {
      // Post the form data to the registration endpoint
      const res = await api.post('/auth/register', form)
      
      // pull directly from response
      const { role } = res.data
      const redirectPath = redirectToDashboard(role)

      setShowSuccess(true)
      successToast('Account created')
      setTimeout(() => {
        closeModal()
        router.push(redirectPath)
      }, 1800)
    } catch (err) {
      // Improved error handling with AxiosError type checking
      if (err instanceof AxiosError && err.response?.data) {
        const apiError = err.response.data as ApiError
        errorToast(apiError.message || 'Registration failed. Try again.')
      } else {
        errorToast('Registration failed. Try again.')
      }
    }
  }

  if (showSuccess) {
  
    return (
      <div className="relative flex flex-col items-center justify-center py-10 min-h-[300px]">
        <Confetti width={width} height={height} numberOfPieces={250} recycle={false} />
        <Lottie animationData={successAnim} loop={false} className="w-32 h-32" />
        <p className="text-green-600 font-semibold mt-6 text-center text-lg">
          Welcome to Soko Yetu AI 🎉
        </p>
      </div>
    )
  }

  // Render the signup form
  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-slideIn px-1 md:px-2">
    {/* Personal Info */}
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-700">First Name</label>
        <div className="relative">
          <input
            name="first_name"
            placeholder="John"
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-primary text-sm"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <i className="fas fa-user"></i>
          </span>
        </div>
      </div>
  
      <div>
        <label className="block text-sm text-gray-700">Last Name</label>
        <div className="relative">
          <input
            name="last_name"
            placeholder="Mwangi"
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-primary text-sm"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <i className="fas fa-user"></i>
          </span>
        </div>
      </div>
    </div>
  
    <div className="relative">
      <input
        name="id_number"
        placeholder="National ID Number"
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-primary text-sm"
      />
      <span className="absolute left-3 top-2.5 text-gray-400">
        <i className="fas fa-id-card"></i>
      </span>
    </div>
  
    <div className="relative">
      <input
        name="phone"
        placeholder="Phone Number"
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-primary text-sm"
      />
      <span className="absolute left-3 top-2.5 text-gray-400">
        <i className="fas fa-phone"></i>
      </span>
    </div>
  
    {/* Gender & Role */}
    <div className="grid md:grid-cols-2 gap-4">
      <select name="gender" title="Select Gender" value={form.gender} onChange={handleChange} className="input">
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
  
      <select name="role" title="Select Role" value={form.role} onChange={handleChange} className="input">
        <option value="">Select Role</option>
        <option value="farmer">Farmer</option>
        <option value="buyer">Buyer</option>
      </select>
    </div>
  
    {/* Location */}
    <div className="grid md:grid-cols-2 gap-4">
      <select name="county_id" title="Select County" value={form.county_id} onChange={handleChange} className="input">
        <option value="">Select County</option>
        {counties.map((c) => (
          <option key={c.county_id} value={c.county_id.toString()}>
            {c.county_name}
          </option>
        ))}
      </select>
  
      <select name="sub_county_id" title="Select Sub County" value={form.sub_county_id} onChange={handleChange} className="input">
        <option value="">Select Sub-County</option>
        {filteredSubs.map((s) => (
          <option key={s.sub_county_id} value={s.sub_county_id.toString()}>
            {s.sub_county_name}
          </option>
        ))}
      </select>
    </div>
  
    {/* Password */}
    <div className="relative">
      <input
        name="password"
        type={showPass ? 'text' : 'password'}
        placeholder="Create Password"
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 pr-10 focus:ring-2 focus:ring-primary text-sm"
      />
      <span className="absolute left-3 top-2.5 text-gray-400">
        <i className="fas fa-lock"></i>
      </span>
      <button
        type="button"
        onClick={() => setShowPass(!showPass)}
        className="absolute right-3 top-2.5 text-gray-500 hover:text-primary"
        aria-label="Toggle Password"
      >
        <i className={`fas fa-${showPass ? 'eye-slash' : 'eye'}`}></i>
      </button>
    </div>
  
    <button type="submit" className="w-full bg-gradient-to-r from-[#297373] to-[#85FFC7] text-white font-bold py-2 rounded-lg shadow hover:shadow-md transform transition hover:scale-105 active:scale-95">
      <i className="fas fa-user-plus mr-2"></i> Create Account
    </button>
  </form>
  
  );
}
