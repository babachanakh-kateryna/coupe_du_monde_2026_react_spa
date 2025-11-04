import { useState, useEffect } from 'react';
import { GroupService } from '../../api/services/GroupService';
import type { Group } from '../../api/types/Group';
import { Container, Row, Col, Card, Badge, Form, Spinner } from 'react-bootstrap';
import './PageGroupes.css';
import ToastNotification from '../Common/ToastNotification';
import { Box, Typography } from '@mui/material';

function PageGroupes() {

    const [groups, setGroups] = useState<Group[]>([]);
    const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
    const [groupLetters, setGroupLetters] = useState<string[]>([]);
    const [selectedLetter, setSelectedLetter] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);


    useEffect(() => {
        const loadGroups = async () => {
            try {
                setLoading(true);
                const data = await GroupService.getGroups();
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                setGroups(sorted);
                setFilteredGroups(sorted);

                const letters = [...new Set(sorted.map(g => g.name))];
                setGroupLetters(letters);
            } catch (err) {
                console.error('Erreur:', err);
                setToast({type: 'error',message: 'Impossible de charger les groupe.',});
            } finally {
                setLoading(false);
            }
        };
        loadGroups();
    }, []);

    useEffect(() => {
        if (selectedLetter) {
            setFilteredGroups(groups.filter(g => g.name === selectedLetter));
        } else {
            setFilteredGroups(groups);
        }
    }, [selectedLetter, groups]);


    if (loading) {
        return (
            <>
                <Container className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Chargement des groupes...</p>
                </Container>
            </>
        );
    }

    return (
        <>
        <Box className="ms-5 me-5 mb-5 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h3" className="page-title">Liste des groupes</Typography>
                
                <Form.Select
                    value={selectedLetter}
                    onChange={(e) => setSelectedLetter(e.target.value)}
                    className="group-filter"
                >
                    <option value="">Toutes les groupes</option>
                    {groupLetters.map(letter => (
                    <option key={letter} value={letter}>Groupe {letter}</option>
                    ))}
                </Form.Select>
            </div>

            <Row xs={1} md={2} lg={3} className="g-4">
                {filteredGroups.map((group) => (
                    <Col key={group.id}>
                        <Card className="group-card h-100 shadow-sm">
                            <Card.Body className="text-center">
                                <div className="group-header mb-4">
                                    <Typography variant="h3" className="group-letter">Groupe {group.name}</Typography>
                                </div>
                                <Row xs={2} className="g-3">
                                    {group.teams.map((team) => (
                                        <Col key={team.id}>
                                            <div className="team-item">
                                                <img
                                                    src={new URL(`../../assets/flags/${team.code}.png`, import.meta.url).href}
                                                    alt={team.code}
                                                    className="team-flag-group"
                                                />
                                                <div className="team-name">{team.name}</div>
                                                <Badge className="team-code-small">{team.code}</Badge>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </Box>
        </>
    );
}

export default PageGroupes