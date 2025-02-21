import React from 'react'
import './App.css'
import Header from './components/Header'
import VideoGrid from './components/VideoGrid'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <VideoGrid />
      </main>
    </div>
  )
}

export default App
