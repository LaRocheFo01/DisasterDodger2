import { Shield, ArrowRight, CheckCircle, Zap, Waves, Flame, Wind, ChevronDown, ChevronUp, Home, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [zipCode, setZipCode] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const startAudit = () => {
    if (zipCode.trim()) {
      setLocation(`/start-audit?zip=${zipCode.trim()}`);
    } else {
      setLocation("/start-audit");
    }
  };

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startAudit();
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 animate-fade-in-down">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float hover-glow">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Disaster Dodger</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8 animate-fade-in-down animate-delay-200">
              <a href="#features" className="text-white hover:text-green-200 font-medium transition-all duration-300 hover-scale">
                Features
              </a>
              <a href="#how-it-works" className="text-white hover:text-green-200 font-medium transition-all duration-300 hover-scale">
                How it Works
              </a>
              <a href="#faq" className="text-white hover:text-green-200 font-medium transition-all duration-300 hover-scale">
                FAQ
              </a>
              <Button 
                onClick={startAudit}
                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-green-700 transition-all duration-300 hover-scale animate-shimmer"
              >
                Start Assessment
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Full-screen Hero with Gradient */}
        <section className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 relative flex items-center justify-center animate-gradient">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/5"></div>
          
          {/* House Silhouettes Background */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute bottom-0 left-1/4 w-32 h-24 bg-white/20">
              <div className="w-full h-16 bg-white/30"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-16 border-r-16 border-b-16 border-transparent border-b-white/30"></div>
            </div>
            <div className="absolute bottom-0 right-1/3 w-28 h-20 bg-white/15">
              <div className="w-full h-12 bg-white/25"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-14 border-r-14 border-b-12 border-transparent border-b-white/25"></div>
            </div>
            <div className="absolute bottom-0 left-1/6 w-24 h-18 bg-white/10">
              <div className="w-full h-10 bg-white/20"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-12 border-r-12 border-b-8 border-transparent border-b-white/20"></div>
            </div>
          </div>
          

          
          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            {/* Trust Indicators */}
            <div className="flex justify-center items-center space-x-8 mb-8 animate-fade-in-up">
              <div className="flex items-center space-x-2 text-green-100">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">FEMA-Aligned</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">500+ Homes Protected</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <Home className="h-5 w-5" />
                <span className="text-sm font-medium">Local Experts</span>
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-8 animate-fade-in-up animate-delay-200">
              Protect Your Home & Family<br />
              <span className="text-emerald-200 animate-fade-in-up animate-delay-300">Before Disaster Strikes</span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 text-green-50 font-light leading-relaxed max-w-3xl mx-auto animate-fade-in-up animate-delay-400">
              Your most valuable investment deserves protection. Get a comprehensive 5-minute risk assessment and <span className="font-semibold text-white">save thousands in potential damage costs.</span>
            </p>

            {/* Local Urgency Messaging */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 animate-fade-in-up animate-delay-500">
              <p className="text-emerald-100 text-lg">
                <span className="font-semibold text-white">1 in 4 homes</span> will experience disaster damage. Most homeowners have only <span className="font-semibold text-white">72 hours</span> to prepare when disaster strikes.
              </p>
            </div>

            {/* CTA Form */}
            <div className="max-w-lg mx-auto animate-scale-in animate-delay-700">
              <form onSubmit={handleZipSubmit} className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Enter your ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    maxLength={5}
                    className="w-full rounded-xl border-0 px-6 py-5 text-xl text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/25 shadow-2xl transition-all duration-300 hover-lift"
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-white text-green-700 hover:bg-green-50 py-5 text-xl font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 animate-glow"
                >
                  Get Free Risk Assessment
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </form>

              <div className="mt-8 text-green-100 animate-fade-in-up animate-delay-1000">
                <CheckCircle className="inline h-5 w-5 mr-2" />
                No signup required • Instant results • 100% free
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce animate-delay-1000">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Visual House Protection Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          {/* Background House Illustration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="relative">
              <Home className="w-96 h-96 text-gray-600" />
              <Shield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-emerald-600" />
            </div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Disasters We Help You Prepare For</h2>
              <p className="text-xl text-gray-600 animate-fade-in-up animate-delay-200">Comprehensive protection against all major natural disasters</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="card-elevated text-center group animate-bounce-in animate-delay-300">
                <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg hover-lift animate-rotate-in">
                  <Zap className="icon-large text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Earthquakes</h3>
                <p className="text-large">Structural assessments, foundation retrofitting, and emergency preparedness for seismic events</p>
              </div>
              
              <div className="card-elevated text-center group animate-bounce-in animate-delay-400">
                <div className="w-20 h-20 bg-brand-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg hover-lift animate-rotate-in animate-delay-100">
                  <Waves className="icon-large text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Floods</h3>
                <p className="text-large">Flood zone analysis, drainage solutions, and water damage prevention strategies</p>
              </div>
              
              <div className="card-elevated text-center group animate-bounce-in animate-delay-500">
                <div className="w-20 h-20 bg-brand-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg hover-lift animate-rotate-in animate-delay-200">
                  <Flame className="icon-large text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Wildfires</h3>
                <p className="text-large">Defensible space planning, fire-resistant materials, and evacuation route planning</p>
              </div>
              
              <div className="card-elevated text-center group animate-bounce-in animate-delay-700">
                <div className="w-20 h-20 bg-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg hover-lift animate-rotate-in animate-delay-300">
                  <Wind className="icon-large text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Hurricanes</h3>
                <p className="text-large">Wind resistance upgrades, storm shutters, and hurricane tracking systems</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 animate-fade-in-up">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">Simple. Fast. Effective.</h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
                Professional disaster risk assessment in minutes, not hours
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-16">
              <div className="text-center group animate-slide-in-left animate-delay-300">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform group-hover:scale-110 transition-all duration-300 animate-scale-in animate-delay-500 hover-glow">
                  <Clock className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">5-Minute Assessment</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Quick, comprehensive home risk evaluation using official FEMA guidelines and local data
                </p>
              </div>
              
              <div className="text-center group animate-fade-in-up animate-delay-400">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform group-hover:scale-110 transition-all duration-300 animate-scale-in animate-delay-700 hover-glow">
                  <DollarSign className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">Lower Insurance Costs</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Save up to 25% on premiums with disaster-resistant improvements and risk mitigation
                </p>
              </div>
              
              <div className="text-center group animate-slide-in-right animate-delay-500">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform group-hover:scale-110 transition-all duration-300 animate-scale-in animate-delay-1000 hover-glow">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">FEMA Aligned</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Official guidelines and data from federal emergency management experts
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 animate-fade-in-up">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">Why Choose Our Platform?</h2>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
                Professional-grade disaster preparedness technology made accessible for every homeowner
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12 animate-slide-in-left animate-delay-300">
                <div className="flex items-start space-x-6 animate-fade-in-up animate-delay-400 hover-lift">
                  <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-scale-in animate-delay-500 hover-glow">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">FEMA-Aligned Data</h3>
                    <p className="text-lg text-gray-600">Official government hazard data ensures accuracy and reliability for your specific location</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6 animate-fade-in-up animate-delay-500 hover-lift">
                  <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-scale-in animate-delay-700 hover-glow">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Results</h3>
                    <p className="text-lg text-gray-600">Get your comprehensive risk assessment and recommendations in under 5 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6 animate-fade-in-up animate-delay-700 hover-lift">
                  <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-scale-in animate-delay-1000 hover-glow">
                    <ArrowRight className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Actionable Plans</h3>
                    <p className="text-lg text-gray-600">Receive specific, prioritized recommendations with cost estimates and insurance benefits</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-12 text-white animate-slide-in-right animate-delay-500 hover-lift animate-gradient">
                <h3 className="text-3xl font-bold mb-6 animate-fade-in-up animate-delay-700">Ready to Get Started?</h3>
                <p className="text-xl mb-8 text-green-100 animate-fade-in-up animate-delay-1000">Join thousands of homeowners who have already secured their properties</p>
                <div className="space-y-4 animate-scale-in animate-delay-1000">
                  <input 
                    type="text" 
                    placeholder="Enter your ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    maxLength={5}
                    className="w-full rounded-xl border-0 px-6 py-4 text-lg text-gray-900 placeholder-gray-500 transition-all duration-300 hover-lift"
                  />
                  <Button 
                    onClick={startAudit}
                    className="w-full bg-white text-green-700 hover:bg-green-50 py-4 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 animate-shimmer"
                  >
                    Start Free Assessment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-32 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 animate-fade-in-up">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <p className="text-2xl text-gray-600 animate-fade-in-up animate-delay-200">Everything you need to know about disaster preparedness assessments</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How accurate are the disaster risk assessments?",
                  answer: "Our assessments use official FEMA data, USGS hazard maps, and NOAA climate data to provide the most accurate regional risk analysis available. We combine multiple authoritative sources to ensure precision for your specific location and property type."
                },
                {
                  question: "What types of disasters are covered in the assessment?",
                  answer: "We assess all major disaster types including earthquakes, wildfires, hurricanes, floods, tornadoes, and severe storms. Our analysis is customized based on your geographic location's primary risks and historical disaster patterns."
                },
                {
                  question: "How long does the complete audit take?",
                  answer: "Most homeowners complete their comprehensive assessment in under 5 minutes. The questionnaire is designed to be quick and efficient while still gathering all essential information needed for accurate recommendations."
                },
                {
                  question: "What kind of recommendations will I receive?",
                  answer: "You'll receive specific, actionable recommendations prioritized by risk level and cost-effectiveness. This includes structural improvements, safety equipment, emergency planning, and potential insurance savings with estimated costs and timelines."
                },
                {
                  question: "Is my personal information secure?",
                  answer: "Yes, we use enterprise-grade security measures to protect your data. We only collect information necessary for the assessment and never share personal details with third parties. Your privacy and security are our top priorities."
                },
                {
                  question: "Can this help reduce my insurance costs?",
                  answer: "Many of our recommendations can lead to insurance discounts. We provide specific guidance on improvements that insurers recognize, potential premium reductions, and documentation needed to claim discounts with your insurance provider."
                },
                {
                  question: "Do I need any special knowledge to complete the assessment?",
                  answer: "No special expertise is required. Our questions are designed for homeowners of all backgrounds. We provide clear explanations and examples, and you can always skip questions you're unsure about - our AI can still provide valuable insights."
                },
                {
                  question: "What if I live in a low-risk area?",
                  answer: "Even low-risk areas benefit from preparedness planning. Our assessment identifies any potential risks and provides basic preparedness recommendations. Prevention and preparation are valuable regardless of your area's risk level."
                }
              ].map((faq, index) => (
                <div key={index} className={`bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover-lift animate-fade-in-up animate-delay-${300 + (index * 100)}`}>
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset hover-scale"
                  >
                    <span className="text-xl font-semibold text-gray-900 pr-8">{faq.question}</span>
                    <div className="flex-shrink-0 transition-transform duration-300">
                      {openFaq === index ? (
                        <ChevronUp className="h-6 w-6 text-green-600 animate-bounce-in" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-8 pb-6 animate-fade-in-up">
                      <p className="text-lg text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA in FAQ */}
            <div className="mt-16 text-center animate-scale-in animate-delay-1000">
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white hover-lift animate-gradient">
                <h3 className="text-3xl font-bold mb-4 animate-fade-in-up">Still Have Questions?</h3>
                <p className="text-xl mb-8 text-green-100 animate-fade-in-up animate-delay-200">Get started with your free assessment and discover your personalized disaster preparedness plan</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto animate-fade-in-up animate-delay-400">
                  <input 
                    type="text" 
                    placeholder="Enter your ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    maxLength={5}
                    className="flex-1 rounded-xl border-0 px-6 py-4 text-lg text-gray-900 placeholder-gray-500 transition-all duration-300 hover-lift"
                  />
                  <Button 
                    onClick={startAudit}
                    className="bg-white text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-bold rounded-xl whitespace-nowrap transition-all duration-300 hover:scale-105 animate-shimmer"
                  >
                    Start Free Assessment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-gray-900 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold mb-4">Questions?</h3>
              <p className="text-xl text-gray-400">We're here to help you protect your home</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div>
                <h4 className="text-xl font-semibold mb-4">Support</h4>
                <ul className="space-y-3 text-gray-400">
                  <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Contact Support</a></li>
                  <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold mb-4">Resources</h4>
                <ul className="space-y-3 text-gray-400">
                  <li><a href="#guides" className="hover:text-white transition-colors">Safety Guides</a></li>
                  <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#updates" className="hover:text-white transition-colors">Updates</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold mb-4">Legal</h4>
                <ul className="space-y-3 text-gray-400">
                  <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-16 pt-8 text-center">
              <p className="text-gray-400">&copy; 2025 Disaster Dodger. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}