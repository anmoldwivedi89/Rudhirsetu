import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'

export default function HospitalLayout() {
  const location = useLocation()

  useEffect(() => {
    // Debug routing (requested): verify pathname changes
    // eslint-disable-next-line no-console
    console.log(location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-dvh bg-[#0a0a0a] overflow-x-hidden md:flex">
      <Sidebar role="hospital" />
      <main className="flex-1 pt-16 md:pt-0">
        <div className="mx-auto w-full max-w-md md:max-w-6xl px-4 md:px-6 py-4 md:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

