import { useEffect, useState } from 'react';
import { AuthService } from '../../api/services/AuthService';
import { TicketService } from '../../api/services/TicketService';
import type { User } from '../../api/types/Auth';
import type { TicketListResponse } from '../../api/types/Tickets';
import './PageProfil.css';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PersonIcon from '@mui/icons-material/Person';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

type TabType = 'pending' | 'confirmed' | 'used';

export default function PageProfil() {

    const [profile, setProfile] = useState<User | null>(null);
    const [tickets, setTickets] = useState<TicketListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('pending');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, ticketsRes] = await Promise.all([
                    AuthService.me(),
                    TicketService.getAllUserTickets()
                ]);
                setProfile(userRes);
                setTickets(ticketsRes);
            } catch (err) {
                console.error('Erreur chargement profil', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="profil-loading">Chargement du profil...</div>;
    }

    if (!profile) {
        return <div className="profil-error">Impossible de charger le profil.</div>;
    }

    const tabs = [
        { id: 'pending', label: 'En attente', icon: <AccessTimeIcon />, count: tickets?.counts.pending || 0 },
        { id: 'confirmed', label: 'Payées', icon: <CheckCircleIcon />, count: tickets?.counts.confirmed || 0 },
        { id: 'used', label: 'Utilisées', icon: <ConfirmationNumberIcon />, count: tickets?.counts.used || 0 },
    ];

    const currentTickets = tickets?.grouped[activeTab] || [];

    return (
        <Box className="dark-page">
            <div className="profil-container">
                <div className="profil-card">
                    <div className="profil-avatar">
                        <PersonIcon />
                    </div>
                    <div className="profil-info">
                        <h1 className="profil-name">{profile.firstname} {profile.lastname}</h1>
                        <p className="profil-email">{profile.email}</p>
                        <p className="profil-birth">Né le {format(new Date(profile.birthDate), 'dd MMMM yyyy', { locale: fr })}</p>
                        <p className="profil-joined">Membre depuis {format(new Date(profile.createdAt), 'MMMM yyyy', { locale: fr })}</p>
                    </div>
                </div>

                <div className="profil-stats">
                    <div className="stat-item">
                        <div className="stat-number">{tickets?.counts.total || 0}</div>
                        <div className="stat-label">Billets</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{tickets?.counts.confirmed || 0}</div>
                        <div className="stat-label">Payés</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{tickets?.counts.used || 0}</div>
                        <div className="stat-label">Utilisés</div>
                    </div>
                </div>

                <div className="profil-orders">
                    <h2 className="orders-title">Historique des commandes</h2>

                    <div className="orders-tabs">
                        {tabs.map(tab => (
                            <button key={tab.id} className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id as TabType)}>
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                            {tab.count > 0 && <span className="tab-count">{tab.count}</span>}
                            </button>
                        ))}
                    </div>

                    <div className="orders-list">
                        {currentTickets.length === 0 ? (
                            <p className="no-orders">Aucun billet dans cette catégorie.</p>
                        ) : (
                            currentTickets.map((ticket) => (
                            <div key={ticket.id} className={`order-card status-${ticket.status}`}>
                                <div className="order-header">
                                    <div className="match-info">
                                        <strong>{ticket.match?.homeTeam} vs {ticket.match?.awayTeam}</strong>
                                        <span className="match-date">{ticket.match?.matchDate && format(new Date(ticket.match.matchDate), 'dd MMM yyyy à HH:mm', { locale: fr })}</span>
                                    </div>
                                    <div className="order-status">
                                        {ticket.status === 'pending_payment' && <span className="status pending">En attente</span>}
                                        {ticket.status === 'confirmed' && <span className="status confirmed">Payé</span>}
                                        {ticket.status === 'used' && <span className="status used">Utilisé</span>}
                                    </div>
                                </div>

                                <div className="order-details">
                                    <div className="detail-row">
                                        <span>Stade:</span>
                                        <span>{ticket.match?.stadium}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Catégorie:</span>
                                        <span>{ticket.category.replace('CATEGORY_', 'Catégorie ')}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Prix:</span>
                                        <strong>{ticket.price} €</strong>
                                    </div>
                                </div>

                                {ticket.qrCode ? (
                                    <div className="qr-section">
                                        <QRCodeSVG
                                            value={ticket.qrCode}
                                            size={128}
                                            level="M"
                                            includeMargin={true}
                                        />
                                        <p>Présentez ce QR à l'entrée</p>
                                    </div>
                                    ) : (
                                    <p className="text-muted">QR code non disponible</p>
                                )}
                            </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Box>
    );
}