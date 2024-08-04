import { Link } from 'react-router-dom';
import FluidIntakeLogDashboardView from '../Dashboard/FluidIntakeLogDashboardView';
import FluidIntakeByDaysDashboardView from './FluidIntakeByDaysDashboardView';
const FluidIntakeDashboard = () => {
  return (
    <div className="ml-4">
      <section className="flex gap-8 font-poppins">
        <h6>Water Intake</h6>
        <div role="tablist" className="tabs tabs-bordered">
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-16"
            aria-label="List"
          />
          <div role="tabpanel" className="tab-content p-10">
            <FluidIntakeLogDashboardView />
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-16"
            aria-label="By Day"
            defaultChecked
          />
          <div role="tabpanel" className="tab-content p-10">
            <FluidIntakeByDaysDashboardView />
          </div>
        </div>
        <Link to="/fluids">View All</Link>
      </section>
    </div>
  );
};

export default FluidIntakeDashboard;
