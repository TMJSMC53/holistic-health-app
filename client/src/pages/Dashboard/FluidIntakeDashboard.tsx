import { Link } from 'react-router-dom';
import { useState } from 'react';
import FluidIntakeLogDashboardView from '../Dashboard/FluidIntakeLogDashboardView';
import FluidIntakeByDaysDashboardView from './FluidIntakeByDaysDashboardView';
const FluidIntakeDashboard = () => {
  const [activeTab, setActiveTab] = useState('List');
  return (
    <>
      <section className="md:w-3/4">
        <div className="flex items-center text-16 font-poppins gap-4 ml-4">
          <h6>Water Intake</h6>
          <div className="tabs font-poppins pb-1">
            <a
              className={`tab tab-bordered text-16 text-primary-600 md:text-18 rounded-t-12 transition-colors duration-200 ${
                activeTab === 'List'
                  ? 'bg-primary-600 text-white border rounded-t-12'
                  : 'border rounded-t-12 border-primary-600 hover:bg-primary-700 hover:text-accents-500 hover:border-transparent relative before:absolute before:inset-0 before:rounded-t-12 before:border-transparent hover:before:border-primary-600'
              }`}
              onClick={() => setActiveTab('List')}
            >
              List
            </a>

            <a
              className={`tab tab-bordered text-16 text-primary-600 md:text-18 rounded-t-12 transition-colors duration-200 ${
                activeTab === 'By Day'
                  ? 'bg-primary-600 text-white border rounded-t-12'
                  : 'border rounded-t-12 border-primary-600 hover:bg-primary-700 hover:text-accents-500 hover:border-transparent relative before:absolute before:inset-0 before:rounded-t-12 before:border-transparent hover:before:border-primary-600'
              }`}
              onClick={() => setActiveTab('By Day')}
            >
              By Day
            </a>
          </div>
          <Link className="cursor-pointer hover:underline " to="/fluids">
            View All
          </Link>
        </div>
        <section className="flex font-poppins my-10">
          <div className="w-full">
            {activeTab === 'List' && (
              <div>
                <FluidIntakeLogDashboardView />
              </div>
            )}
            {activeTab === 'By Day' && (
              <div>
                <FluidIntakeByDaysDashboardView />
              </div>
            )}
          </div>
        </section>
      </section>
    </>
  );
};

export default FluidIntakeDashboard;
