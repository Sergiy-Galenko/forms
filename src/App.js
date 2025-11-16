import { FormsProvider, useForms } from './context/FormsContext';
import Dashboard from './components/Dashboard/Dashboard';
import FormBuilder from './components/FormBuilder/FormBuilder';
import FormView from './components/FormView/FormView';
import Stats from './components/Stats/Stats';
import './App.css';

const AppContent = () => {
  const { view } = useForms();

  switch (view) {
    case 'create':
    case 'edit':
      return <FormBuilder />;
    case 'view':
      return <FormView />;
    case 'stats':
      return <Stats />;
    default:
      return <Dashboard />;
  }
};

function App() {
  return (
    <FormsProvider>
      <div className="app">
        <div className="blur blur-one" />
        <div className="blur blur-two" />
        <AppContent />
      </div>
    </FormsProvider>
  );
}

export default App;
