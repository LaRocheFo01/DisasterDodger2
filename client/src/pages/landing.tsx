
import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Shield, 
  MapPin, 
  FileText, 
  Clock, 
  Users, 
  Star, 
  ArrowRight, 
  Menu, 
  X,
  Droplets,
  Flame,
  Wind,
  Mountain,
  CheckCircle,
  Heart,
  Home,
  Target,
  Award
} from 'lucide-react';

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [currentStat, setCurrentStat] = useState({ homes: 0, disasters: 0, savings: 0 });
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const fullText = "Dodge disasters before they strike!";

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
    }, 80);
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
      icon: <Target className="w-8 h-8" />,
      title: "Smart Risk Assessment",
      description: "AI-powered analysis that identifies your home's specific vulnerabilities with friendly guidance",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Your Neighborhood Insights",
      description: "Hyperlocal data about your area's unique risks and historical patterns",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Easy Action Plans",
      description: "Step-by-step guides that make disaster prep simple and achievable",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Peace of Mind",
      description: "Sleep better knowing your family and home are prepared for anything",
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Quick Assessment",
      description: "Answer friendly questions about your home and location",
      icon: <Home className="w-8 h-8" />,
      color: "bg-green-500"
    },
    {
      step: "2",
      title: "Smart Analysis",
      description: "Our AI reviews your answers and local disaster data",
      icon: <Target className="w-8 h-8" />,
      color: "bg-blue-500"
    },
    {
      step: "3",
      title: "Personal Plan",
      description: "Get your custom action plan with prioritized steps",
      icon: <Award className="w-8 h-8" />,
      color: "bg-orange-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      location: "San Francisco, CA",
      text: "The earthquake prep guide was so helpful! My family feels confident and ready now.",
      rating: 5,
      avatar: "SC",
      disaster: "Earthquake"
    },
    {
      name: "Mike Rodriguez",
      location: "Houston, TX",
      text: "Hurricane season doesn't worry us anymore. The checklist made everything manageable!",
      rating: 5,
      avatar: "MR",
      disaster: "Hurricane"
    },
    {
      name: "Jennifer Walsh",
      location: "Paradise, CA",
      text: "After the fires, this helped us rebuild smarter. Such practical, easy-to-follow advice.",
      rating: 5,
      avatar: "JW",
      disaster: "Wildfire"
    }
  ];

  const disasterIcons = [
    { icon: <Droplets className="w-6 h-6 text-blue-500" />, label: "Floods" },
    { icon: <Flame className="w-6 h-6 text-orange-500" />, label: "Wildfires" },
    { icon: <Wind className="w-6 h-6 text-gray-500" />, label: "Hurricanes" },
    { icon: <Mountain className="w-6 h-6 text-yellow-600" />, label: "Earthquakes" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 text-gray-800 overflow-hidden">
      {/* Floating disaster icons background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 animate-float">
          <Droplets className="w-8 h-8 text-blue-300 opacity-20" />
        </div>
        <div className="absolute top-40 right-20 animate-float animation-delay-1000">
          <Flame className="w-6 h-6 text-orange-300 opacity-20" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float animation-delay-2000">
          <Wind className="w-7 h-7 text-gray-300 opacity-20" />
        </div>
        <div className="absolute bottom-20 right-40 animate-float animation-delay-3000">
          <Mountain className="w-5 h-5 text-yellow-400 opacity-20" />
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-700">Disaster Dodger</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors font-medium">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Stories</a>
              <Button 
                onClick={() => setLocation('/start-audit')} 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl px-6"
              >
                Start Free Audit <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-green-100 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-green-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-green-600 transition-colors font-medium">How It Works</a>
              <a href="#testimonials" className="block text-gray-700 hover:text-green-600 transition-colors font-medium">Stories</a>
              <Button 
                onClick={() => setLocation('/start-audit')} 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl"
              >
                Start Free Audit
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 text-sm font-semibold rounded-full shadow-lg animate-bounce">
              🛡️ Be Prepared, Not Scared
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-800 leading-tight">
            {typedText}
            <span className="animate-blink text-green-500">|</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Turn disaster worry into confident preparedness with our friendly, 
            <span className="text-green-600 font-semibold"> AI-powered home assessment.</span> 
            {" "}Get peace of mind in just 10 minutes.
          </p>

          {/* Disaster icons row */}
          <div className="flex justify-center space-x-8 mb-12">
            {disasterIcons.map((item, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center group cursor-pointer"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 animate-float">
                  {item.icon}
                </div>
                <span className="text-sm text-gray-600 mt-2 font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={() => setLocation('/start-audit')}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-6 text-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl group"
            >
              Start Your Free Assessment
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-10 py-6 text-xl rounded-2xl font-semibold"
            >
              See How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                {currentStat.homes.toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium">Families Protected</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {currentStat.disasters}+
              </div>
              <div className="text-gray-600 font-medium">Disaster Types Covered</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
                ${currentStat.savings.toLocaleString()}
              </div>
              <div className="text-gray-600 font-medium">Average Protection Value</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Why Families Love Our Approach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make disaster preparedness simple, friendly, and actually achievable for busy families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`${feature.bgColor} border-0 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden relative cursor-pointer rounded-2xl`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader className="relative z-10 text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-4 mx-auto transform group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className={`text-xl ${feature.textColor} group-hover:text-gray-800 transition-colors font-bold`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 text-center">
                  <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                {hoveredFeature === index && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-green-600/10 animate-pulse"></div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Getting Prepared Is Simple
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three easy steps to go from worried to confident about your family's safety
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className={`w-24 h-24 mx-auto ${item.color} rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300`}>
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-green-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => setLocation('/start-audit')}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Your Assessment Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Real Families, Real Peace of Mind
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of families who went from worried to confidently prepared
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{testimonial.name}</div>
                      <div className="text-gray-500 text-sm">{testimonial.location}</div>
                      <div className="text-green-600 text-sm font-medium">{testimonial.disaster} Prepared</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-500 via-green-600 to-green-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float animation-delay-2000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Ready to Feel Confident?
          </h2>
          <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
            Join 50,000+ families who sleep better knowing they're prepared for anything.
          </p>
          <Button 
            onClick={() => setLocation('/start-audit')}
            size="lg"
            className="bg-white text-green-600 hover:bg-green-50 px-12 py-6 text-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl"
          >
            Get Started - It's Free!
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
          <p className="text-green-100 mt-4 text-sm">✓ Takes only 10 minutes  ✓ No credit card required  ✓ Instant results</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Disaster Dodger</span>
            </div>
            <div className="text-gray-400 text-sm text-center">
              © 2024 Disaster Dodger. Helping families feel confident and prepared.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
