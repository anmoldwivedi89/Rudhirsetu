import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Loader from './Loader'

export default function RouteLogger() {
  const location = useLocation()

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[route] loaded:', location.pathname)
  }, [location.pathname])

  return (
    <div className="hidden" aria-hidden="true">
      <Loader />
    </div>
  )
}

