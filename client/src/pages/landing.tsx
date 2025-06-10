import { Shield, ArrowRight, CheckCircle, Zap, Waves, Flame, Wind, ChevronDown, ChevronUp, Home, Clock, DollarSign, Star, Users, MapPin, Target, Heart, Globe, Download, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-full px-8 py-4 shadow-lg border border-green-100">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Disaster Dodger</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#process" className="text-gray-600 hover:text-green-600 font-medium transition-colors">How It Works</a>
            <a href="#stories" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Resources</a>
            <Button 
              onClick={startAudit}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
            >
              Start Now
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Interactive Elements */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-300/40 rounded-full blur-lg animate-float animate-delay-700"></div>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-green-100/50 rounded-full blur-2xl animate-float animate-delay-300"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-emerald-200/30 rounded-full blur-xl animate-float animate-delay-1000"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-left animate-fade-in-up">


              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Home's
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Protector
                </span>
                <span className="block text-4xl lg:text-5xl text-gray-700">
                  Against Disasters
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
              Get a clear, report to make your home safer, no jargon, no hassle, right in five minutes.              </p>

              {/* Interactive Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 transition-all duration-300">
                  <div className="text-2xl font-bold text-green-600">5min</div>
                  <div className="text-sm text-gray-600">Quick Setup</div>
                </div>
                <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 transition-all duration-300">
                  <div className="text-2xl font-bold text-green-600">20%</div>
                  <div className="text-sm text-gray-600">Avg Savings</div>
                </div>
                <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 transition-all duration-300">
                  <div className="text-2xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-600">Protection</div>
                </div>
              </div>

              {/* CTA Form */}
              <form onSubmit={handleZipSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Enter your ZIP code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      maxLength={5}
                      className="w-full pl-12 pr-4 py-4 text-lg border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 h-[60px]"
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-[60px]"
                  >
                    Protect My Home
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Free assessment • No credit card required • Instant results
                </p>
              </form>
            </div>

            {/* Right Column - Interactive Visualization */}
            <div className="relative animate-scale-in animate-delay-500">
              {/* Central Home Illustration */}
              <div className="relative mx-auto w-96 h-96 flex items-center justify-center">
                <img 
                  src="/assets/disaster-dodger-illustration.png" 
                  alt="Protected home with natural disaster elements" 
                  className="w-full h-full object-contain"
                />
                
                {/* Floating Protection Shields */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-float">
                  <Flame className="w-8 h-8 text-red-500" />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-float animate-delay-300">
                  <Waves className="w-8 h-8 text-blue-500" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center animate-float animate-delay-700">
                  <Zap className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center animate-float animate-delay-1000">
                  <Wind className="w-8 h-8 text-gray-500" />
                </div>
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* Magical Process Section */}
      <section id="process" className="py-32 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Three Steps to 

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> a Safer Home</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these quick steps to see exactly where your risks are, and how to fix them:
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-emerald-300 to-green-200 transform -translate-y-1/2 hidden lg:block"></div>
            
            <div className="grid lg:grid-cols-3 gap-16 relative">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <MapPin className="w-16 h-16 text-white" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-green-600 shadow-lg">
                    1
                  </div>
                  <div className="absolute inset-0 rounded-full bg-white/20 scale-110 animate-ping"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Enter Your Location</h3>
                <p className="text-gray-600 leading-relaxed">
                  We identify your area's primary natural hazards
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <CheckCircle className="w-16 h-16 text-white" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-green-600 shadow-lg">
                    2
                  </div>
                  <div className="absolute inset-0 rounded-full bg-white/20 scale-110 animate-ping animation-delay-1000"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Answer Simple Questions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Quick assessment about your home's current preparedness
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <Star className="w-16 h-16 text-white" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-green-600 shadow-lg">
                    3
                  </div>
                  <div className="absolute inset-0 rounded-full bg-white/20 scale-110 animate-ping animation-delay-2000"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Your Report</h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive detailed recommendations with cost estimates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Resources & Tools */}
      <section id="stories" className="py-32 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Essential Emergency
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Resources & Tools</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get immediate access to critical preparedness resources and tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Emergency Kit Download */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">72-Hour Emergency Kit</h3>
                  <p className="text-gray-600">Complete family survival checklist</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Download our comprehensive 72-hour family survival guide with FEMA-approved checklists for water, food, medical supplies, and emergency tools.
              </p>
              <Button 
                onClick={() => window.open('/72-hour-family-survival-guide.pdf', '_blank')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[60px]"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Emergency Kit Guide
              </Button>
            </div>

            {/* Insurance Calculator */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Insurance Calculator</h3>
                  <p className="text-gray-600">Calculate potential savings</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Discover how much you could save on insurance premiums with disaster preparedness improvements. Get instant estimates based on your home's risk profile.
              </p>
              <Button 
                onClick={() => setLocation('/calculator')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[60px]"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Insurance Savings
              </Button>
            </div>
          </div>

          {/* Join Community & CTA */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Community Button */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-center shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Join Our Community</h3>
              <p className="text-purple-100 mb-6">
                Connect with thousands of prepared families sharing tips and experiences
              </p>
              <Button 
                onClick={() => window.open('https://discord.gg/disasterdodger', '_blank')}
                className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[60px]"
              >
                <Users className="mr-2 h-5 w-5" />
                Join Community
              </Button>
            </div>

            {/* Main CTA */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Start Your Protection Plan</h3>
              <p className="text-green-100 mb-6">
                Get your personalized home safety assessment in just 5 minutes
              </p>
              <Button 
                onClick={startAudit}
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[60px]"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Start Free Assessment
              </Button>
            </div>
          </div>
        </div>
      </section>



      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-40 right-10 w-12 h-12 border-2 border-white rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-8">
            Your Family's Safety
            <span className="block text-emerald-200">Can't Wait</span>
          </h2>
          <p className="text-2xl text-green-100 mb-12 leading-relaxed">
            Join 2,500+ families who've already secured their homes. Start your protection journey in the next 5 minutes.
          </p>

          <div className="max-w-md mx-auto">
            <form onSubmit={handleZipSubmit} className="space-y-6">
              <input 
                type="text" 
                placeholder="Enter ZIP code to begin"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                maxLength={5}
                className="w-full px-6 py-4 text-xl text-gray-900 rounded-xl border-0 focus:ring-4 focus:ring-white/25 shadow-xl"
                required
              />
              <Button 
                type="submit"
                className="w-full bg-white text-green-700 hover:bg-green-50 py-4 text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Protect My Family Now
                <Shield className="ml-3 h-6 w-6" />
              </Button>
            </form>
            
            <div className="mt-8 flex items-center justify-center space-x-8 text-green-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>100% free</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-2xl font-bold">Disaster Dodger</span>
            </div>
            <p className="text-gray-400 mb-8">Protecting families, one home at a time.</p>
            <div className="flex justify-center space-x-8 text-gray-400">
              <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-green-400 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}