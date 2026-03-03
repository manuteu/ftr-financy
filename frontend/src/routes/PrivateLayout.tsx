import { Outlet } from 'react-router'
import { Header } from '@/components/header'

export default function PrivateLayout() {
  return (
    <div className="h-screen bg-gray-100">
      <Header />
      <main className="w-full p-12">
        <Outlet />
      </main>
    </div>
  )
} 