import { BestPractice } from "../shared/sharedTypes";
import Link from "next/link";
import useLocalStorage from "use-local-storage";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';

interface Props {
  bestPractice: BestPractice;
}

const BestPracticeCard = ({ bestPractice }: Props) => {
  const [favourites, setFavourites] = useLocalStorage(
    "favourited-best-practices",
    {}
  );

  const toggleFavourited = (bestPracticeId: string) =>
    setFavourites((prev) => ({
      ...prev,
      [bestPracticeId]:
        !(prev ?? {})[bestPracticeId as keyof typeof prev] ?? true,
    }));

  const isFavourited = (bestPracticeId: string) =>
    bestPracticeId in favourites &&
    favourites[bestPracticeId as keyof typeof favourites] === true;

  if (bestPractice === undefined) {
    return null;
  }

  return (
    <div className="flex max-w-5xl p-5 mb-5 bg-gray-200 rounded-lg dark:bg-gray-900" key={bestPractice.id} data-publish-date={bestPractice.publishDate} data-submission-date={bestPractice.submissionDate}>
      <div className="pr-2">
        <button onClick={() => toggleFavourited(bestPractice.id)}>
          {isFavourited(bestPractice.id) ? <StarIcon /> : <StarOutlineIcon />}
        </button>
      </div>
      <div className="flex flex-col flex-grow">
        <p className="font-bold">{bestPractice.summary ?? bestPractice.paperName}</p>
        <pre className="pt-2 font-sans whitespace-pre-wrap">{bestPractice.bestPractices}</pre>
        <a href={`/bestPractice/${bestPractice.id}`}>
          <p className="pt-2 font-bold text-right cursor-pointer">View More Details</p>
        </a>
      </div>
    </div>
  );
};

export default BestPracticeCard;
