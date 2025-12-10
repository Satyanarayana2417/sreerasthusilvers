import { Facebook, Instagram, Twitter } from "lucide-react";
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
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-foreground/10 hover:bg-primary hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Shop Online", links: ["Rings", "Earrings", "Necklaces", "Bracelets"] },
            { title: "Categories", links: ["Rings", "Accessories", "Earrings", "Gold Buckle", "Bracelets"] },
            { title: "Information", links: ["Order Tracking", "Terms & Conditions", "Privacy Policy", "Tutorials", "FAQ"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-heading font-medium mb-4 text-foreground">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

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
