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
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar role="hospital" />
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-6xl px-4 md:px-6 py-4 md:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
