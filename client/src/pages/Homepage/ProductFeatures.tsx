import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

const ProductFeatures = () => {
  return (
    <div className="container mx-auto py-24">
      <div className="mx-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
        {/* Feature 1 */}
        <div className="text-primary-600 bg-white p-6 md:py-6 md:px-4 border border-gray-100 rounded-8 shadow-custom">
          <FontAwesomeIcon
            icon={faDroplet}
            size="2xl"
            style={{ color: '#ff7e67' }}
          />
          <h3 className="text-20 lg:text-26 text-primary-500 font-playfair font-xtraBold mb-4 mt-4">
            Log Fluids
          </h3>
          <p className="text-14 lg:text-16 text-primary-600 font-poppins">
            Log all of your daily fluids, group your water intake by days, and
            customize your water goal on a weekly or monthly basis.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white p-6 md:py-6 md:px-4 border border-gray-100 rounded-8 shadow-custom">
          <FontAwesomeIcon
            icon={faCalendarCheck}
            size="2xl"
            style={{ color: '#ff7e67' }}
          />
          <h3 className="text-20 lg:text-26 text-primary-500  font-playfair font-semibold mb-4 mt-4">
            Habits
          </h3>
          <p className="text-14 lg:text-16 text-primary-600 font-poppins">
            Build Better Habits, One Day at a Time. Track your progress
            effortlessly with visual streaks and charts that keep you motivated.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white p-6 md:py-6 md:px-4 border border-gray-100 rounded-8 shadow-custom">
          <FontAwesomeIcon
            icon={faLink}
            size="2xl"
            style={{ color: '#ff7e67' }}
          />
          <h3 className="text-20 lg:text-26 text-primary-500 font-playfair font-xtraBold mb-4 mt-4">
            QuickLinks
          </h3>
          <p className="text-14 lg:text-16 text-primary-600 font-poppins">
            Effortlessly manage your go-to links with quick add and edit
            options. Highlight favorites for instant access to what matters
            most.
          </p>
        </div>
        {/* Feature 4 */}
        <div className="bg-white p-6 md:py-6 md:px-4 border border-gray-100 rounded-8 shadow-custom">
          <FontAwesomeIcon
            icon={faPenToSquare}
            size="2xl"
            style={{ color: '#ff7e67' }}
          />
          <h3 className="text-20 lg:text-26 text-primary-500 font-playfair font-xtraBold mb-4 mt-4">
            Notes
          </h3>
          <p className="text-14 lg:text-16 text-primary-600 font-poppins">
            Capture your thoughts effortlessly with quick note creation. Stay
            organized with instant access to your latest notes right from your
            dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
