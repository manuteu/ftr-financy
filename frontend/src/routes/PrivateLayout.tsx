import { Outlet } from 'react-router'
import { Header } from '@/components/header'

export default function PrivateLayout() {
  return (
    <div className="h-screen bg-gray-50">
      <Header />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  )
} 