import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import GradientButton from "@/components/GradientButton";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import AppHeader from "@/components/AppHeader";

const Pricing = () => {
  console.log("Pricing component is rendering!");
  
  const [isAnnual, setIsAnnual] = useState(true);

  // Simple test data
  const plans = [
    { name: "Free", price: 0, color: "gray" },
    { name: "Student", price: 19, color: "blue" },
    { name: "Pro", price: 39, color: "purple" },
    { name: "For Schools", price: "Custom", color: "green" },
  ];

  console.log("Plans array:", plans);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      <AppHeader />

      {/* Simple test section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Pricing Test</h1>
          <p className="text-gray-600">Testing {plans.length} pricing plans</p>
        </div>

        {/* Very simple card layout */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            console.log(`Rendering plan ${index + 1}: ${plan.name}`);
            return (
              <div
                key={plan.name}
                className={`p-6 border-2 rounded-lg bg-white shadow-lg ${
                  plan.color === 'green' ? 'border-green-500' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-gray-600">Plan {index + 1}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {typeof plan.price === 'string' ? plan.price : `$${plan.price}`}
                    </div>
                    {plan.name === 'For Schools' && (
                      <div className="text-sm text-green-600">Customizable</div>
                    )}
                  </div>
                  <div>
                    {plan.name === 'For Schools' ? (
                      <Link to="/solutions">
                        <button className="bg-green-500 text-white px-4 py-2 rounded">
                          Explore Solutions
                        </button>
                      </Link>
                    ) : (
                      <Link to="/login">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">
                          Get Started
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Debug info */}
        <div className="text-center mt-8 p-4 bg-yellow-100 rounded">
          <p className="text-sm">
            Debug: This page should show {plans.length} pricing plans above.
            Check browser console for logs.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;