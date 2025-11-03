import { Modal, Button, Form } from 'react-bootstrap';

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
                        <Form.Control type="text" placeholder="ex: France" value={teamFilter}
                            onChange={(e) => setTeamFilter(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Filtre par groupe</Form.Label>
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
