import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollManager from './components/common/ScrollManager.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

const Landing = lazy(() => import('./pages/Landing.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout.jsx'));
const DashboardHome = lazy(() => import('./pages/DashboardHome.jsx'));
const AnalyzePage = lazy(() => import('./pages/AnalyzePage.jsx'));
const AnalysisResult = lazy(() => import('./pages/AnalysisResult.jsx'));
const HistoryPage = lazy(() => import('./pages/HistoryPage.jsx'));
const ResumesPage = lazy(() => import('./pages/ResumesPage.jsx'));
const BuilderList = lazy(() => import('./pages/BuilderList.jsx'));
const BuilderEditor = lazy(() => import('./pages/BuilderEditor.jsx'));
const FeaturePage = lazy(() => import('./pages/FeaturePage.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const Fallback = () => (
  <div className="page-loading" role="status" aria-live="polite">
    <span className="spinner" aria-hidden="true" /> Loading…
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="analyze" element={<AnalyzePage />} />
          <Route path="builder" element={<BuilderList />} />
          <Route path="builder/:id" element={<BuilderEditor />} />
          <Route path="resumes" element={<ResumesPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="history/:id" element={<AnalysisResult />} />
          <Route path=":section" element={<FeaturePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
