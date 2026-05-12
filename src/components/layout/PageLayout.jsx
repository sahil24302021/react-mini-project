import Navbar from './Navbar'
import Footer from './Footer'
import Toast from '@/components/ui/Toast'

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toast />
    </div>
  )
}
