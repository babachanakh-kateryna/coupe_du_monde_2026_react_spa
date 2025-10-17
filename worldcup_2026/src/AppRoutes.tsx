import { Routes, Route } from "react-router-dom";
import Accueil from "./components/Accueil";
import Matchs from "./components/Matchs";
import Equipes from "./components/Equipes";
import Groupes from "./components/Groupes";
import Panier from "./components/Panier";
import Connexion from "./components/Connexion";

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


