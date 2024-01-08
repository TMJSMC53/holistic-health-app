import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from '../pages/Home/Homepage';
import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;
