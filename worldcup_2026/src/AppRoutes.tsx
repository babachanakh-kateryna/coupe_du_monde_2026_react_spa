import { Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Equipes from "./pages/Equipes";
import Groupes from "./pages/Groupes";
import Panier from "./pages/Panier";
import Connexion from "./pages/Connexion";
import PageMatchs from "./components/Match/PageMatchs";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/matchs" element={<PageMatchs />} />
      <Route path="/equipes" element={<Equipes />} />
      <Route path="/groupes" element={<Groupes />} />
      <Route path="/panier" element={<Panier />} />
      <Route path="/connexion" element={<Connexion />} />
    </Routes>
  );
}


