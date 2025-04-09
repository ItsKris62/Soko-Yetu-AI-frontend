'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const toggleLang = () => {
    const segments = pathname.split('/')
    const currentLang = segments[1]
    const newLang = currentLang === 'en' ? 'sw' : 'en'
    segments[1] = newLang
    const newPath = segments.join('/')

    startTransition(() => {
      router.push(newPath)
    })
  }

  return (
    <button
      onClick={toggleLang}
      className="text-sm text-white bg-primary px-3 py-1 rounded"
      disabled={isPending}
    >
      {pathname.startsWith('/en') ? 'Swahili' : 'English'}
    </button>
  )
}
