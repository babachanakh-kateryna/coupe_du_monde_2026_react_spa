import { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Button, Divider,
  CircularProgress, IconButton,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AuthContext';
import { TicketService } from '../../api/services/TicketService';
import ToastNotification from '../Common/ToastNotification';

function PagePanier() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { refreshCart } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await TicketService.getPendingTickets();
      setCart(data);
    } catch {
      setToast({ type: 'error', message: 'Impossible de charger le panier' });
    } finally {
      setLoading(false);
    }
  };

  const removeTicket = async (ticketId: string) => {
    try {
      await TicketService.removePendingTicket(ticketId);
      setToast({ type: 'success', message: 'Billet retiré' });
      await loadCart();
      await refreshCart();
    } catch {
      setToast({ type: 'error', message: 'Erreur' });
    }
  };

  const payNow = async () => {
    try {
      await TicketService.payAllPendingTickets();
      setToast({ type: 'success', message: 'Paiement réussi ! Redirection...' });
      await loadCart();
      await refreshCart();
      setTimeout(() => navigate('/mes-tickets'), 1500);
    } catch {
      setToast({ type: 'error', message: 'Échec du paiement' });
    }
  };

  if (loading) {
    return (
      <Container sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!cart || cart.tickets.length === 0) {
    return (
      <Container sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Votre panier est vide
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/matchs')}
          sx={{ borderRadius: 3, px: 5, py: 1.5 }}
        >
          Choisir des matchs
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
        Mon Panier
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* === ЛЕВАЯ ЧАСТЬ — СПИСОК БИЛЕТОВ === */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            {cart.tickets.map((ticket: any) => (
              <Box
                key={ticket.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 3,
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: '0.2s',
                  '&:hover': { borderColor: 'primary.main', boxShadow: 1 }
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {ticket.match.homeTeam} vs {ticket.match.awayTeam}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {ticket.match.stadium}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(ticket.match.matchDate).toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                  <Typography variant="caption" color="primary">
                    Catégorie {ticket.category.replace('CATEGORY_', '')}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right', ml: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {ticket.price} €
                  </Typography>
                  <IconButton size="small" color="error" onClick={() => removeTicket(ticket.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* === ПРАВАЯ ЧАСТЬ — ИТОГ И ОПЛАТА === */}
        <Box
          sx={{
            width: { xs: '100%', md: '380px' },
            alignSelf: 'flex-start',
            position: { md: 'sticky' },
            top: 100
          }}
        >
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 3,
              p: 4,
              backgroundColor: 'grey.50'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Récapitulatif
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Sous-total</Typography>
                <Typography>{cart.totalPrice} €</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Frais</Typography>
                <Typography color="text.secondary">0 €</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {cart.totalPrice} €
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Réservation expire à {new Date(cart.expiresAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={payNow}
              sx={{
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 700,
                textTransform: 'none'
              }}
            >
              Payer {cart.totalPrice} €
            </Button>
          </Box>
        </Box>
      </Box>

      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </Container>
  );
}

export default PagePanier;