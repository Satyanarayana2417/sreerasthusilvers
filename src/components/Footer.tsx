import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo & About */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="text-2xl font-heading font-semibold mb-4">OLIGHT</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Timeless jewelry, ethically sourced. We believe in the power of jewelry — to tell a story, celebrate a moment.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Shop Online", links: ["Rings", "Earrings", "Necklaces", "Bracelets"] },
            { title: "Categories", links: ["Jewellery Materials", "Accessories", "Delivery & Returns", "Pearls"] },
            { title: "Information", links: ["Order Tracking", "Terms & Conditions", "Privacy Policy", "FAQ"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-heading font-medium mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-heading font-medium mb-4">Need Help?</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>785 15h Street, Office 478</li>
              <li>Berlin, De 81566</li>
              <li>Tel: 0123456778</li>
              <li>hello@olight-jewelry.com</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-6">
        <p className="text-center text-sm text-primary-foreground/50">
          Copyright © 2025 Olight. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
