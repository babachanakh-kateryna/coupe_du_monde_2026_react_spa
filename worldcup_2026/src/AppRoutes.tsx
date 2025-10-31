import { Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Matchs from "./pages/Matchs";
import Equipes from "./pages/Equipes";
import Groupes from "./pages/Groupes";
import Panier from "./pages/Panier";
import Connexion from "./pages/Connexion";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/matchs" element={<Matchs />} />
      <Route path="/equipes" element={<Equipes />} />
      <Route path="/groupes" element={<Groupes />} />
      <Route path="/panier" element={<Panier />} />
      <Route path="/connexion" element={<Connexion />} />
    </Routes>
  );
}


