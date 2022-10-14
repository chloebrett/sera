import content from "../framework/compiledContent";
import useLocalStorage from "use-local-storage";
import { Layout } from "../layouts/Layout";
import BestPracticeCard from "../components/BestPracticeCard";

const BestPractice = () => {
  const [favourites] = useLocalStorage(
    "favourited-best-practices",
    {}
  );

  const favouritesIds = new Set(
    Object.keys(favourites).filter(
      (key) => favourites[key as keyof typeof favourites]
    )
  );

  const bestPractices = content.bestPractices.filter((bestPractice) =>
    favouritesIds.has(bestPractice.id)
  );

  return (
    <Layout title="SERA | Favourites" backButtonVisible={true}>
      <div className="flex flex-col items-center justify-center min-h-screen pt-20">
        <p className="pb-5 text-3xl font-bold text-center">Your Favourited Best Practices</p>
        <div className="flex justify-center flex-col">
          {bestPractices.map((bestPractice) => (
            <BestPracticeCard key={bestPractice.id} bestPractice={bestPractice} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BestPractice;
