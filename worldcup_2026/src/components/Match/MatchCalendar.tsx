import { useState, useEffect } from 'react';
import { MatchService } from '../../api/services/MatchService';
import type { MatchAvailability } from '../../api/types/Match';
import fifaLogo from '../../assets/fifa-world-cup-2026-logo.png';


interface CellMatch {
    match: MatchAvailability;
    time: string;
}

function MatchCalendar() {

    const [allMatches, setAllMatches] = useState<MatchAvailability[]>([]);
    const [filteredMatches, setFilteredMatches] = useState<MatchAvailability[]>([]);
    const [loading, setLoading] = useState(true);

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
            const selected = new Date(dateFilter);
            const selectedStr = selected.toISOString().split('T')[0];
            filtered = filtered.filter(m => m.date.startsWith(selectedStr));
        }

        setFilteredMatches(filtered);

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

    const getMatchColor = (match: MatchAvailability) => {
        const group = match.homeTeam.groupId;
        const colors: Record<number, string> = {
            1: 'bg-danger',
            2: 'bg-warning',
            3: 'bg-success',
            4: 'bg-info',
            5: 'bg-primary',
            6: 'bg-secondary',
            7: 'bg-dark',
            8: 'bg-success',
        };
        return colors[group] || 'bg-primary';
    };


    if (loading) {
        return <div className="text-center py-5">Chargement...</div>;
    }

    const currentDates = dates();
    const currentStadiums = stadiums();
    const currentMatchesByStadiumAndDate = groupMatchesByStadiumAndDate();


    return (
        
        <div className="container-fluid">
            <h1 className="mt-3 mb-3 text-center">Le calendrier des matches</h1>
            {/* Filtres */}
            <div className="row g-3 mb-4 align-items-center">

                <div className="col-md-3">
                    <input type="text" className="form-control form-control-sm" placeholder="Nom de l'équipe..."
                        value={teamFilter} onChange={e => setTeamFilter(e.target.value)}/>
                </div>

                <div className="col-md-2">
                    <input type="number" className="form-control form-control-sm" placeholder="Groupe ID" value={groupFilter}
                        onChange={e => setGroupFilter(e.target.value)} min="1" />
                </div>

                <div className="col-md-2">
                    <input type="date" className="form-control form-control-sm" value={dateFilter} 
                        onChange={(e) => setDateFilter(e.target.value)}/>
                </div>

                <div className="col-md-1">
                    <button className="btn btn-success btn-sm w-100" onClick={applyFilters}>Confirmer</button>
                </div>
                
                <div className="col-md-1">
                    <button className="btn btn-outline-danger btn-sm w-100" onClick={clearFilters}>Effacer</button>
                </div>
            </div>

            {/* Table */}
            <div className="card border-0 shadow-sm mb-2">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-sm table-bordered mb-0 align-middle">

                            <thead className="bg-dark text-white">
                                <tr>
                                    <th className="text-start sticky-left bg-dark p-3">
                                        <img src={fifaLogo} alt="FIFA World Cup 2026" className="img-fluid" style={{ maxHeight: '40px' }}/>
                                    </th>
                                    
                                    {currentDates.map(date => (
                                        <th key={date} className="text-center bg-warning text-dark">
                                            {formatDateHeader(date)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {currentStadiums.map(stadium => (
                                    <tr key={stadium.id}>

                                        <td className="text-start fw-semibold sticky-left bg-light">
                                            <div>{stadium.name}</div>
                                            <div className="text-muted small">{stadium.city}</div>
                                        </td>

                                        {currentDates.map(date => {
                                            const cellMatches = currentMatchesByStadiumAndDate.get(stadium.id)?.get(date) || [];
                                            return (

                                                <td key={date} className="p-1">
                                                    {cellMatches.length > 0 ? (
                                                        <div className="d-flex flex-column gap-1">
                                                            {cellMatches.map((cm, idx) => (

                                                                <div key={idx} className={`badge ${getMatchColor(cm.match)} text-white text-start p-2`}
                                                                    style={{fontSize: '0.65rem',cursor: 'pointer',lineHeight: '1.1',}}>

                                                                    <div className="fw-bold">{cm.time}</div>
                                                                    <div>{cm.match.homeTeam.code} vs {cm.match.awayTeam.code}</div>

                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (<div className="text-center text-muted" style={{ fontSize: '0.7rem' }}>—</div>)}
                                                </td>

                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchCalendar;