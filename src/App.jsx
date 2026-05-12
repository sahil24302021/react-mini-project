import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ColorProvider } from '@/context/ColorContext'
import HomePage     from '@/pages/HomePage'
import ExplorePage  from '@/pages/ExplorePage'
import SavedPage    from '@/pages/SavedPage'
import DocsPage     from '@/pages/DocsPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <ColorProvider>
        <Routes>
          <Route path="/"        element={<HomePage />}    />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/saved"   element={<SavedPage />}   />
          <Route path="/docs"    element={<DocsPage />}    />
          <Route path="*"        element={<NotFoundPage />}/>
        </Routes>
      </ColorProvider>
    </BrowserRouter>
  )
}
