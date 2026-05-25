import { GraduationCap } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) => (
  <div className="min-h-[calc(100vh-64px)] flex py-12 px-4 relative overflow-hidden">
    {/* Background decorations */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-indigo-50" />
    <div className="absolute top-20 -left-20 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-emerald-100/30 rounded-full blur-3xl" />

    <div className="flex items-center justify-center w-full max-w-6xl mx-auto gap-12 lg:gap-20">
      {/* Left Brand */}
      <div className="hidden lg:flex flex-col items-start max-w-md animate-fade-in">
        <div className="bg-primary-600 p-3 rounded-2xl mb-6 shadow-lg shadow-primary-600/20">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-3 leading-tight">
          {title}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {subtitle}
        </p>
        <div className="mt-8 space-y-4">
          {[
            'Compare thousands of colleges side-by-side',
            'Read genuine reviews from students & alumni',
            'Save your favorite colleges for easy access',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-primary-600 text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-gray-600">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-md animate-slide-up">
        {children}
      </div>
    </div>
  </div>
);

export const Login = () => {
  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Sign in to access your saved colleges, write reviews, and compare institutions."
    >
      <LoginForm />
    </AuthLayout>
  );
};

export const Register = () => {
  return (
    <AuthLayout
      title="Start Your Journey"
      subtitle="Create your account to save colleges, write reviews, and find your perfect institution."
    >
      <RegisterForm />
    </AuthLayout>
  );
};
