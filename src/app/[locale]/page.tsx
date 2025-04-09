'use client'

import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('home')

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('getStarted')}</button>
    </div>
  )
}
