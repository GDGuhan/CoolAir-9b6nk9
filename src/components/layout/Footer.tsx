import { Link } from "react-router-dom";
import { Wind, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center">
                <Wind className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CoolAir</span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              India's most trusted AC brand. Premium cooling solutions for homes, offices, and commercial spaces since 2015.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-background/10 hover:bg-primary/30 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold text-background">Products</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Split AC", href: "/products?type=Split" },
                { label: "Window AC", href: "/products?type=Window" },
                { label: "Cassette AC", href: "/products?type=Cassette" },
                { label: "Tower AC", href: "/products?type=Tower" },
                { label: "Inverter AC", href: "/products?energyRating=5" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-background">Support</h3>
            <ul className="space-y-2.5">
              {[
                "Installation Guide",
                "Maintenance Tips",
                "Warranty Claims",
                "AMC Services",
                "FAQ",
                "Track Order",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-background">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/60">
                <Phone className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>1800-123-COOL (2665)<br />Mon–Sat, 9 AM – 8 PM</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/60">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>support@coolair.in</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-background/60">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>CoolAir House, Sector 44,<br />Gurugram, Haryana 122003</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/40">
            © 2026 CoolAir. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Refund Policy"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-background/40 hover:text-background/70 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
