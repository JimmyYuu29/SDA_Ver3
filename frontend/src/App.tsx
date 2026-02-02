import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wizard from './pages/Wizard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evaluate" element={<Wizard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
