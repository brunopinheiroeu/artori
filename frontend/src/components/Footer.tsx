import { Brain, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const isSchool = variant === "school";
  const logoGradient = isSchool
    ? "from-green-500 to-blue-600"
    : schoolColors || "from-indigo-500 to-purple-600";
  const textGradient = isSchool
    ? "from-green-600 to-blue-600"
    : "from-indigo-600 to-purple-600";
  const brandName = schoolName || "artori.app";
  const LogoIcon = isSchool ? GraduationCap : Brain;

  const footerLinks = {
    product: [
      { name: t("footer:links.features"), href: "/#features" },
      { name: t("footer:links.pricing"), href: "/pricing" },
      { name: t("footer:links.forSchools"), href: "/solutions" },
      { name: t("footer:links.api"), href: "/api" },
    ],
    company: [
      { name: t("footer:links.about"), href: "/about" },
      { name: t("footer:links.blog"), href: "/blog" },
      { name: t("footer:links.careers"), href: "/careers" },
      { name: t("footer:links.press"), href: "/press" },
    ],
    resources: [
      { name: t("footer:links.helpCenter"), href: "/help" },
      { name: t("footer:links.community"), href: "/community" },
      { name: t("footer:links.guides"), href: "/guides" },
      { name: t("footer:links.webinars"), href: "/webinars" },
    ],
    legal: [
      { name: t("footer:links.privacyPolicy"), href: "/privacy" },
      { name: t("footer:links.termsOfService"), href: "/terms" },
      { name: t("footer:links.cookiePolicy"), href: "/cookies" },
      { name: t("footer:links.gdpr"), href: "/gdpr" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/artori_app", icon: "𝕏" },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/artori",
      icon: "💼",
    },
    { name: "GitHub", href: "https://github.com/artori-app", icon: "🐙" },
    { name: "Discord", href: "https://discord.gg/artori", icon: "💬" },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 border-t border-white/20">
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
                    <p className="text-xs text-gray-500">
                      {t("footer:poweredBy")}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src="/artori-logo.png"
                    alt="Artori"
                    className="h-8 w-auto"
                  />
                </>
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {isSchool
                ? t("footer:schoolDescription", { brandName })
                : t("footer:description")}
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-indigo-500" />
                <span>hello@artori.app</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-indigo-500" />
                <span>+34 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-indigo-500" />
                <span>Valencia - Spain</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/70 transition-all shadow-sm border border-white/20"
                  title={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>

            {/* Copyright integrated into brand section */}
            <div className="text-sm text-gray-600">
              © 2025 {brandName}.{" "}
              {isSchool ? `${t("footer:poweredBy")} - ` : ""}
              {t("footer:copyright")}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Product */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">
                {t("footer:product")}
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-indigo-600 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">
                {t("footer:company")}
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-indigo-600 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">
                {t("footer:resources")}
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-indigo-600 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">
                {t("footer:legal")}
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-indigo-600 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
