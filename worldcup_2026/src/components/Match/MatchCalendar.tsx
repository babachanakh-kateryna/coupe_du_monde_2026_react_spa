import { useState, useEffect } from 'react';
import { MatchService } from '../../api/services/MatchService';
import type { MatchAvailability } from '../../api/types/Match';
import fifaLogo from '../../assets/fifa-world-cup-2026-logo.png';
import ToastNotification from '../Common/ToastNotification';
import './MatchCalendar.css';
import FilterPopUp from './FilterPopUp';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Button, Card, Typography, Box, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

interface CellMatch {
    match: MatchAvailability;
    time: string;
}

function MatchCalendar() {

    const [allMatches, setAllMatches] = useState<MatchAvailability[]>([]);
    const [filteredMatches, setFilteredMatches] = useState<MatchAvailability[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilterPopUp, setShowFilterPopUp] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

    // filters
    const [teamFilter, setTeamFilter] = useState('');
    const [groupFilter, setGroupFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');


    // loading
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await MatchService.getAllMatchesWithAvailability();
                setAllMatches(data);
                setFilteredMatches(data);
            } catch (err) {
                console.error('Erreur:', err);
                setToast({type: 'error',message: 'Impossible de charger les matchs. Veuillez réessayer.',});
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // filtres de matches
    const applyFilters = () => {
        let filtered = [...allMatches];

        if (teamFilter) {
            const lower = teamFilter.toLowerCase();
            filtered = filtered.filter(
                m => m.homeTeam.name.toLowerCase().includes(lower) || m.awayTeam.name.toLowerCase().includes(lower)
            );
        }

        if (groupFilter) {
            const groupId = Number(groupFilter);
            if (!isNaN(groupId)) {
                filtered = filtered.filter(
                    m => m.homeTeam.groupId === groupId || m.awayTeam.groupId === groupId
                );
            }
        }

        if (dateFilter) {
            const d = new Date(dateFilter);
            filtered = filtered.filter(m => new Date(m.date).toDateString() === d.toDateString());
        }

        setFilteredMatches(filtered);

        // if nothing found so - toast message
        if (filtered.length === 0) {
            setToast({ type: 'warning',message: 'Aucun match ne correspond à vos critères.',});

            //clear les filtres
            clearFilters();
        }
    };

    const clearFilters = () => {
        setTeamFilter('');
        setGroupFilter('');
        setDateFilter('');
        setFilteredMatches(allMatches);
    };

    // groupe by : stadiumId → date → matches
    const groupMatchesByStadiumAndDate = () => {
        const map = new Map<number, Map<string, CellMatch[]>>();

        filteredMatches.forEach(match => {
            const stadiumId = match.stadium.id;
            const dateKey = match.date.split('T')[0];
            const time = new Date(match.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit' });

            if (!map.has(stadiumId)) map.set(stadiumId, new Map());
            
            const dateMap = map.get(stadiumId)!;
            
            if (!dateMap.has(dateKey)) dateMap.set(dateKey, []);
            dateMap.get(dateKey)!.push({ match, time });
        });

        // trier par date
        map.forEach(dateMap => {
            dateMap.forEach(dayMatches => {
                dayMatches.sort((a, b) => a.match.date.localeCompare(b.match.date));
            });
        });

        return map;
    };

    // unique stadiums
    const stadiums = () => {
        const unique = new Map<number, MatchAvailability['stadium']>();
        filteredMatches.forEach(m => unique.set(m.stadium.id, m.stadium));
        return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
    };

    // unique dates
    const dates = () => {
        const set = new Set<string>();
        filteredMatches.forEach(m => set.add(m.date.split('T')[0]));
        return Array.from(set).sort();
    };

    const formatDateHeader = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
        const weekday = date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');

        return (
            <div className="text-center">
                <div className="fw-bold">{day}</div>
                <div className="small text-dark">{month}</div>
                <div className="small text-muted">{weekday}</div>
            </div>
        );
    };

    if (loading) {
        return <div className="text-center py-5">Chargement...</div>;
    }

    const currentDates = dates();
    const currentStadiums = stadiums();
    const currentMatchesByStadiumAndDate = groupMatchesByStadiumAndDate();


    return (

        <Box className="match-calendar-container ms-5 me-5 mb-5">
            <Box className="d-flex justify-content-between align-items-center mb-4 mt-4">
                <Typography variant="h3" className="page-title">Le calendrier des matchs</Typography>
                <Button className="glass-button" startIcon={<FilterListIcon />} 
                    onClick={() => setShowFilterPopUp(true)}>Filtrer</Button>
            </Box>


            <FilterPopUp
                show={showFilterPopUp}
                onClose={() => setShowFilterPopUp(false)}
                teamFilter={teamFilter}
                setTeamFilter={setTeamFilter}
                groupFilter={groupFilter}
                setGroupFilter={setGroupFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                onApply={() => { applyFilters(); setShowFilterPopUp(false); }}
                onClear={() => { clearFilters(); setShowFilterPopUp(false); }}
            />


            <Card className="calendar-card">
                <div className="table-scroll-container no-scrollbar">

                    <Table stickyHeader className="match-table">

                        <TableHead>
                            <TableRow>
                                <TableCell className="logo-cell"><img src={fifaLogo} alt="FIFA" className="fifa-logo" /></TableCell>
                                
                                {currentDates.map(date => (
                                    <TableCell key={date} className="date-cell">{formatDateHeader(date)}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody> {currentStadiums.map(stadium => (

                            <TableRow key={stadium.id} className="stadium-row">
                                <TableCell className="stadium-cell">
                                    <div className="stadium-name">{stadium.name}</div>
                                    <div className="stadium-city">{stadium.city}</div>
                                </TableCell>
                                
                                {currentDates.map(date => {
                                    const cellMatches = currentMatchesByStadiumAndDate.get(stadium.id)?.get(date) || [];
                                    return (
                                        <TableCell key={date} className="match-cell">
                                            {cellMatches.length > 0 ? (
                                                <div className="matches-stack">
                                                    {cellMatches.map((cm, idx) => (
                                                        <div key={idx} className={`match-card match-color-${cm.match.homeTeam.groupId % 8 || 8}`}>
                                                            <div className="match-time">{cm.time}</div>
                                                            <div className="match-teams">
                                                                <img src={new URL(`../../assets/flags/${cm.match.homeTeam.code}.png`, import.meta.url).href}
                                                                    alt={cm.match.homeTeam.code} className="team-flag" />
                                                                <span className="team-code">{cm.match.homeTeam.code}</span>
                                                                <span className="vs">vs</span>
                                                                <span className="team-code">{cm.match.awayTeam.code}</span>
                                                                <img src={new URL(`../../assets/flags/${cm.match.awayTeam.code}.png`, import.meta.url).href}
                                                                    alt={cm.match.homeTeam.code} className="team-flag" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (<div className="empty-cell">—</div> )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
      
      {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    
    </Box>
    );
};

export default MatchCalendar;