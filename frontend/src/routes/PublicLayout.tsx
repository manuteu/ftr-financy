import { Outlet } from 'react-router'

export default function PublicLayout() {
  return (
    <div className="flex flex-col justify-around py-5 md:py-0 h-screen">
      <Outlet />
    </div>
  )
} 