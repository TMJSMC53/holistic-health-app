import './index.css';
import AppRoutes from './routes/AppRoutes';
import { QuoteProvider } from './context/QuoteProvider';

function App() {
  return (
    <QuoteProvider>
      <AppRoutes />
    </QuoteProvider>
  );
}

export default App;
