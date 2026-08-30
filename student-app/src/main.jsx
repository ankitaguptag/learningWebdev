import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'
import Create from './components/Create.jsx'
import UserList from './components/UserList.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create/>}/>
        <Route path="/UserList" element={<UserList/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
