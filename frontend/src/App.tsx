import { Toaster } from '@/components/ui/sonner'
import Router from './routes'

function App() {
  return (
    <div className='h-full w-full'>
      <Router />
      <Toaster />
    </div>
  )
}

export default App
