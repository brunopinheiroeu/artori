import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Pricing Plans
            </span>
          </h1>
          <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
        </div>

        {/* Simple 4-card layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          
          {/* Card 1: Free */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-4">$0<span className="text-sm">/month</span></div>
              <ul className="text-left space-y-2 mb-6">
                <li>✅ 5 questions/day</li>
                <li>✅ Basic explanations</li>
                <li>✅ Progress tracking</li>
              </ul>
              <Link to="/login">
                <button className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                  Get Started
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2: Student */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-indigo-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm">Most Popular</span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Student</h3>
              <div className="text-3xl font-bold mb-4">$19<span className="text-sm">/month</span></div>
              <ul className="text-left space-y-2 mb-6">
                <li>✅ Unlimited questions</li>
                <li>✅ AI explanations</li>
                <li>✅ All exam types</li>
                <li>✅ Priority support</li>
              </ul>
              <Link to="/login">
                <button className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600">
                  Start Free Trial
                </button>
              </Link>
            </div>
          </div>

          {/* Card 3: Pro */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-purple-500">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-4">$39<span className="text-sm">/month</span></div>
              <ul className="text-left space-y-2 mb-6">
                <li>✅ Everything in Student</li>
                <li>✅ Study schedule</li>
                <li>✅ Custom tests</li>
                <li>✅ Performance predictions</li>
              </ul>
              <Link to="/login">
                <button className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">
                  Start Free Trial
                </button>
              </Link>
            </div>
          </div>

          {/* Card 4: For Schools */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-green-500">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">For Schools</h3>
              <div className="text-3xl font-bold mb-4">Custom</div>
              <ul className="text-left space-y-2 mb-6">
                <li>✅ Everything in Pro</li>
                <li>✅ Unlimited students</li>
                <li>✅ Teacher dashboards</li>
                <li>✅ Custom branding</li>
              </ul>
              <Link to="/solutions">
                <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                  Explore Solutions
                </button>
              </Link>
            </div>
          </div>

        </div>

        {/* Debug info */}
        <div className="text-center mt-12 p-4 bg-yellow-100 rounded-lg max-w-2xl mx-auto">
          <p className="text-lg font-bold">🎯 All 4 pricing cards should be visible above!</p>
          <p className="text-sm mt-2">If you can see this yellow box, the page is loading correctly.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;