import { Link } from 'react-router-dom';
import './Accueil.css';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StadiumIcon from '@mui/icons-material/Stadium';

function Accueil() {
  return (
    <div className="accueil-wrapper">
      <section className="accueil-hero">
        <div className="accueil-hero-content">
          <h1 className="accueil-title">
            Billetterie Officielle<br />
            Coupe du Monde FIFA 2026
          </h1>
          <p className="accueil-subtitle">
            Réservez vos places pour les plus grands matchs de football de la planète
          </p>
          <Link to="/matchs" className="accueil-cta">
            <ConfirmationNumberIcon />
            Voir les matchs
          </Link>
        </div>
      </section>

      <section className="accueil-features">
        <div className="accueil-features-grid">
          <div className="accueil-feature">
            <div className="accueil-feature-icon">
              <SecurityIcon fontSize="large" />
            </div>
            <h3>100% Sécurisé</h3>
            <p>Paiements cryptés et billetterie officielle garantie</p>
          </div>
          <div className="accueil-feature">
            <div className="accueil-feature-icon">
              <SupportAgentIcon fontSize="large" />
            </div>
            <h3>Support 24/7</h3>
            <p>Une équipe dédiée pour vous accompagner à chaque étape</p>
          </div>
          <div className="accueil-feature">
            <div className="accueil-feature-icon">
              <StadiumIcon fontSize="large" />
            </div>
            <h3>Meilleurs sièges</h3>
            <p>Choisissez votre catégorie et votre emplacement préféré</p>
          </div>
        </div>
      </section>

      <section className="accueil-stats">
        <div className="accueil-stats-grid">
          <div className="accueil-stat">
            <div className="accueil-stat-number">48</div>
            <div className="accueil-stat-label">Équipes</div>
          </div>
          <div className="accueil-stat">
            <div className="accueil-stat-number">104</div>
            <div className="accueil-stat-label">Matchs</div>
          </div>
          <div className="accueil-stat">
            <div className="accueil-stat-number">16</div>
            <div className="accueil-stat-label">Stades</div>
          </div>
          <div className="accueil-stat">
            <div className="accueil-stat-number">3</div>
            <div className="accueil-stat-label">Pays hôtes</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Accueil;