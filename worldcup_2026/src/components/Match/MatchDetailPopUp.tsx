import type { MatchAvailability } from '../../api/types/Match';
import { Dialog } from '@mui/material';

interface MatchDetailPopUpProps {
  match: MatchAvailability | null;
  show: boolean;
  onHide: () => void;
}

function MatchDetailPopUp({ match, show, onHide }: MatchDetailPopUpProps) {
  if (!match) return null;


  return (
    <Dialog open={show} onClose={onHide} className="match-detail-dialog" maxWidth="md">

     
    </Dialog>
  );
};

export default MatchDetailPopUp;