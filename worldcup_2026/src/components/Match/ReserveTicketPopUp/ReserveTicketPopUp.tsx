import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Alert, Box } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { TicketService } from '../../../api/services/TicketService';
import type { MatchAvailability } from '../../../api/types/Match';
import type { TicketCategory } from '../../../api/types/Tickets';
import "./ReserveTicketPopUp.css"

interface TicketReserveDialogProps {
  match: MatchAvailability;
  open: boolean;
  onClose: () => void;
  onSuccess: (added: number) => void;
}

export function ReserveTicketPopUp({match,open,onClose,onSuccess}: TicketReserveDialogProps) {
  
  const [category, setCategory] = useState<TicketCategory | ''>('');
  const [quantity, setQuantity] = useState(1);

  const availableCategories = Object.entries(match.categories || {})
    .filter(([_, info]) => info.available)
    .map(([cat]) => cat as TicketCategory);

  const selectedInfo = category ? match.categories?.[category] : null;
  const canAdd = category && selectedInfo && selectedInfo.availableSeats >= quantity;

  const handleAdd = async () => {
    if (!canAdd || !category) return;

    try {
      await TicketService.addTickets({
        matchId: match.id,
        category: category as TicketCategory,
        quantity
      });

      onSuccess(quantity);
      onClose();
    } catch (err) {
      console.error('Erreur:', err);
    }

  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Réserver : {match.homeTeam.name} vs {match.awayTeam.name}</DialogTitle>

      <DialogContent>
        {availableCategories.length === 0 ? (
          <Alert severity="error">Aucune place disponible pour ce match.</Alert>
        ) : (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Catégorie</InputLabel>
              <Select value={category} label="Catégorie" onChange={(e) => setCategory(e.target.value as TicketCategory)}>
                {availableCategories.map((cat) => {
                  const info = match.categories![cat];
                  return (
                    <MenuItem key={cat} value={cat}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span>{cat.replace(/_/g, ' ')}</span>
                        <span>{info.price} €</span>
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Quantité (1-6)</InputLabel>
              <Select value={quantity} label="Quantité (1-6)" onChange={(e) => setQuantity(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <MenuItem key={n} value={n} >{n} billet{n > 1 ? 's' : ''}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedInfo && (
              <Alert severity={canAdd ? 'success' : 'warning'}>
                {canAdd
                  ? `${selectedInfo.availableSeats} places disponibles`
                  : `Seulement ${selectedInfo.availableSeats} place${selectedInfo.availableSeats > 1 ? 's' : ''} disponible${selectedInfo.availableSeats > 1 ? 's' : ''}`
                }
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions className="reserve-dialog-actions">
        <Button className="cancel-button" onClick={onClose}>Annuler</Button>
        <Button className="add-button" variant="contained" startIcon={<AddShoppingCartIcon />} onClick={handleAdd} disabled={!canAdd} >
          {`Ajouter (${selectedInfo ? selectedInfo.price * quantity : 0} €)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}