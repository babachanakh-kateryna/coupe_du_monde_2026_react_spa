import AppRoutes from './AppRoutes';
import NavBarWorldCup from './components/NavbarWorldCup';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBarWorldCup />
      <main className="flex-grow-1">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;