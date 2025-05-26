import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Shield, CreditCard, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ zipCode, hazard, amount, auditData, onSuccess }: { 
  zipCode: string; 
  hazard: string; 
  amount: number;
  auditData: any;
  onSuccess: (auditId: number) => void; 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required"
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Create audit record after successful payment with questionnaire data
        const auditResponse = await apiRequest("POST", "/api/audits", {
          zipCode,
          primaryHazard: hazard,
          data: auditData,
          stripePaymentId: "temp_payment_id", // In real implementation, get from Stripe
        });

        const audit = await auditResponse.json();
        onSuccess(audit.id);
        
        toast({
          title: "Payment Successful",
          description: "Redirecting to audit wizard...",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-emergency-red hover:bg-red-700 text-white py-4 text-lg font-semibold"
      >
        <CreditCard className="mr-2 h-5 w-5" />
        {isLoading ? "Processing..." : `Pay $${amount} & Start Audit`}
      </Button>
    </form>
  );
};

export default function Payment() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [hazard, setHazard] = useState("");
  const [amount, setAmount] = useState(29);
  const [plan, setPlan] = useState("basic");
  const [auditData, setAuditData] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const zip = urlParams.get('zipCode') || '';
    const detectedHazard = urlParams.get('hazard') || '';
    const dataString = urlParams.get('data') || '{}';
    const planAmount = parseInt(urlParams.get('amount') || '29');
    const selectedPlan = urlParams.get('plan') || 'basic';
    
    setZipCode(zip);
    setHazard(detectedHazard);
    setAmount(planAmount);
    setPlan(selectedPlan);
    
    try {
      const parsedData = JSON.parse(dataString);
      setAuditData(parsedData);
    } catch (error) {
      console.error('Failed to parse audit data:', error);
      setAuditData({});
    }

    // Create payment intent with the selected amount
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: planAmount
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Failed to create payment intent:", error);
      });
  }, []);

  const goBackToZip = () => {
    setLocation("/start-audit");
  };

  const onPaymentSuccess = (auditId: number) => {
    setLocation(`/success/${auditId}`);
  };

  if (!clientSecret || !zipCode || !hazard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fema-blue to-blue-800 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fema-blue to-blue-800 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <Card className="shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-safety-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Your Audit</h2>
              <p className="text-gray-600">
                Complete payment to unlock your personalized disaster preparedness audit
              </p>
            </div>

            <Card className="bg-gray-50 mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700">ZIP Code Detected:</span>
                  <span className="font-semibold">{zipCode}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700">Primary Hazard:</span>
                  <span className="font-semibold text-emergency-red">{hazard}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total ({plan} plan):</span>
                    <span className="text-2xl font-bold text-fema-blue">${amount}.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                zipCode={zipCode} 
                hazard={hazard} 
                amount={amount}
                auditData={auditData}
                onSuccess={onPaymentSuccess} 
              />
            </Elements>

            <div className="text-center text-sm text-gray-600 mb-4 flex items-center justify-center">
              <Lock className="mr-1 h-4 w-4" />
              Secured by Stripe • 256-bit SSL encryption
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={goBackToZip}
                className="text-fema-blue hover:text-blue-700 text-sm font-medium"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Change ZIP Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
