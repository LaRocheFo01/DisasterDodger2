import { Shield, Play, Clock, Download, CheckCircle, 
         Camera, ChevronDown, ChevronUp, MapPin, 
         Phone, Mail, AlertCircle, Mountain, Wind, 
         Zap, Snowflake, FileText, DollarSign, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="min-h-screen bg-gradient-to-br from-disaster-green-50 to-disaster-green-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-disaster-green-600 mr-3" />
              <span className="text-xl font-semibold text-gray-900">Disaster Dodger™</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 hover:text-disaster-green-600 text-sm font-medium"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-600 hover:text-disaster-green-600 text-sm font-medium"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-gray-600 hover:text-disaster-green-600 text-sm font-medium"
              >
                Support
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main 
        className="bg-gray-50 pt-16 pb-24 relative"
        style={{
          backgroundImage: "url('/assets/hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              Dodge Disasters Before They Strike
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
              Five-minute, FEMA-aligned home audit that pinpoints wildfire, flood, hurricane, and earthquake risks—so you can act now and save on insurance.
            </p>
          </div>

          {/* ZIP Entry Card */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-16 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-2">Start Your Free Assessment</h2>
            <p className="text-gray-600">Enter your ZIP code to discover your area's disaster risks</p>
          </div>
          <form onSubmit={handleZipSubmit}>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">Your ZIP Code</label>
            <input 
              id="zip" 
              name="zip"
              type="text"
              maxLength={5}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
              className="block w-full rounded-md border-gray-300 focus:ring-disaster-green-500 focus:border-disaster-green-500 text-center text-lg py-3 mb-2"
              placeholder="e.g. 90210" 
              required
            />
            <p className="text-sm text-gray-500 text-center mb-4">
              We'll use this to load your local hazard data—no personal info stored.
            </p>
            <button 
              type="submit"
              className="w-full py-3 rounded-lg bg-disaster-green-600 text-white hover:bg-disaster-green-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-disaster-green-500 active:scale-95"
            >
              Analyze My Area
              <ArrowRight className="ml-2 h-4 w-4 inline" />
            </button>
          </form>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <MapPin className="text-disaster-green-600 h-8 w-8 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Location-Based Analysis</h3>
            <p className="text-gray-600 text-sm">
              Get hazard assessments tailored to your specific ZIP code and regional disaster risks
            </p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <FileText className="text-disaster-green-600 h-8 w-8 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Expert FEMA Guidance</h3>
            <p className="text-gray-600 text-sm">
              Professional recommendations aligned with official disaster preparedness standards
            </p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <Download className="text-disaster-green-600 h-8 w-8 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Instant PDF Reports</h3>
            <p className="text-gray-600 text-sm">
              Download comprehensive reports with step-by-step action plans and cost estimates
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center text-gray-600 text-sm mb-4">
            <Users className="h-4 w-4 mr-2" />
            Trusted by 10,000+ homeowners nationwide
          </div>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-disaster-green-600" />
              <span>Under 5 minutes</span>
            </div>
            <div className="flex items-center">
              <Download className="mr-2 h-4 w-4 text-disaster-green-600" />
              <span>Instant results</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-disaster-green-600" />
              <span>FEMA-aligned</span>
            </div>
          </div>
        </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get your personalized disaster preparedness audit in 3 simple steps
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8 max-w-2xl mx-auto">
            <div className="bg-disaster-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white shadow-md rounded-lg p-6">
              <div className="bg-disaster-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-medium mb-3">Enter ZIP Code</h3>
              <p className="text-gray-600">
                Start by entering your ZIP code to identify your primary disaster risks and local hazards
              </p>
            </div>
            <div className="text-center bg-white shadow-md rounded-lg p-6">
              <div className="bg-disaster-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-medium mb-3">Complete Assessment</h3>
              <p className="text-gray-600">
                Answer targeted questions about your home with optional photo uploads for detailed analysis
              </p>
            </div>
            <div className="text-center bg-white shadow-md rounded-lg p-6">
              <div className="bg-disaster-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-medium mb-3">Get Your Report</h3>
              <p className="text-gray-600">
                Receive instant PDF with personalized recommendations, FEMA citations, and action plans
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disaster Protection Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Comprehensive Disaster Protection</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get expert preparedness guidance for all major disaster types affecting your region
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="text-white h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Earthquake</h3>
              <p className="text-gray-600 text-sm">Seismic safety, structural retrofits, foundation anchoring</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="text-white h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Wildfire</h3>
              <p className="text-gray-600 text-sm">Defensible space, fire-resistant materials, evacuation planning</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind className="text-white h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Hurricane</h3>
              <p className="text-gray-600 text-sm">Storm shutters, roof reinforcement, flooding protection</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-white h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Flood</h3>
              <p className="text-gray-600 text-sm">Drainage systems, waterproofing, elevated utilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">Comprehensive disaster preparedness audit</p>
          </div>
          <div className="max-w-lg mx-auto">
            <div className="bg-white border-2 border-disaster-green-600 shadow-lg rounded-xl overflow-hidden">
              <div className="bg-disaster-green-600 text-white text-center py-4">
                <span className="text-lg font-medium">Complete Assessment</span>
              </div>
              <div className="p-8">
                <div className="text-center">
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">Free</span>
                    <span className="text-gray-600 ml-2">assessment</span>
                  </div>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="text-disaster-mint-600 mr-3 h-5 w-5" />
                      <span>Personalized hazard assessment</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-disaster-mint-600 mr-3 h-5 w-5" />
                      <span>Instant recommendations report</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-disaster-mint-600 mr-3 h-5 w-5" />
                      <span>FEMA-aligned safety guidance</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-disaster-mint-600 mr-3 h-5 w-5" />
                      <span>Photo upload capability</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-disaster-mint-600 mr-3 h-5 w-5" />
                      <span>Downloadable action plan</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={startAudit} 
                    className="w-full bg-disaster-green-600 hover:bg-disaster-green-700 text-white py-4 px-8 rounded-lg font-medium text-lg active:scale-95 transition-all"
                  >
                    Start Your Free Audit Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about our disaster preparedness audits</p>
          </div>
          <div className="space-y-4">
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
                a: "Most homeowners complete their assessment in under 5 minutes. The questionnaire is designed to be quick while still gathering the essential information for accurate recommendations."
              },
              {
                q: "Are the recommendations really FEMA-aligned?",
                a: "Yes, all our recommendations are based on official FEMA guidelines, building codes, and emergency management best practices to ensure you get authoritative guidance."
              },
              {
                q: "Can I use this for insurance purposes?",
                a: "While our audit provides valuable preparedness information, you should consult with your insurance provider about specific coverage requirements and potential discounts for mitigation measures."
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-disaster-green-600 mr-3" />
                <span className="text-xl font-semibold text-gray-900">Disaster Dodger™</span>
              </div>
              <p className="text-gray-600 mb-4">
                Helping families prepare for the unexpected with expert-guided disaster preparedness assessments.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-disaster-green-600">How It Works</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-disaster-green-600">Pricing</button></li>
                <li><a href="#sample" className="text-gray-600 hover:text-disaster-green-600">Sample Report</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#privacy" className="text-gray-600 hover:text-disaster-green-600">Privacy Policy</a></li>
                <li><a href="#terms" className="text-gray-600 hover:text-disaster-green-600">Terms of Service</a></li>
                <li><a href="#contact" className="text-gray-600 hover:text-disaster-green-600">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Disaster Dodger™. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}