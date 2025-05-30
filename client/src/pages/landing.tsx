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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl w-full mx-auto bg-white shadow-lg overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-100">
          <a href="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-disaster-green-600" />
            <span className="text-lg sm:text-xl font-semibold text-gray-900">Disaster Dodger™</span>
          </a>
          <nav className="hidden md:flex space-x-6 text-gray-900 font-medium">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-disaster-green-600 transition-colors"
            >
              How it Works
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="hover:text-disaster-green-600 transition-colors"
            >
              Support
            </button>
          </nav>
        </header>

        {/* Hero Section with Background */}
        <div className="relative bg-gradient-to-br from-disaster-green-50 to-disaster-green-100">
          <div 
            className="h-48 sm:h-64 md:h-80 bg-center bg-cover bg-no-repeat opacity-30"
            style={{
              backgroundImage: "url('/assets/hero-house-landscape.svg')",
              backgroundSize: 'contain',
              backgroundPosition: 'center center'
            }}
          ></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 text-center mb-3 sm:mb-4 leading-tight">
              Dodge Disasters Before They Strike
            </h1>
            <p className="text-base sm:text-lg text-gray-600 text-center max-w-2xl leading-relaxed">
              Five-minute, FEMA-aligned home audit that pinpoints wildfire, flood, hurricane, and earthquake risks—so you can act now and save on insurance.
            </p>
          </div>
        </div>

        {/* ZIP Entry Card */}
        <div className="relative -mt-8 sm:-mt-12 mb-8 sm:mb-12 flex justify-center px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md mx-auto">
            <form onSubmit={handleZipSubmit}>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-900 mb-2">
                Your ZIP Code
              </label>
              <input 
                id="zip" 
                type="text" 
                placeholder="Enter ZIP code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                maxLength={5}
                className="w-full rounded-md border border-gray-300 p-3 text-base focus:ring-2 focus:ring-disaster-green-600 focus:border-disaster-green-600 transition-colors"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                We'll use this to load your local hazard data—no personal info stored.
              </p>
              <button 
                type="submit"
                className="mt-4 w-full py-3 rounded-lg bg-disaster-green-600 text-white hover:bg-disaster-green-700 transition-colors font-medium text-base"
              >
                Start Your Assessment
              </button>
            </form>
          </div>
        </div>

        {/* Hazard Grid */}
        <section className="pb-8 sm:pb-12 px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-6 sm:mb-8">
            Protected Against All Major Disasters
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 text-center hover:shadow-md hover:border-disaster-green-200 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-disaster-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">Earthquake</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 text-center hover:shadow-md hover:border-disaster-green-200 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-disaster-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Waves className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">Flood</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 text-center hover:shadow-md hover:border-disaster-green-200 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-disaster-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">Wildfire</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 text-center hover:shadow-md hover:border-disaster-green-200 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-disaster-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Wind className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">Hurricane</h3>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-4 sm:px-6 py-8 sm:py-12 bg-gray-50">
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
        <section id="faq" className="px-4 sm:px-6 py-8 sm:py-12">
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
        <section className="px-4 sm:px-6 py-8 sm:py-12 bg-gray-50">
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
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 px-4 sm:px-6">
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