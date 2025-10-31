import { useEffect, useState } from "react";
import { MatchService } from "../api/services/MatchService";
import type { MatchAvailability } from "../api/types/Match";

function MatchList() {

    const [matches, setMatches] = useState<MatchAvailability[]>([]);

    useEffect(() => {MatchService.getAllMatchesWithAvailability().then(setMatches);}, []);

    return (
        <div>
            <h2>Calendrier des matchs</h2>
            {matches.map((match) => (
                <div key={match.id}>
                    <h3>
                        {match.homeTeam.name} vs {match.awayTeam.name}
                    </h3>
                    <p><strong>Date :</strong> {new Date(match.date).toLocaleString()}</p>
                    <p><strong>Lieu :</strong> {match.stadium.name}, {match.stadium.city}, {match.stadium.country}</p>
                    <p><strong>Places disponibles :</strong> {match.availableSeats}</p>

                    <div>
                        <h4>Tarifs :</h4>
                        <ul>
                        {Object.entries(match.categories).map(([cat, info]) => (
                            <li key={cat}>
                            {cat} — {info.available ? `${info.price}€ (places: ${info.availableSeats})` : "Indisponible"}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MatchList;
