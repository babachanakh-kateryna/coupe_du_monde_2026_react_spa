import { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../api/services/AuthService';
import ToastNotification from './Common/ToastNotification';
import { useApp } from './hooks/AuthContext';

function Connexion() {

    const [tab, setTab] = useState(0);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const navigate = useNavigate();
    const { login, refreshCart } = useApp();

    // Login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AuthService.signin(loginEmail, loginPassword);
            await login();
            await refreshCart();
            setToast({ type: 'success', message: 'Connexion réussie !' });
            navigate('/', { replace: true });
        } catch {
            setToast({ type: 'error', message: 'Identifiants incorrects' });
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AuthService.signup({ firstname, lastname, email, password, birthDate });
            await login();
            await refreshCart();
            setToast({ type: 'success', message: 'Compte créé ! Bienvenue !' });
            navigate('/', { replace: true });
        } catch (err: any) {
            setToast({ type: 'error', message: err.response?.data?.message || 'Erreur' });
        }
    };

    return (
        <Box className="dark-page">
        
        <Container maxWidth="sm" className="connexion-container">
            <Paper elevation={8} className="connexion-paper">
                <Box className="text-center mb-4">
                    <Typography variant="h4" className="connexion-title">Coupe du Monde 2026</Typography>
                </Box>

                <Tabs value={tab} onChange={(_, v) => setTab(v)} centered className="connexion-tabs">
                    <Tab label="Se connecter" />
                    <Tab label="Créer un compte" />
                </Tabs>

                {tab === 0 ? (
                <form onSubmit={handleLogin}>
                    <TextField fullWidth label="Email" type="email" margin="normal" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                    <TextField fullWidth label="Mot de passe" type="password" margin="normal" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                    <Button type="submit" fullWidth variant="contained" size="large" className="connexion-button mt-2">Se connecter</Button>
                </form>
                ) : (
                <form onSubmit={handleSignup}>
                    <TextField fullWidth label="Prénom" margin="normal" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                    <TextField fullWidth label="Nom" margin="normal" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                    <TextField fullWidth label="Email" type="email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <TextField fullWidth label="Mot de passe" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <TextField fullWidth label="Date de naissance" type="date" InputLabelProps={{ shrink: true }} margin="normal" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                    <Button type="submit" fullWidth variant="contained" size="large" color="success" className="connexion-button mt-2">Créer mon compte</Button>
                </form>
                )}
            </Paper>

            {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </Container>
        </Box>
    );
}

export default Connexion;