import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import { useApp } from './hooks/AuthContext';


function NavBarWorldCup() {
  const { state, logout } = useApp();

  return (
    <Navbar className="bg-darkblue" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">Coupe du Monde 2026</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Accueil</Nav.Link>
            <Nav.Link as={NavLink} to="/matchs">Matchs</Nav.Link>
            <Nav.Link as={NavLink} to="/equipes">Équipes</Nav.Link>
            <Nav.Link as={NavLink} to="/groupes">Groupes</Nav.Link>
          </Nav>

          <Nav className="align-items-center gap-3">
            <Nav.Link as={NavLink} to="/panier" className="position-relative d-flex align-items-center gap-2">
              <ShoppingCartIcon />
              {state.cartCount > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle cartBadge">
                  {state.cartCount}
                </Badge>
              )}
            </Nav.Link>

            {state.isAuthenticated ? (
              <>
                <Nav.Link as={NavLink} to="/profil" className="d-flex align-items-center gap-2">
                    <PersonIcon />
                </Nav.Link>
                <Nav.Link onClick={logout} className="d-flex align-items-center gap-2 text-white" style={{ cursor: 'pointer' }}>
                  <LogoutIcon />
                  <span className="d-none d-lg-inline">Déconnexion</span>
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/connexion" className="d-flex align-items-center gap-2">
                <LoginIcon />
                <span className="d-none d-lg-inline">Connexion</span>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBarWorldCup;