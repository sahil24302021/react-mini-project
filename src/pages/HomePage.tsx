import PageLayout from '@/components/layout/PageLayout'
import HeroSection from '@/components/sections/HeroSection'
import PaletteSection from '@/components/sections/PaletteSection'
import GradientSection from '@/components/sections/GradientSection'
import HistorySection from '@/components/sections/HistorySection'

export default function HomePage() {
  return (
    <PageLayout>
      <HeroSection />
      <PaletteSection />
      <GradientSection />
      <HistorySection />
    </PageLayout>
  )
}

