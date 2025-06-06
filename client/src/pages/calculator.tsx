import { InsuranceCalculator } from "@/components/insurance-calculator";

export default function Calculator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Insurance Savings Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate potential insurance savings from disaster-resistant improvements based on official FEMA guidelines
          </p>
        </div>
        
        <InsuranceCalculator />
      </div>
    </div>
  );
}