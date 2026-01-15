import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Login.jsx'
import CalendarPage from './CalendarPage.jsx' // change back to Login
import StaffForm from './Form/StaffForm.jsx';

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/staff-form" element={<StaffForm />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
