import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
// import MatrixCursor from './components/utils/MatrixCursor'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <MatrixCursor /> */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
