import { Navigate, Route, Routes } from 'react-router'
import AppShell from './components/AppShell'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
