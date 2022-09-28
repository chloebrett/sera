import content from "../framework/compiledContent";
import Link from "next/link";
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

  const backURL = window.location.origin;

  const bestPractices = content.bestPractices.filter((bestPractice) =>
    favouritesIds.has(bestPractice.id)
  );

  return (
    <Layout title="Persona | Favourites" backButtonRef={new URL(backURL)}>
      <div>
        <p className="pb-5 text-3xl font-bold text-center">Your Favourited Best Practices</p>
        <div className="flex justify-center">
          {bestPractices.map((bestPractice) => (
            <BestPracticeCard key={bestPractice.id} bestPractice={bestPractice} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BestPractice;
