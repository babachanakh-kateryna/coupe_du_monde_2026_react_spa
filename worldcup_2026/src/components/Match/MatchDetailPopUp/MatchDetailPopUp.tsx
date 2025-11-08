import type { MatchAvailability } from '../../../api/types/Match';
import './MatchDetailPopUp.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Chip, Divider, Stack } from '@mui/material';
import StadiumIcon from '@mui/icons-material/Stadium';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { ReserveTicketPopUp } from '../ReserveTicketPopUp/ReserveTicketPopUp';
import { useState } from 'react';
import { useApp } from '../../AuthContext';
import ToastNotification from '../../Common/ToastNotification';

interface MatchDetailPopUpProps {
  match: MatchAvailability | null;
  show: boolean;
  onHide: () => void;
}

function MatchDetailPopUp({ match, show, onHide }: MatchDetailPopUpProps) {
  const [showReserve, setShowReserve] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info'}>({
    open: false, message: '', type: 'success'
  });
  const { state, refreshCart } = useApp();

  if (!match) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'warning';
      case 'ongoing': return 'success';
      case 'finished': return 'error';
      default: return 'info';
    }
  };

  const handleReserveClick = () => {
    if (!state.isAuthenticated) {
      setToast({
        open: true,
        message: 'Vous devez être connecté pour réserver des billets.',
        type: 'warning'
      });
      return;
    }
    setShowReserve(true);
  };

  const handleSuccess = async (count: number) => {
    setToast({
      open: true,
      message: `${count} billet${count > 1 ? 's' : ''} ajouté${count > 1 ? 's' : ''} au panier !`,
      type: 'success'
    });
  };

  return (
    <Dialog open={show} onClose={onHide} className="match-detail-dialog" maxWidth="md">

      <DialogTitle className="dialog-title">
        <div className="match-title">{match.homeTeam.name} vs {match.awayTeam.name}</div>
        <div className="d-flex justify-content-center gap-2 mb-2">
          <img src={new URL(`../../../assets/flags/${match.homeTeam.code}.png`, import.meta.url).href}
              alt={match.homeTeam.code} className="team-flag-detail"/>          
            <span className="teams-vs">VS</span>
          <img src={new URL(`../../../assets/flags/${match.awayTeam.code}.png`, import.meta.url).href}
              alt={match.awayTeam.code} className="team-flag-detail"/>
        </div>
      </DialogTitle>

      <DialogContent dividers className='no-scrollbar'>
        <Stack spacing={3}>

          {/* Stadium */}
          <div className="d-flex align-items-center gap-3">
            <StadiumIcon className="info-icon stadium-icon" />
            <div>
              <Typography variant="body2" color="text.secondary">Stade</Typography>
              <Typography variant="h6" fontWeight="bold"> {match.stadium.name}</Typography>
              <Typography variant="body2" color="text.secondary">{match.stadium.city}, {match.stadium.country}</Typography>
            </div>
          </div>

          {/* Date & Time */}
          <div className="d-flex align-items-center gap-3">
            <CalendarTodayIcon className="info-icon date-icon" />
            <div>
              <Typography variant="body2" color="text.secondary">Date</Typography>
              <Typography variant="h6" fontWeight="bold">{formatDate(match.date)}</Typography>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <AccessTimeIcon className="info-icon time-icon" />
            <div>
              <Typography variant="body2" color="text.secondary">Heure</Typography>
              <Typography variant="h6" fontWeight="bold">{formatTime(match.date)} (Heure locale)</Typography>
            </div>
          </div>

          <Divider />

          {/* Status & Stage */}
          <div className="d-flex justify-content-between">
            <div>
              <Typography variant="body2" color="text.secondary">Statut</Typography>
              <Chip label={match.status} color={getStatusColor(match.status)} size="small" />
            </div>
            <div className="text-end">
              <Typography variant="body2" color="text.secondary">Phase</Typography>
              <Typography variant="subtitle1" fontWeight="bold">{match.stage}</Typography>
            </div>
          </div>

          <Divider />

          {/* Ticket Categories */}
          <div>
            <div className="d-flex align-items-center gap-1 mb-3">
              <ConfirmationNumberIcon className="info-icon ticket-icon" />
              <Typography variant="h6" fontWeight="bold">Billets disponibles</Typography>
            </div>
            {match.categories ? (
              <Stack spacing={1}>
                {Object.entries(match.categories).map(([cat, info]) => (
                  <div key={cat} className={`ticket-category ${info.available ? 'available' : 'sold-out'}`}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Typography variant="subtitle1" fontWeight="bold">{cat.replace(/_/g, ' ')}</Typography>
                        <Typography variant="body2" color="text.secondary">{info.availableSeats} places disponibles</Typography>
                      </div>
                      <Typography variant="h6" fontWeight="bold" color={info.available ? 'success.main' : 'error.main'}>{info.price} €</Typography>
                    </div>
                  </div>
                ))}
              </Stack>
            ) : ( <Typography color="text.secondary" textAlign="center">Chargement des disponibilités...</Typography>)}
          </div>
        </Stack>
      </DialogContent>

      <DialogActions className="d-flex justify-content-center mt-2">
        <Button className="reserve-button" onClick={handleReserveClick}>Réserver Maintenant</Button>
      </DialogActions>

      {/* Reserve Popup */}
      {showReserve && match && (
        <ReserveTicketPopUp
          match={match}
          open={showReserve}
          onClose={() => setShowReserve(false)}
          onSuccess={handleSuccess}
          refreshCart={refreshCart}
        />
      )}

      {/* Toast */}
      {toast.open && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, open: false })}
        />
      )}

    </Dialog>
  );
};

export default MatchDetailPopUp;