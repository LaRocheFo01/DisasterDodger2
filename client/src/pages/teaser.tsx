import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Mail, Download, Facebook, CheckCircle, Calendar, Bell, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Teaser() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setHasSubmitted(true);
        // Trigger PDF download
        window.open('/72-hour-family-survival-guide.pdf', '_blank');
        toast({
          title: "Success!",
          description: "Your emergency kit is downloading. Check your email for updates!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      {/* Header */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-full px-8 py-4 shadow-lg border border-green-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">Disaster Dodger</span>
          <div className="ml-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
            Coming Soon
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <Calendar className="h-4 w-4" />
              <span>Launching in 2 Weeks</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Get Your Free
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 block">
                72-Hour Emergency Kit
              </span>
              <span className="text-3xl md:text-4xl block mt-4 text-gray-700">
                & Insurance Savings Estimate
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Be the first to access our revolutionary home disaster preparedness platform. 
              Get your emergency survival guide instantly and stay updated on our launch.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Form */}
            <div className="space-y-8">
              {!hasSubmitted ? (
                <>
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-green-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      Get Instant Access
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 pr-4 py-4 text-lg border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 h-[60px]"
                          required
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[60px]"
                      >
                        {isSubmitting ? (
                          <>Getting Your Kit...</>
                        ) : (
                          <>
                            <Download className="mr-2 h-5 w-5" />
                            Get Free Emergency Kit
                          </>
                        )}
                      </Button>
                    </form>
                    
                    <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Instant download</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>No spam</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>FEMA approved</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Follow */}
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Follow our journey and get updates:</p>
                    <Button
                      onClick={() => window.open('https://facebook.com/DisasterDodger', '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                      <Facebook className="mr-2 h-5 w-5" />
                      Follow on Facebook
                    </Button>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-green-100 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    You're All Set!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your emergency kit should be downloading now. We'll email you when Disaster Dodger launches!
                  </p>
                  <Button
                    onClick={() => window.open('https://facebook.com/DisasterDodger', '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    <Facebook className="mr-2 h-5 w-5" />
                    Follow for Updates
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column - Illustration */}
            <div className="relative">
              <div className="relative mx-auto w-96 h-96 flex items-center justify-center">
                <img 
                  src="/assets/disaster-dodger-illustration.png" 
                  alt="Protected home with natural disaster preparedness" 
                  className="w-full h-full object-contain"
                />
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-float">
                  <Download className="w-8 h-8 text-green-500" />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-float animate-delay-300">
                  <Shield className="w-8 h-8 text-blue-500" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center animate-float animate-delay-700">
                  <Bell className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center animate-float animate-delay-1000">
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What's Coming in 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Disaster Dodger</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive platform to protect your home and family from natural disasters
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Assessment</h3>
              <p className="text-gray-600">
                Personalized home vulnerability analysis based on your location and property type
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Action Plans</h3>
              <p className="text-gray-600">
                Step-by-step preparedness guides tailored to your specific disaster risks
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Insurance Savings</h3>
              <p className="text-gray-600">
                Calculate potential premium reductions from disaster preparedness improvements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Tuned Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Stay Tuned for Launch!
          </h2>
          <p className="text-xl text-green-100 mb-8">
            We're putting the finishing touches on Disaster Dodger. 
            In just 2 weeks, you'll have access to the most comprehensive home disaster preparedness platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-green-200">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Email notifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <Facebook className="h-5 w-5" />
              <span>Social media updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Early access perks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-2xl font-bold">Disaster Dodger</span>
          </div>
          <p className="text-gray-400 mb-4">Protecting families, one home at a time.</p>
          <p className="text-sm text-gray-500">© 2025 Disaster Dodger. Coming soon.</p>
        </div>
      </footer>
    </div>
  );
}