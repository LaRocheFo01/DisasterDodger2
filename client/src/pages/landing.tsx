import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ChevronRight, Shield, MapPin, FileText, Clock, Users, Star, ArrowRight, Menu, X } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [currentStat, setCurrentStat] = useState({ homes: 0, disasters: 0, savings: 0 });

  const fullText = "Protect Your Home from Natural Disasters";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typing animation
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Counter animations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStat(prev => ({
        homes: Math.min(prev.homes + 127, 50000),
        disasters: Math.min(prev.disasters + 3, 1200),
        savings: Math.min(prev.savings + 892, 350000)
      }));
    }, 50);

    setTimeout(() => clearInterval(timer), 3000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "AI-Powered Risk Assessment",
      description: "Advanced machine learning analyzes your property's unique vulnerabilities",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location-Based Intelligence",
      description: "Hyperlocal data including soil composition, flood zones, and historical events",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Professional Reports",
      description: "Comprehensive documentation for insurance, contractors, and peace of mind",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-Time Updates",
      description: "Live monitoring of changing risk factors and new mitigation technologies",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      location: "San Francisco, CA",
      text: "The earthquake assessment saved us $40,000 in retrofitting costs by prioritizing the right upgrades.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Mike Rodriguez",
      location: "Houston, TX",
      text: "Hurricane prep has never been this thorough. The flooding analysis was spot-on for Harvey aftermath.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Jennifer Walsh",
      location: "Paradise, CA",
      text: "After the Camp Fire, this tool helped us rebuild smarter. The wildfire insights are incredible.",
      rating: 5,
      avatar: "JW"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Disaster Dodger</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
              <a href="#testimonials" className="hover:text-blue-400 transition-colors">Reviews</a>
              <Button onClick={() => navigate('/start-audit')} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200">
                Start Audit <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block hover:text-blue-400 transition-colors">Features</a>
              <a href="#how-it-works" className="block hover:text-blue-400 transition-colors">How It Works</a>
              <a href="#testimonials" className="block hover:text-blue-400 transition-colors">Reviews</a>
              <Button onClick={() => navigate('/start-audit')} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                Start Audit
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20 animate-gradient-x"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-900/5 to-transparent animate-spin-slow"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 text-sm font-semibold animate-bounce">
              🛡️ AI-Powered Home Protection
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
            {typedText}
            <span className="animate-blink">|</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get a comprehensive disaster preparedness audit tailored to your location, property type, and risk profile. 
            <span className="text-cyan-400 font-semibold"> Powered by FEMA guidelines and cutting-edge AI.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={() => navigate('/start-audit')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 group"
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-600 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                {currentStat.homes.toLocaleString()}+
              </div>
              <div className="text-gray-400">Homes Protected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                {currentStat.disasters}+
              </div>
              <div className="text-gray-400">Disasters Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                ${currentStat.savings.toLocaleString()}
              </div>
              <div className="text-gray-400">Avg. Savings</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce animate-delay-1000">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-gray-900/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Next-Generation Risk Assessment
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI-powered platform combines satellite imagery, historical data, and predictive modeling 
              to deliver the most comprehensive home disaster assessment available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white/5 backdrop-blur-sm border-gray-700 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group overflow-hidden relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <CardHeader className="relative z-10">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 transform group-hover:rotate-6 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-white transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-gray-300 group-hover:text-gray-200 transition-colors">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-black/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Three simple steps to comprehensive disaster preparedness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Answer Questions", desc: "Complete our intelligent questionnaire about your property and location", icon: "📝" },
              { step: "02", title: "AI Analysis", desc: "Our system analyzes your responses against thousands of data points", icon: "🤖" },
              { step: "03", title: "Get Report", desc: "Receive a detailed action plan with prioritized recommendations", icon: "📊" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-6xl font-bold text-gray-800 mb-4 group-hover:text-gray-600 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-gray-900/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Real Stories, Real Protection
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of homeowners who've strengthened their disaster preparedness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-gray-700 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
            Don't Wait for Disaster
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Start your comprehensive home assessment today and protect what matters most.
          </p>
          <Button 
            onClick={() => navigate('/start-audit')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6 text-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25"
          >
            Get Started Now - It's Free
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Disaster Dodger</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Disaster Dodger. Protecting homes with AI-powered insights.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}