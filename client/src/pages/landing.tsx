import { Shield, Play, Clock, Download, CheckCircle, 
         Camera, ChevronDown, ChevronUp, MapPin, 
         Phone, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const startAudit = () => {
    setLocation("/start-audit");
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (faqNumber: number) => {
    setOpenFaq(openFaq === faqNumber ? null : faqNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onStartAudit={startAudit} />
      
      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-fema-blue to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="text-warning-orange text-2xl mr-3" />
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  FEMA-Aligned Official Audit
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-6 leading-tight tracking-tight">
                Protect Your Home in Under 5 Minutes
              </h1>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed font-body">
                Get a personalized disaster preparedness audit with instant PDF report, 
                FEMA citations, rebate opportunities, and insurance savings guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={startAudit}
                  className="bg-emergency-red hover:bg-red-700 text-white px-8 py-4 text-lg font-heading font-bold transition-all transform hover:scale-105 shadow-xl rounded-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Your $29 Audit
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => scrollToSection('how-it-works')}
                  className="border-2 border-white text-white hover:bg-white hover:text-fema-blue px-8 py-4 text-lg font-heading font-bold transition-all rounded-lg"
                >
                  Learn How It Works
                </Button>
              </div>
              <div className="flex items-center mt-8 text-blue-100 space-x-6">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span className="text-sm font-body">Under 5 minutes</span>
                </div>
                <div className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  <span className="text-sm font-body">Instant PDF report</span>
                </div>
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span className="text-sm font-body">FEMA citations</span>
                </div>
              </div>
            </div>
            <div className="lg:pl-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Modern suburban home representing disaster preparedness" 
                  className="rounded-xl shadow-lg w-full h-auto"
                />
                <div className="mt-6 text-center">
                  <div className="text-3xl font-bold text-warning-orange">95%</div>
                  <div className="text-sm text-blue-100">Average preparedness improvement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body">
              Get your personalized disaster preparedness audit in 4 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-fema-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">Enter ZIP Code</h3>
              <p className="text-gray-600 font-body">
                Start by entering your 5-digit ZIP code to identify your primary disaster risks
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emergency-red text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">Secure Payment</h3>
              <p className="text-gray-600 font-body">
                One-time $29 payment through secure Stripe checkout for your comprehensive audit
              </p>
            </div>
            <div className="text-center">
              <div className="bg-safety-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">Complete Audit</h3>
              <p className="text-gray-600 font-body">
                Answer 15 quick questions about your home with optional photo uploads
              </p>
            </div>
            <div className="text-center">
              <div className="bg-warning-orange text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">Get Report</h3>
              <p className="text-gray-600 font-body">
                Instant PDF with personalized recommendations, FEMA citations, and savings opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 font-body">One audit, comprehensive results</p>
          </div>
          <div className="max-w-lg mx-auto">
            <Card className="border-4 border-emergency-red shadow-xl">
              <div className="bg-emergency-red text-white text-center py-4">
                <span className="text-lg font-semibold">Most Popular</span>
              </div>
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-heading font-bold mb-4">Complete Audit</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-fema-blue">$29</span>
                    <span className="text-gray-600 ml-2">one-time</span>
                  </div>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="text-safety-green mr-3 h-5 w-5" />
                      <span>Personalized 15-question audit</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-safety-green mr-3 h-5 w-5" />
                      <span>Instant PDF report with recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-safety-green mr-3 h-5 w-5" />
                      <span>FEMA-aligned citations and guidance</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-safety-green mr-3 h-5 w-5" />
                      <span>Rebate and insurance savings links</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-safety-green mr-3 h-5 w-5" />
                      <span>Photo upload capability</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-safety-green mr-3 h-5 w-5" />
                      <span>Quick Win action items</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={startAudit} 
                    className="w-full bg-emergency-red hover:bg-red-700 text-white py-4 text-lg font-semibold"
                  >
                    Start Your Audit Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">Everything you need to know about Disaster Dodger™</p>
          </div>
          <div className="space-y-6">
            {[
              {
                question: "What disasters does the audit cover?",
                answer: "Our audit covers the most common disaster types including earthquakes, floods, hurricanes, tornadoes, wildfires, and winter storms. The specific focus depends on your ZIP code's primary risk factors."
              },
              {
                question: "How is this different from free FEMA resources?",
                answer: "While FEMA provides excellent general guidelines, our audit creates a personalized action plan based on your specific home, location, and circumstances. We compile FEMA recommendations with local rebates and insurance savings opportunities."
              },
              {
                question: "What if I'm not satisfied with my report?",
                answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with your personalized audit report, contact us for a full refund."
              },
              {
                question: "How long does the audit take?",
                answer: "The entire process takes under 5 minutes. After payment, you'll answer 15 questions (optional photo uploads), and receive your PDF report instantly."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-6">
                  <button 
                    onClick={() => toggleFaq(index + 1)} 
                    className="flex justify-between items-center w-full text-left"
                  >
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    {openFaq === index + 1 ? (
                      <ChevronUp className="text-gray-400 h-5 w-5" />
                    ) : (
                      <ChevronDown className="text-gray-400 h-5 w-5" />
                    )}
                  </button>
                  {openFaq === index + 1 && (
                    <div className="mt-4 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">Have questions? We're here to help you stay prepared</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="text-fema-blue mr-4 h-5 w-5" />
                  <span>support@disasterdodger.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="text-fema-blue mr-4 h-5 w-5" />
                  <span>1-800-PREPARE</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-fema-blue mr-4 h-5 w-5" />
                  <span>Mon-Fri 9AM-6PM EST</span>
                </div>
              </div>
            </div>
            <div>
              <form className="space-y-4">
                <Input 
                  type="text" 
                  placeholder="Your Name" 
                  className="focus:ring-2 focus:ring-fema-blue focus:border-transparent" 
                />
                <Input 
                  type="email" 
                  placeholder="Your Email" 
                  className="focus:ring-2 focus:ring-fema-blue focus:border-transparent" 
                />
                <Textarea 
                  placeholder="Your Message" 
                  rows={4} 
                  className="focus:ring-2 focus:ring-fema-blue focus:border-transparent" 
                />
                <Button 
                  type="submit" 
                  className="w-full bg-fema-blue hover:bg-blue-700 text-white py-3 font-semibold"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
