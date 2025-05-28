import { Shield, MapPin, FileText, Download, Users, ArrowRight, 
         CheckCircle, ChevronDown, ChevronUp, Clock, Zap, Waves, Flame, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [zipCode, setZipCode] = useState("");

  const startAudit = () => {
    if (zipCode.trim()) {
      setLocation(`/start-audit?zip=${zipCode.trim()}`);
    } else {
      setLocation("/start-audit");
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (faqNumber: number) => {
    setOpenFaq(openFaq === faqNumber ? null : faqNumber);
  };

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startAudit();
  };

  return (
    <div className="min-h-screen bg-disaster-green-600 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white">
          <a href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-disaster-green-600" />
            <span className="text-xl font-semibold text-gray-900">Disaster Dodger™</span>
          </a>
          <nav className="hidden md:flex space-x-6 text-gray-900 font-medium">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-disaster-green-600"
            >
              How it Works
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="hover:text-disaster-green-600"
            >
              Support
            </button>
          </nav>
        </header>

        {/* Hero Section with Background */}
        <div className="relative">
          <div 
            className="h-64 sm:h-80 md:h-96 bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/hero-house-landscape.svg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center center'
            }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto shadow-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-4 leading-tight">
                Dodge Disasters Before They Strike
              </h1>
              <p className="text-lg text-gray-700 text-center mb-6 leading-relaxed">
                Five-minute, FEMA-aligned home audit that pinpoints wildfire, flood, hurricane, and earthquake risks—so you can act now and save on insurance.
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-disaster-green-600 mr-1" />
                  <span>5-min assessment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-disaster-green-600 mr-1" />
                  <span>FEMA-aligned</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-disaster-green-600 mr-1" />
                  <span>Insurance savings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ZIP Entry Card */}
        <div className="relative -mt-16 mb-12 flex justify-center px-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
            <form onSubmit={handleZipSubmit}>
              <div className="text-center mb-6">
                <MapPin className="h-8 w-8 text-disaster-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-900">Start Your Assessment</h3>
              </div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-900 mb-3">
                Your ZIP Code
              </label>
              <div className="relative">
                <input 
                  id="zip" 
                  type="text" 
                  placeholder="12345"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  maxLength={5}
                  className="w-full rounded-lg border-2 border-gray-200 p-4 text-lg font-medium text-center focus:ring-2 focus:ring-disaster-green-600 focus:border-disaster-green-600 transition-all"
                  required
                />
                {zipCode.length === 5 && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              <p className="mt-3 text-sm text-gray-500 text-center">
                🔒 We'll use this to load your local hazard data—no personal info stored.
              </p>
              <button 
                type="submit"
                disabled={zipCode.length !== 5}
                className="mt-6 w-full py-4 rounded-lg bg-disaster-green-600 text-white hover:bg-disaster-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg hover:shadow-xl active:scale-95"
              >
                {zipCode.length === 5 ? '🚀 Start Analysis' : 'Enter ZIP Code'}
              </button>
            </form>
          </div>
        </div>

        {/* Hazard Grid */}
        <section className="pb-12">
          <div className="text-center mb-8 px-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Assess Your Risk</h2>
            <p className="text-gray-600">We analyze the most common natural disasters in your area</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-disaster-green-600 to-disaster-green-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Earthquake</h3>
              <p className="text-sm text-gray-600">Ground shaking & structural damage assessment</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Waves className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Flood</h3>
              <p className="text-sm text-gray-600">Water damage & drainage vulnerability</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Wildfire</h3>
              <p className="text-sm text-gray-600">Fire risk & defensible space analysis</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Wind className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hurricane</h3>
              <p className="text-sm text-gray-600">Wind damage & storm surge protection</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">
              Get your personalized disaster preparedness audit in 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-disaster-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-medium mb-3">Enter ZIP Code</h3>
              <p className="text-gray-600">
                Start by entering your ZIP code to identify your primary disaster risks
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-disaster-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-medium mb-3">Complete Assessment</h3>
              <p className="text-gray-600">
                Answer targeted questions about your home with optional photo uploads
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-disaster-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-medium mb-3">Get Your Report</h3>
              <p className="text-gray-600">
                Receive instant recommendations with FEMA citations and action plans
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about our disaster preparedness audits</p>
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              {
                q: "How accurate are the disaster risk assessments?",
                a: "Our assessments use official FEMA data, USGS hazard maps, and NOAA climate data to provide the most accurate regional risk analysis available for your specific location."
              },
              {
                q: "What types of disasters are covered?",
                a: "We assess all major disaster types including earthquakes, wildfires, hurricanes, floods, tornadoes, and winter storms based on your geographic location's primary risks."
              },
              {
                q: "How long does the audit take?",
                a: "Most homeowners complete their assessment in under 5 minutes. The questionnaire is designed to be quick while still gathering essential information for accurate recommendations."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-disaster-green-500"
                >
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-disaster-green-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-disaster-green-600" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Get Started Today</h2>
            <p className="text-lg text-gray-600">Get your comprehensive disaster preparedness audit completely free</p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-disaster-green-600">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Complete Home Audit</h3>
                <div className="text-4xl font-bold text-disaster-green-600 mb-2">FREE</div>
                <p className="text-gray-600">Comprehensive assessment at no cost</p>
              </div>
              
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-disaster-green-600 mr-3 flex-shrink-0" />
                  <span>FEMA-aligned disaster risk assessment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-disaster-green-600 mr-3 flex-shrink-0" />
                  <span>Personalized mitigation recommendations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-disaster-green-600 mr-3 flex-shrink-0" />
                  <span>Downloadable PDF report with action plan</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-disaster-green-600 mr-3 flex-shrink-0" />
                  <span>Insurance cost reduction guidance</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-disaster-green-600 mr-3 flex-shrink-0" />
                  <span>Photo upload for detailed analysis</span>
                </li>
              </ul>
              
              <button 
                onClick={startAudit}
                className="w-full py-3 px-6 bg-disaster-green-600 text-white rounded-lg hover:bg-disaster-mint-500 transition-colors font-medium text-lg"
              >
                Start Your Audit Now
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                <Shield className="inline h-4 w-4 mr-1" />
                Secure • No payment required • Instant results
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-6 border-t border-gray-200">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 px-4 sm:px-6 lg:px-8">
            <div className="space-x-4">
              <a href="#privacy" className="hover:text-disaster-green-600">Privacy Policy</a>
              <a href="#terms" className="hover:text-disaster-green-600">Terms of Service</a>
              <a href="#contact" className="hover:text-disaster-green-600">Contact Us</a>
            </div>
            <p className="mt-4 sm:mt-0">&copy; 2025 Disaster Dodger™</p>
          </div>
        </footer>
      </div>
    </div>
  );
}