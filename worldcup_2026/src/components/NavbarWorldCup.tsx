import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function NavBarWorldCup() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Coupe du Monde 2026</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Accueil</Nav.Link>
            <Nav.Link as={NavLink} to="/matchs">Matchs</Nav.Link>
            <Nav.Link as={NavLink} to="/equipes">Équipes</Nav.Link>
            <Nav.Link as={NavLink} to="/groupes">Groupes</Nav.Link>
            <Nav.Link as={NavLink} to="/panier">Panier</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={NavLink} to="/connexion">Connexion</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBarWorldCup
