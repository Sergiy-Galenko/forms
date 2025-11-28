import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FormsProvider, useForms } from './context/FormsContext';
import { ExperienceProvider } from './context/ExperienceContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './components/Dashboard/Dashboard';
import FormBuilder from './components/FormBuilder/FormBuilder';
import FormView from './components/FormView/FormView';
import Stats from './components/Stats/Stats';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import './App.css';

const AppContent = () => {
  const { view, currentForm } = useForms();

  switch (view) {
    case 'create':
    case 'edit':
      return <FormBuilder />;
    case 'view':
      return <FormView />;
    case 'stats':
      return <Stats />;
    case 'dashboard':
    default:
      return <Dashboard />;
  }
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ExperienceProvider>
          <FormsProvider>
            <div className="site">
              <Header />
              <main className="site-main">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/forms" element={<FormsArea />} />
                  <Route path="/form/:id" element={<FormsArea />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </FormsProvider>
        </ExperienceProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
