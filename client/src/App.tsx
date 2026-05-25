import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './components/auth/AuthProvider';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PageContainer } from './components/layout/PageContainer';
import { Loader } from './components/ui/Loader';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const CollegeListing = lazy(() => import('./pages/CollegeListing').then(m => ({ default: m.CollegeListing })));
const CollegeDetail = lazy(() => import('./pages/CollegeDetail').then(m => ({ default: m.CollegeDetail })));
const Compare = lazy(() => import('./pages/Compare').then(m => ({ default: m.Compare })));
const Predictor = lazy(() => import('./pages/Predictor').then(m => ({ default: m.Predictor })));
const Discussions = lazy(() => import('./pages/Discussions').then(m => ({ default: m.Discussions })));
const SavedColleges = lazy(() => import('./pages/SavedColleges').then(m => ({ default: m.SavedColleges })));
const Login = lazy(() => import('./pages/AuthPages').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/AuthPages').then(m => ({ default: m.Register })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
import { AdminRoute } from './components/layout/AdminRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<Loader text="Loading..." />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/colleges" element={<CollegeListing />} />
                  <Route path="/colleges/:slug" element={<CollegeDetail />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/predictor" element={<Predictor />} />
                  <Route path="/discussions" element={<Discussions />} />
                  
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  <Route element={<ProtectedRoute />}>
                    <Route path="/saved" element={<SavedColleges />} />
                  </Route>

                  <Route element={<AdminRoute />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  </Route>

                  <Route path="*" element={
                    <PageContainer className="flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-8">Page not found</p>
                      </div>
                    </PageContainer>
                  } />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
          <Toaster position="top-center" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
