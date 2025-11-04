import { useState, useEffect } from 'react';
import { TeamService } from '../../api/services/TeamService';
import type { Team } from '../../api/types/Team';
import { Card, Container, Row, Col, Form, Badge, Spinner } from 'react-bootstrap';
import './PageEquipes.css';
import ToastNotification from '../Common/ToastNotification';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

function PageEquipes() {

    const [teams, setTeams] = useState<Team[]>([]);
    const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
    const [continents, setContinents] = useState<string[]>([]);
    const [selectedContinent, setSelectedContinent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

    useEffect(() => {
        const loadTeams = async () => {

            try {
                setLoading(true);
                const data = await TeamService.getTeams();
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                setTeams(sorted);
                setFilteredTeams(sorted);

                const uniqueContinents = [...new Set(sorted.map(t => t.continent))].sort();
                setContinents(uniqueContinents);
            } catch (err) {
                console.error('Erreur:', err);
                setToast({type: 'error',message: 'Impossible de charger les équipes. Veuillez réessayer.',});

            } finally {
                setLoading(false);
            }
        };
        loadTeams();
    }, []);

    useEffect(() => {
        if (selectedContinent) {
            setFilteredTeams(teams.filter(t => t.continent === selectedContinent));
        } else {
            setFilteredTeams(teams);
        }
    }, [selectedContinent, teams]);

    const confederationColors: Record<string, string> = {
        UEFA: 'primary',
        CONMEBOL: 'success',
        CAF: 'warning',
        AFC: 'info',
        CONCACAF: 'danger',
        OFC: 'secondary'
    };

    if (loading) {
        return (
            <>
                <Container className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Chargement des équipes...</p>
                </Container>
            </>
        );
    }

    return (
        <>
        <Box className="ms-5 me-5 mb-5 mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h3" className="page-title">Liste des équipes</Typography>

                <Form.Select
                    value={selectedContinent}
                    onChange={(e) => setSelectedContinent(e.target.value)}
                    className="continent-filter"
                >
                    <option value="">Tous les continents</option>
                    {continents.map(cont => ( <option key={cont} value={cont}>{cont}</option>))}

                </Form.Select>

            </div>

            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                {filteredTeams.map((team) => (
                    <Col key={team.id}>
                        <Card className="team-card h-100 shadow-sm">
                            <Card.Body className="d-flex flex-column">

                                <div className="text-center mb-3">
                                    <img
                                        src={new URL(`../../assets/flags/${team.code}.png`, import.meta.url).href}
                                        alt={team.code}
                                        className="team-flag-large"
                                    />
                                </div>

                                <Card.Title className="text-center mb-2">{team.name}</Card.Title>
                                <div className="text-center mb-3">
                                    <Badge className="team-code-badge fs-6">{team.code}</Badge>
                                </div>

                                <div className="mt-auto">
                                    <div className="d-flex justify-content-between mb-2">
                                        <small className="text-muted">Continent</small>
                                        <strong>{team.continent}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <small className="text-muted">Confédération</small>
                                        <Badge bg={confederationColors[team.confederation] || 'secondary'}>
                                            {team.confederation}
                                        </Badge>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <small className="text-muted">Groupe</small>
                                        <Badge bg="dark">Groupe {team.group.name}</Badge>
                                    </div>
                                </div>

                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {filteredTeams.length === 0 && (
                <div className="text-center py-5">
                    <p className="text-muted">Aucune équipe trouvée pour ce continent.</p>
                </div>
            )}
            
            {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

        </Box>
        </>
    );
}

export default PageEquipes;
