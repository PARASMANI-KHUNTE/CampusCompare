import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Users, ArrowRight, Star, Building2, BookOpen, TrendingUp, CheckCircle, Sparkles, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/colleges?search=${encodeURIComponent(query)}` : '/colleges');
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[620px] flex items-center pt-16 pb-20 overflow-hidden gradient-hero">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Campus"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent" />
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 text-primary-300 text-sm font-medium border border-white/10 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Discover Your Future
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight mb-6 leading-tight">
              Find the perfect{' '}
              <span className="gradient-text">college</span>
              <br />
              for your career
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Compare thousands of colleges across India, check fees, placements, and read genuine reviews from students to make the best choice for your future.
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search colleges, cities, courses..."
                  className="w-full h-14 pl-14 pr-4 rounded-xl bg-white/95 backdrop-blur-sm border border-white/20 text-gray-900 placeholder-gray-400 text-base shadow-2xl shadow-black/20 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 text-base shadow-xl shadow-primary-600/25 hover:shadow-primary-600/40 transition-shadow"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </form>
            <div className="flex items-center gap-4 mt-8 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                10K+ Colleges
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                30+ States
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                50K+ Reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-12 z-10">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Building2, value: '10,000+', label: 'Colleges Listed', color: 'bg-primary-50 text-primary-600' },
              { icon: BookOpen, value: '50,000+', label: 'Courses Covered', color: 'bg-indigo-50 text-indigo-600' },
              { icon: Users, value: '1,00,000+', label: 'Active Students', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Star, value: '50,000+', label: 'Genuine Reviews', color: 'bg-amber-50 text-amber-600' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl md:text-3xl font-display font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />
        <div className="container-custom relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Everything you need to make the right choice
            </h2>
            <p className="text-gray-600 text-lg">
              We provide all the tools and information you need to make an informed decision about your education.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: 'Extensive Database',
                description: 'Access detailed information about thousands of colleges across India, including courses, fees, facilities, and more.',
                color: 'bg-primary-50 text-primary-600',
                features: ['Detailed college profiles', 'Course & fee info', 'Facilities overview'],
              },
              {
                icon: TrendingUp,
                title: 'Smart Comparison',
                description: 'Compare up to 3 colleges side-by-side to easily evaluate their pros, cons, placements, and value for money.',
                color: 'bg-indigo-50 text-indigo-600',
                features: ['Side-by-side analysis', 'Best value pick', 'Placement comparison'],
              },
              {
                icon: Shield,
                title: 'Genuine Reviews',
                description: 'Read authentic reviews from alumni and current students about placements, faculty, campus life, and more.',
                color: 'bg-emerald-50 text-emerald-600',
                features: ['Verified student reviews', 'Sub-ratings for aspects', 'Real experiences'],
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-100"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-5">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-primary-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Three simple steps
            </h2>
            <p className="text-gray-600 text-lg">
              Finding your dream college has never been easier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 -translate-y-1/2" />

            {[
              { step: '01', icon: Search, title: 'Search & Explore', description: 'Browse through thousands of colleges using filters like location, course, fees, and ratings.' },
              { step: '02', icon: TrendingUp, title: 'Compare & Analyze', description: 'Compare up to 3 colleges side-by-side and let our smart analysis highlight the best value pick.' },
              { step: '03', icon: Star, title: 'Review & Decide', description: 'Read genuine reviews from students and alumni, then save your favorites for easy access.' },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="relative z-10 w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-600/20 text-lg font-bold">
                  {item.step}
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className={`w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden gradient-bg">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="container-custom relative z-10 text-center">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 text-white text-sm font-medium border border-white/10 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Get Started Today
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
            Ready to find your<br />
            <span className="text-primary-300">dream college?</span>
          </h2>
          <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of students who have already found their perfect educational institution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="px-10 h-14 text-base shadow-xl hover:shadow-2xl transition-shadow">
                Create Free Account <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/colleges">
              <Button size="lg" className="px-10 h-14 text-base bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                Browse Colleges
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
