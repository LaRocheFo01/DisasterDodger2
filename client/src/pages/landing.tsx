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
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 font-medium">
                How it Works
              </a>
              <a href="#support" className="text-gray-700 hover:text-green-600 font-medium">
                Support
              </a>
              <Button 
                onClick={startAudit}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                Watch Demo
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Green Background Section */}
        <div className="bg-green-600 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Dodge<br />
                  Disasters<br />
                  Before<br />
                  <span className="text-gray-800">They Strike</span>
                </h1>
                <p className="text-xl mb-8 text-green-50 leading-relaxed">
                  Five-minute, FEMA-aligned home audit that pinpoints <strong className="text-white">wildfire, flood, hurricane, and earthquake risks</strong>—so you can act now and save on insurance.
                </p>
              </div>

              {/* Right Content - Risk Assessment Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Get Your Risk Assessment
                </h3>
                
                <form onSubmit={handleZipSubmit} className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Enter your ZIP code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      maxLength={5}
                      className="w-full rounded-lg border border-gray-300 px-4 py-4 text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-lg"
                  >
                    Get Free Risk Assessment 
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>

                <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  No personal info required
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                  FEMA-aligned data • Instant results • 500k+ homes protected
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600">
                Get your personalized disaster preparedness audit in 3 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                  1
                </div>
                <h3 className="text-2xl font-semibold mb-4">Enter ZIP Code</h3>
                <p className="text-gray-600 text-lg">
                  Start by entering your ZIP code to identify your primary disaster risks
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                  2
                </div>
                <h3 className="text-2xl font-semibold mb-4">Complete Assessment</h3>
                <p className="text-gray-600 text-lg">
                  Answer targeted questions about your home with optional photo uploads
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                  3
                </div>
                <h3 className="text-2xl font-semibold mb-4">Get Your Report</h3>
                <p className="text-gray-600 text-lg">
                  Receive instant recommendations with FEMA citations and action plans
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Protect Your Home Today
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of homeowners who have reduced their disaster risk and insurance costs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Enter your ZIP code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                maxLength={5}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <Button 
                onClick={startAudit}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg whitespace-nowrap"
              >
                Start Free Assessment
              </Button>
            </div>

            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              Free • No signup required • Instant results
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">SafeHaven</span>
                </div>
                <p className="text-gray-400 mb-4">
                  FEMA-certified disaster preparedness audits helping homeowners protect their families and properties.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#help" className="hover:text-white">Help Center</a></li>
                  <li><a href="#contact" className="hover:text-white">Contact Us</a></li>
                  <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#terms" className="hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 SafeHaven. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}