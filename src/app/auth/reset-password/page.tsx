import PasswordResetForm from '../../../components/forms/PasswordResetForm'

export default function PasswordResetPage() {
  return (
    <div className="py-20 px-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold font-heading mb-6">Reset Your Password</h1>
      <PasswordResetForm />
    </div>
  )
}
