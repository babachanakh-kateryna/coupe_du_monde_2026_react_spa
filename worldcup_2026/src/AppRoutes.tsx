import { Routes, Route } from "react-router-dom";
import Accueil from "./components/Accueil/Accueil.tsx";
import PageEquipes from "./components/Equipe/PageEquipes.tsx";
import PageGroupes from "./components/Groupe/PageGroupes.tsx";
import PagePanier from "./components/Panier/PagePanier.tsx";
import Connexion from "./components/Connexion.tsx";
import PageMatchs from "./components/Match/PageMatchs";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/matchs" element={<PageMatchs />} />
      <Route path="/equipes" element={<PageEquipes />} />
      <Route path="/groupes" element={<PageGroupes />} />
      <Route path="/panier" element={<PagePanier />} />
      <Route path="/connexion" element={<Connexion />} />
    </Routes>
  );
}


