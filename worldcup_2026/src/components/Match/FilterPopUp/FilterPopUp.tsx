import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { TeamService } from '../../../api/services/TeamService';
import type { Team } from '../../../api/types/Team';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './FilterPopUp.css';

interface FilterModalProps {
    show: boolean;
    onClose: () => void;
    teamFilter: string;
    setTeamFilter: (val: string) => void;
    groupFilter: string;
    setGroupFilter: (val: string) => void;
    dateFilter: string;
    setDateFilter: (val: string) => void;
    onApply: () => void;
    onClear: () => void;
}

function FilterPopUp({show,onClose,teamFilter,setTeamFilter,groupFilter,setGroupFilter,dateFilter,setDateFilter,onApply,onClear}: FilterModalProps) {

    const [teams, setTeams] = useState<Team[]>([]);
    const [loadingTeams, setLoadingTeams] = useState(true);

    useEffect(() => {
        const loadTeams = async () => {
            try {
                setLoadingTeams(true);
                const data = await TeamService.getTeams();
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                setTeams(sorted);
            } catch (err) {
                console.error('Erreur:', err);
            } finally {
                setLoadingTeams(false);
            }
        };
        if (show) loadTeams();
    }, [show]);

    return (
        <Modal show={show} onHide={onClose} centered>

            <Modal.Header closeButton>
                <Modal.Title>Filtres</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Filtre par équipe</Form.Label>
                        
                        <Autocomplete
                            fullWidth
                            options={teams}
                            getOptionLabel={(option) => `${option.name} (${option.code})`}
                            loading={loadingTeams}
                            value={teams.find(t => t.name === teamFilter) || null}
                            onChange={(_event, newValue) => {setTeamFilter(newValue ? newValue.name : '');}}
                            renderInput={(params) => (

                                <TextField
                                    {...params}
                                    placeholder="Rechercher une équipe..."
                                    
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                <img
                                    src={new URL(`../../../assets/flags/${option.code}.png`, import.meta.url).href}
                                    alt={option.code}
                                    className="team-flag-filter"
                                    style={{ width: 24, height: 16, marginRight: 8 }}
                                />
                                {option.name} ({option.code})
                                </li>
                            )}
                        />
                        
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Filtre par ID de groupe</Form.Label>
                        <Form.Control type="number" min={1} placeholder="ex: 3" value={groupFilter}
                            onChange={(e) => setGroupFilter(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClear}>Effacer</Button>
                <Button variant="primary" onClick={onApply}>Appliquer</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FilterPopUp;
