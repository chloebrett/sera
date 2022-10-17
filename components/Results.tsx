import { BestPractice } from "../shared/sharedTypes";
import BestPracticeCard from "./BestPracticeCard";
import SearchOffIcon from '@mui/icons-material/SearchOff';
interface Props {
  filteredBestPractices:  BestPractice[];
}

const Results = ({
  filteredBestPractices
}: Props) => {

  
  const displayedBestPractices = filteredBestPractices?.map(
    (bestPractice: BestPractice) => (
      <BestPracticeCard key={bestPractice.id} bestPractice={bestPractice} />
    )
  );

  const noResults = 
  <div className="pt-10 text-2xl"><SearchOffIcon></SearchOffIcon> No Results Found</div>

  return (
    <div className="flex flex-col" id="results">
        {displayedBestPractices.length > 0 ? displayedBestPractices : noResults}
    </div>
  );
};

export default Results;
