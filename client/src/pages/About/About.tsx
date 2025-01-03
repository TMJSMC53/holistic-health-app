import BackButton from '../../components/BackButton';

const About = () => {
  return (
    <>
      <div className="ml-4">
        <BackButton />
      </div>
      <div className="text-16 my-8 md:text-20 md:mt-12 mx-6 md:mx-10 text-justify font-poppins">
        <p className="mb-4">
          At
          <span className="text-20 md:text-24 font-cedarville text-primary-700 ml-2">
            Holistic Health
          </span>
          , we're dedicated to empowering individuals to lead healthier lives.
          Our app is a comprehensive tool designed to help you track various
          aspects of your well-being, including fluid and water intake, sleep
          patterns, meditation practices, and daily notes. More than just a
          tracker, our app is a personalized health companion that keeps you
          motivated and focused on your wellness journey.
        </p>
        <p>
          Whether you're looking to stay hydrated, improve your sleep quality,
          or enhance your mindfulness practices, our app provides the tools and
          insights you need to achieve your goals. Whether you're on the go, on
          vacation, or at home, managing your health lifestyle is easy and
          convenient with the Holistic Health app. Join us in embracing a
          healthier lifestyle today.
        </p>
      </div>
    </>
  );
};

export default About;
