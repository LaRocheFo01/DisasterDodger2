import { Shield, ArrowRight, CheckCircle, Zap, Waves, Flame, Wind, ChevronDown, ChevronUp, Home, Clock, DollarSign, Star, Users, MapPin, Target, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [zipCode, setZipCode] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

  // Rotating testimonials
  const testimonials = [
    { name: "Sarah M.", location: "Austin, TX", savings: "$2,400", quote: "Our flood insurance dropped 40% after following the recommendations." },
    { name: "Mike R.", location: "Phoenix, AZ", savings: "$1,800", quote: "The wildfire protection plan saved our home when neighbors lost theirs." },
    { name: "Lisa K.", location: "Miami, FL", savings: "$3,200", quote: "Hurricane prep recommendations cut our insurance by $3,200 annually." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
            <a href="#stories" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Success Stories</a>
            <a href="#resources" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Resources</a>
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
              {/* Floating Badge */}
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-bounce-in">
                <Star className="w-4 h-4" />
                <span>Trusted by 2,500+ families nationwide</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Home's
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Guardian Angel
                </span>
                <span className="block text-4xl lg:text-5xl text-gray-700">
                  Against Disasters
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                Transform your home into a fortress against nature's fury. Our comprehensive assessment creates a personalized shield of protection in just 5 minutes.
              </p>

              {/* Animated Protection Level Bars */}
              <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Protection Level</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Flame className="w-5 h-5 text-red-500" />
                      <span className="text-gray-700 font-medium">Wildfire</span>
                    </div>
                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full animate-fill-bar" style={{width: '65%', animationDelay: '0.5s'}}></div>
                    </div>
                    <span className="text-red-600 font-bold text-sm">65%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Waves className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700 font-medium">Flood</span>
                    </div>
                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full animate-fill-bar" style={{width: '80%', animationDelay: '1s'}}></div>
                    </div>
                    <span className="text-blue-600 font-bold text-sm">80%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-700 font-medium">Earthquake</span>
                    </div>
                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full animate-fill-bar" style={{width: '45%', animationDelay: '1.5s'}}></div>
                    </div>
                    <span className="text-yellow-600 font-bold text-sm">45%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Wind className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 font-medium">Hurricane</span>
                    </div>
                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-400 to-gray-600 h-3 rounded-full animate-fill-bar" style={{width: '75%', animationDelay: '2s'}}></div>
                    </div>
                    <span className="text-gray-600 font-bold text-sm">75%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  <span className="text-red-600 font-medium">Get your personalized assessment</span> to improve these scores
                </p>
              </div>

              {/* Interactive Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 transition-all duration-300">
                  <div className="text-2xl font-bold text-green-600">5min</div>
                  <div className="text-sm text-gray-600">Quick Setup</div>
                </div>
                <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 transition-all duration-300">
                  <div className="text-2xl font-bold text-green-600">35%</div>
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
                      className="w-full pl-12 pr-4 py-4 text-lg border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
              {/* Central Home Icon */}
              <div className="relative mx-auto w-80 h-80 bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl flex items-center justify-center">
                <Home className="w-32 h-32 text-green-600" />
                
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

                {/* Protective Shield Overlay */}
                <div className="absolute inset-0 border-4 border-green-300 rounded-3xl animate-pulse"></div>
              </div>

              {/* Rotating Testimonial */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl p-6 max-w-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-gray-500">{testimonials[currentTestimonial].location}</div>
                  </div>
                  <div className="ml-auto text-green-600 font-bold">{testimonials[currentTestimonial].savings}</div>
                </div>
                <p className="text-gray-700 text-sm">"{testimonials[currentTestimonial].quote}"</p>
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
              Protection That Feels Like
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Magic</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to transform your home into an impenetrable sanctuary
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

      {/* Social Proof Stories */}
      <section id="stories" className="py-32 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Real Families, Real Protection,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Real Savings</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Story Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  JM
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Jennifer & Mark</h4>
                  <p className="text-gray-600">California Wildfire Zone</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <div className="text-3xl font-bold text-green-600 mb-1">$15,000</div>
                <div className="text-sm text-green-700">Prevented damage cost</div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "When the Creek Fire hit our neighborhood, we were the only house that survived. The defensible space plan saved everything we worked for."
              </p>
            </div>

            {/* Story Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  RK
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Rodriguez Family</h4>
                  <p className="text-gray-600">Houston, Texas</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <div className="text-3xl font-bold text-green-600 mb-1">$3,600</div>
                <div className="text-sm text-green-700">Annual insurance savings</div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "The flood mitigation upgrades dropped our premiums by 45%. The plan paid for itself in just 8 months!"
              </p>
            </div>

            {/* Story Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  DL
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">David & Lisa</h4>
                  <p className="text-gray-600">Seattle, Washington</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <div className="text-3xl font-bold text-green-600 mb-1">$8,500</div>
                <div className="text-sm text-green-700">Grant funding secured</div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "We qualified for state earthquake retrofitting grants we never knew existed. The guidance was invaluable."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Resources */}
      <section id="resources" className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Your Emergency
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Toolkit</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Free resources to start protecting your family today
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Resource Cards */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">Emergency Action Plan</h4>
                    <p className="text-gray-600">72-hour family survival checklist</p>
                  </div>
                  <Button className="btn-outline btn-small">Download</Button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">Insurance Calculator</h4>
                    <p className="text-gray-600">Estimate your potential savings</p>
                  </div>
                  <Button className="btn-outline btn-small">Calculate</Button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">Community Network</h4>
                    <p className="text-gray-600">Connect with prepared neighbors</p>
                  </div>
                  <Button className="btn-outline btn-small">Join</Button>
                </div>
              </div>
            </div>

            {/* Interactive Preview */}
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                See Your Protection Level
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Wildfire Risk</span>
                  <div className="flex-1 mx-4 bg-white rounded-full h-3">
                    <div className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <span className="text-red-600 font-bold">75%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Flood Protection</span>
                  <div className="flex-1 mx-4 bg-white rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <span className="text-green-600 font-bold">90%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Wind Resistance</span>
                  <div className="flex-1 mx-4 bg-white rounded-full h-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <span className="text-yellow-600 font-bold">60%</span>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Button 
                  onClick={startAudit}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl"
                >
                  Get Your Real Assessment
                </Button>
              </div>
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