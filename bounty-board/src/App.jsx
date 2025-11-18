import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Captured from './pages/Captured';
import Detail from './pages/Detail';
import AddBounty from './pages/AddBounty';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/captured" element={<Captured />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/add" element={<AddBounty />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}