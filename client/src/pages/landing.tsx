import { Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [zipCode, setZipCode] = useState("");

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20">
            <nav className="flex items-center space-x-12">
              <a href="#how-it-works" className="text-white hover:text-green-200 font-medium transition-colors">
                How it Works
              </a>
              <a href="#features" className="text-white hover:text-green-200 font-medium transition-colors">
                Features
              </a>
              <a href="#contact" className="text-white hover:text-green-200 font-medium transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Full-screen Hero with Gradient */}
        <section className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800 relative flex items-center justify-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-8">
              Dodge Disasters<br />
              <span className="text-green-200">Before They Strike</span>
            </h1>
            
            <p className="text-2xl lg:text-3xl mb-12 text-green-50 font-light leading-relaxed max-w-3xl mx-auto">
              Five-minute, FEMA-aligned home audit that pinpoints <span className="font-semibold text-white">wildfire, flood, hurricane, and earthquake risks</span>
            </p>

            {/* CTA Form */}
            <div className="max-w-lg mx-auto">
              <form onSubmit={handleZipSubmit} className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Enter your ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    maxLength={5}
                    className="w-full rounded-xl border-0 px-6 py-5 text-xl text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/25 shadow-2xl"
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-white text-green-700 hover:bg-green-50 py-5 text-xl font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Get Free Risk Assessment
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </form>

              <div className="mt-8 text-green-100">
                <CheckCircle className="inline h-5 w-5 mr-2" />
                No signup required • Instant results • 100% free
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">Simple. Fast. Effective.</h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Professional disaster risk assessment in minutes, not hours
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-16">
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-4xl font-bold shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  1
                </div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">Enter Location</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Simply enter your ZIP code to instantly identify your area's primary disaster risks using official FEMA data
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-4xl font-bold shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  2
                </div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">Quick Assessment</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Answer targeted questions about your home's construction and current safety measures
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-4xl font-bold shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  3
                </div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">Get Results</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Receive a comprehensive report with actionable recommendations and potential insurance savings
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">Why Choose Our Platform?</h2>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Professional-grade disaster preparedness technology made accessible for every homeowner
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">FEMA-Certified Data</h3>
                    <p className="text-lg text-gray-600">Official government hazard data ensures accuracy and reliability for your specific location</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Results</h3>
                    <p className="text-lg text-gray-600">Get your comprehensive risk assessment and recommendations in under 5 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Actionable Plans</h3>
                    <p className="text-lg text-gray-600">Receive specific, prioritized recommendations with cost estimates and insurance benefits</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-12 text-white">
                <h3 className="text-3xl font-bold mb-6">Ready to Get Started?</h3>
                <p className="text-xl mb-8 text-green-100">Join thousands of homeowners who have already secured their properties</p>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Enter your ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    maxLength={5}
                    className="w-full rounded-xl border-0 px-6 py-4 text-lg text-gray-900 placeholder-gray-500"
                  />
                  <Button 
                    onClick={startAudit}
                    className="w-full bg-white text-green-700 hover:bg-green-50 py-4 text-lg font-bold rounded-xl"
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