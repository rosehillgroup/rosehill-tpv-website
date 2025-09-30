import Header from './components/Header'
import ColorMixer from './components/ColorMixer'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="App">
      <Header />
      <main style={{ flex: 1 }}>
        <ColorMixer />
      </main>
      <Footer />
    </div>
  )
}

export default App
