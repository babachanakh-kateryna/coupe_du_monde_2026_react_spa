import './App.css'
import { BrowserRouter } from "react-router-dom";
import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App
