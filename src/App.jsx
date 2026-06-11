import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Portfolio from './pages/Portfolio';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/demo" element={<Portfolio />} />
      <Route path="/eski" element={<Home />} />
      <Route path="/proje/:id" element={<ProjectDetail />} />
    </Routes>
  );
}

export default App;
