import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const ProductFeatures = () => {
  return (
    <div className="container mx-auto py-24">
      <div className="mx-4 md:mx-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
            Log all of your daily fluids and have them in one place for quick
            overview each day.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white p-6 md:py-6 md:px-4 border border-gray-100 rounded-8 shadow-custom">
          <FontAwesomeIcon
            icon={faPenToSquare}
            size="2xl"
            style={{ color: '#ff7e67' }}
          />
          <h3 className="text-20 lg:text-26 text-primary-500  font-playfair font-semibold mb-4 mt-4">
            Group By Days
          </h3>
          <p className="text-14 lg:text-16 text-primary-600 font-poppins">
            Group your water intake by days to focus on the amount of water you
            are drinking each day.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white p-6 md:py-6 md:px-4 border border-gray-100 rounded-8 shadow-custom">
          <FontAwesomeIcon
            icon={faPenToSquare}
            size="2xl"
            style={{ color: '#ff7e67' }}
          />
          <h3 className="text-20 lg:text-26 text-primary-500 font-playfair font-xtraBold mb-4 mt-4">
            Custom Water Goal
          </h3>
          <p className="text-14 lg:text-16 text-primary-600 font-poppins">
            Customize your water goal on weekly or monthly basis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
