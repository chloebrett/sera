import content from '../../framework/compiledContent';
import { useRouter } from "next/router";
import BestPracticeDisplay from "../../components/BestPracticeDisplay";
import { Layout } from "../../layouts/Layout";


const BestPractice = () => {
  const router = useRouter()
  const { id } = router.query;

  const bestPractice = content.bestPractices.find((bestPractice) => bestPractice.id === id);

  if (bestPractice === undefined) {
    return null;
  }

  return (
    <Layout title="SERA | Software Engineering Research Assistant" backButtonVisible={true}>
      <div className="dark:bg-black dark:text-white">
        <div className="flex px-4 mt-10 font-bold row grid place-content-center place-content-center">
          <div className="flex flex-col flex-grow inline text-3xl text-center">
            <h1>{bestPractice.summary ? bestPractice.summary : bestPractice.paperName}</h1>
          </div>
        </div>
        <BestPracticeDisplay bestPractice={bestPractice} />
      </div>
    </Layout>
  );
};

export default BestPractice;
