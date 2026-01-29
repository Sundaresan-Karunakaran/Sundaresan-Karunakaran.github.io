import './App.css'
import MainPage from './MainPage'

import { HashRouter, Routes, Route } from 'react-router-dom'
import { BlogPost } from './BlogPost'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </HashRouter>
  )
}

export default App
