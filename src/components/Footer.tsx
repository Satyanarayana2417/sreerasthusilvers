import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-new.png";

const Footer = () => {
  return (
    <footer className="bg-[#FAF8F5] text-foreground">
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo & About */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <img src={logo} alt="Sreerasthu Silvers" className="h-14 w-auto mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Timeless jewelry, ethically sourced. We believe in the power of jewelry — to tell a story, celebrate a moment.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/sreerasthusilvers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-foreground/10 hover:bg-primary hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/sreerasthu_silvers/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-foreground/10 hover:bg-primary hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Online */}
          <div>
            <h4 className="font-heading font-medium mb-4 text-foreground">Shop Online</h4>
            <ul className="space-y-2">
              {[
                { name: "Rings", path: "/shop/rings" },
                { name: "Earrings", path: "/shop/earrings" },
                { name: "Necklaces", path: "/shop/necklaces" },
                { name: "Bracelets", path: "/shop/bracelets" }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-medium mb-4 text-foreground">Categories</h4>
            <ul className="space-y-2">
              {[
                { name: "Jewelry", path: "/jewelry" },
                { name: "Furniture", path: "/furniture" },
                { name: "Articles", path: "/articles" },
                { name: "Other Products", path: "/products" }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-heading font-medium mb-4 text-foreground">Information</h4>
            <ul className="space-y-2">
              {[
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Terms & Conditions", path: "/terms-conditions" },
                { name: "Shipping Policy", path: "/shipping-policy" },
                { name: "Cancellation & Refund", path: "/cancellation-refund-policy" }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-medium mb-4 text-foreground">Need Help?</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Ramasomayajulu street</li>
              <li>Ramaraopeta, Kakinada, Andhra Pradesh, India, 533001</li>
              <li>Tel: +91 6304960489</li>
              <li>sreerasthusilvers@gmail.com</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-foreground/10 py-6">
        <p className="text-center text-sm text-muted-foreground">
          Copyright © 2025 <span className="text-primary">Sreerasthu Silvers</span>. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
