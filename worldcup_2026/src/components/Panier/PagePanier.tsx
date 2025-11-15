import { useEffect, useState } from 'react';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import { TicketService } from '../../api/services/TicketService';
import ToastNotification from '../Common/ToastNotification';
import "./PagePanier.css"
import { useApp } from '../hooks/AuthContext';
import type { TicketCartResponse } from '../../api/types/Tickets';

const LOCAL_STORAGE_KEY = 'worldcup2026_cart';

function PagePanier() {

    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
    const { state, refreshCart } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (state.isAuthenticated) {
            loadCart();
        } else {
            const local = loadLocalCart();
            if (local) {
                setCart(local);
            }
            setLoading(false);
        }
    }, [state.isAuthenticated]);

    const loadLocalCart = (): TicketCartResponse | null => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    };

    const saveLocalCart = (cartData: TicketCartResponse) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartData));
    };

    const clearLocalCart = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    };

    const loadCart = async () => {
        try {
            const data = await TicketService.getPendingTickets();
            setCart(data);
            saveLocalCart(data)
            return data;
        } catch {
            const localCart = loadLocalCart();
            if (localCart) {
                setCart(localCart);
                setToast({ type: 'warning', message: 'Panier chargé localement (hors ligne)' });
            } else {
                setToast({ type: 'error', message: 'Impossible de charger le panier' });
            }
            return null;
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
            const result = await TicketService.payAllPendingTickets();
            setToast({type: 'success', message: `Paiement réussi ! ${result.count} billet(s) confirmé(s).`});
            clearLocalCart();
            await refreshCart();
            
            setTimeout(() => {
                navigate('/profil');
            }, 2000);
        } catch (err) {
            setToast({type: 'error', message: 'Échec du paiement. Veuillez réessayer.'});
        }
    };

    // L'utilisateur n'est pas connecté
    if (!state.isAuthenticated && !loadLocalCart()) {
        return (
            <Box className="dark-page">
                <div className="cart-empty-container">
                    <div className="cart-empty-box">
                        <div className="alert cart-empty-alert" role="alert">
                        <strong>Pour voir votre panier,</strong><br />
                        veuillez vous connecter ou créer un compte.
                        </div>

                        <div className="cart-empty-buttons">
                            <button className="btn cart-empty-button cart-empty-button-primary"
                                onClick={() => navigate('/connexion')}>
                                <LoginIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                Se connecter
                            </button>
                            <button className="btn cart-empty-button cart-empty-button-outline"
                                onClick={() => navigate('/connexion')}>
                                <PersonAddIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                Créer un compte
                            </button>
                        </div>
                    </div>
                </div>
            </Box>
        );
    }

    if (loading) {
        return (
            <div className="cart-loading-wrapper">
                <div className="cart-loading-spinner"><CircularProgress size={60} /></div>
            </div>
        );
    }

    // empty
    if (!cart || cart.tickets.length === 0) {
        return (
            <Box className="dark-page">
                <div className="container">
                    <div className="cart-empty-content">
                    <h2 className="cart-empty-title">Votre panier est vide</h2>
                    <button className="btn cart-empty-back-button"
                        onClick={() => navigate('/matchs')}>
                        <ArrowBackIcon sx={{ fontSize: '1.2rem' }} />
                        Choisir des matchs
                    </button>
                    </div>
                </div>
            </Box>
        );
    }

    //panier
    return (
        <div className="cart-container">
            <Typography variant="h3" className="page-title text-center mb-4">Mon Panier</Typography>

            <div className="cart-grid">
            <div className="cart-tickets-list">
                {cart.tickets.map((ticket: any) => (
                <div key={ticket.id} className="cart-ticket-card">
                    <div className="cart-ticket-info">
                    <h6>
                        {ticket.match.homeTeam} vs {ticket.match.awayTeam}
                    </h6>
                    <p>{ticket.match.stadium}</p>
                    <p>
                        {new Date(ticket.match.matchDate).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                        })}
                    </p>
                    <span className="category">
                        Catégorie {ticket.category.replace('CATEGORY_', '')}
                    </span>
                    </div>

                    <div className="cart-ticket-price">
                    <h6>{ticket.price} €</h6>
                    <IconButton
                        size="small"
                        className="delete-btn"
                        onClick={() => removeTicket(ticket.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                    </div>
                </div>
                ))}
            </div>

            <div className="cart-summary">
                <div className="cart-summary-card">
                <h2 className="cart-summary-title">Récapitulatif</h2>

                <div className="cart-summary-row">
                    <span>Sous-total</span>
                    <span>{cart.totalPrice} €</span>
                </div>
                <div className="cart-summary-row">
                    <span style={{ color: '#777676ff' }}>Frais</span>
                    <span style={{ color: '#777676ff' }}>0 €</span>
                </div>

                <div className="cart-summary-divider"></div>

                <div className="cart-summary-row total">
                    <span>Total</span>
                    <span>{cart.totalPrice} €</span>
                </div>

                <p className="cart-summary-expiry">
                    Réservation expire à{' '}
                    {new Date(cart.expiresAt).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                    })}
                </p>

                <button
                    className="btn cart-pay-button"
                    onClick={payNow}
                >
                    <ShoppingCartCheckoutIcon />
                    Payer {cart.totalPrice} €
                </button>
                </div>
            </div>
            </div>

            {toast && (
            <ToastNotification
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(null)}
            />
            )}
        </div>
    );
}

export default PagePanier;  