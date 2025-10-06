import { Brain, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

interface FooterProps {
  variant?: "artori" | "school";
  schoolName?: string;
  schoolColors?: string;
}

const Footer = ({
  variant = "artori",
  schoolName,
  schoolColors,
}: FooterProps) => {
  const isSchool = variant === "school";
  const logoGradient = schoolColors || "from-indigo-500 to-purple-600";
  const textGradient = schoolColors || "from-indigo-600 to-purple-600";
  const brandName = schoolName || "artori";
  const LogoIcon = isSchool ? GraduationCap : Brain;

  const footerLinks = {
    product: [
      { name: "Features", href: "/#features" },
      { name: "Pricing", href: "/pricing" },
      { name: "For Schools", href: "/solutions" },
      { name: "API", href: "/api" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    resources: [
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Guides", href: "/guides" },
      { name: "Webinars", href: "/webinars" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/artori_app", icon: "𝕏" },
    { name: "LinkedIn", href: "https://linkedin.com/company/artori", icon: "💼" },
    { name: "GitHub", href: "https://github.com/artori-app", icon: "🐙" },
    { name: "Discord", href: "https://discord.gg/artori", icon: "💬" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              {isSchool ? (
                <>
                  <div
                    className={`p-2 rounded-xl bg-gradient-to-r ${logoGradient} shadow-lg`}
                  >
                    <LogoIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span
                      className={`text-2xl font-bold bg-gradient-to-r ${textGradient} bg-clip-text text-transparent`}
                    >
                      {brandName}
                    </span>
                    <p className="text-xs text-gray-500">Powered by artori.app</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">artori</span>
                </>
              )}
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {isSchool 
                ? `Empowering ${brandName} students with responsible AI-powered learning that enhances education and promotes critical thinking.`
                : "Responsible AI for better learning. We help students master high-stakes exams with transparent, explainable AI that promotes critical thinking."
              }
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@artori.app</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA & New York, NY</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Product */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stay updated
              </h3>
              <p className="text-gray-600">
                Get the latest updates on new features, exam content, and educational insights.
              </p>
            </div>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-600 text-sm">
              © 2025 {brandName}. {isSchool ? "Powered by artori.app. " : ""}
              All rights reserved. Responsible AI for better learning. 🌟
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  title={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">🔒</span>
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-500">🛡️</span>
              <span>GDPR Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-500">⭐</span>
              <span>4.9/5 Student Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-500">🏆</span>
              <span>EdTech Award Winner 2024</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;