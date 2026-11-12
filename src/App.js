import screens from "./styles/screens.module.css";
import { lazy, Suspense } from "react";
import AppLayout from "./layouts/AppLayout/AppLayout";
import Skeleton from "./components/ui/Skeleton";
import ErrorBoundary from "./components/ui/ErrorBoundary/ErrorBoundary";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { FormsProvider, useForms } from "./context/FormsContext";
import { ExperienceProvider } from "./context/ExperienceContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/ui/Toast";
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const FormBuilder = lazy(() => import("./components/FormBuilder/FormBuilder"));
const FormView = lazy(() => import("./components/FormView/FormView"));
const Stats = lazy(() => import("./components/Stats/Stats"));
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));

const FormsArea = () => {
  const { view } = useForms();

  switch (view) {
    case "create":
    case "edit":
      return <FormBuilder />;
    case "view":
      return <FormView />;
    case "stats":
      return <Stats />;
    case "dashboard":
    default:
      return <Dashboard />;
  }
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <ExperienceProvider>
            <FormsProvider>
              <AppLayout>
                <ErrorBoundary>
                  <Suspense
                    fallback={
                      <div
                        className={screens["route-loading"]}
                        role="status"
                        aria-label="Завантаження"
                      >
                        <Skeleton count={4} />
                      </div>
                    }
                  >
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/forms" element={<FormsArea />} />
                      <Route path="/form/:id" element={<FormsArea />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </AppLayout>
            </FormsProvider>
          </ExperienceProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
