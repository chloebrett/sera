import { Layout } from '../layouts/Layout';

const AboutPage = () => {
  return (
    <Layout title="SERA | About" backButtonVisible={true}>
      <div>
        <p className="pb-5 text-3xl font-bold text-center">About SERA</p>
        <div className="flex flex-col items-center">
          <div className="flex flex-col text-xl text-center gap-9 max-w-prose">
            <p>
              SERA (Software Engineering Research Assistant) is a tool
              developed by a student research team at Monash University
              to address the challenge of finding best practices, tools, and
              methodologies conducting human centric software engineering user studies.
            </p>
            <p>
              Software engineering research often involves interaction with
              human participants at different stages throughout the software
              development life cycle. All human participants possess differences
              in various human aspects such as age, gender, culture, and physical
              and cognitive abilities. Typically, researchers rely on their own
              experience, the experience of their colleagues, or information
              found through a time-consuming investigation on how to best
              interact with different groups of people.
            </p>
            <p>
              There are a number of issues associated with those sources. Some
              information or ethical considerations may be missed, older
              techniques may no longer apply (particularly in the new post-COVID era
              of online user research), the required knowledge may not
              be accessible, and it can be time consuming to mitigate all these
              risks.
            </p>
            <p>
              The aim is to make SERA the prime source for researchers
              - particularly software engineering researchers - to find advice on
              how to work with various groups of people. It allows researchers
              to specify the cohorts they are focussed on, and easily find information
              on how to best perform research with that cohort.
              Additionally, researchers can submit their own content
              to give advice to their peers, creating an open community of
              knowledge sharing.
            </p>
            <p>Developed for the betterment of human centric studies.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
