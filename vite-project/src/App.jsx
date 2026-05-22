import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SaberesPrevios from './pages/SaberesPrevios';
import Calculo1 from './pages/Calculo1';
import TemaPage from './pages/TemaPage';
import BibliotecaMultimedia from './pages/BibliotecaMultimedia';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saberes-previos" element={<SaberesPrevios />} />
          <Route path="/calculo1" element={<Calculo1 />} />
          <Route path="/calculo1/:unidadId" element={<Calculo1 />} />
          <Route path="/calculo1/:unidadId/:temaId" element={<TemaPage />} />
          <Route path="/biblioteca" element={<BibliotecaMultimedia />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App
