import { useEffect, useState } from 'react'

export function useGeoLocation() {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(pos.coords),
      (err) => setError(err.message)
    )
  }, [])

  return { location, error }
}
