import { useState } from "react";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onStartAudit: () => void;
}

export default function Navigation({ onStartAudit }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-fema-blue">
                <Shield className="inline mr-2 h-6 w-6" />
                Disaster Dodger™
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href.substring(1))}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    index === 0 
                      ? 'text-fema-blue hover:text-blue-700' 
                      : 'text-gray-700 hover:text-fema-blue'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Button 
                onClick={onStartAudit}
                className="bg-emergency-red hover:bg-red-700 text-white px-4 py-2 text-sm font-medium"
              >
                Start Audit
              </Button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-fema-blue focus:outline-none focus:ring-2 focus:ring-fema-blue"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item, index) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href.substring(1))}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-medium ${
                  index === 0 
                    ? 'text-fema-blue' 
                    : 'text-gray-700 hover:text-fema-blue'
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => {
                onStartAudit();
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-emergency-red hover:bg-red-700 text-white px-3 py-4 text-base font-medium mt-2"
            >
              Start Audit
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
