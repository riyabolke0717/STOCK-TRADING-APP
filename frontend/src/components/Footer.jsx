import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Footer() {
  const navigate = useNavigate();
  const showInfo = (topic) => {
    const slugs = {
      'About': 'trust',
      'Pricing': 'trust',
      'Blog': 'nifty-50',
      'Careers': 'careers',
      'Safety': 'security',
      'Privacy': 'privacy',
      'Help': 'help',
      'Media': 'media'
    };

    if (slugs[topic]) {
      navigate(`/resources?type=${slugs[topic]}`);
    } else {
      toast.info(`Information about ${topic} will be available soon!`, { position: "bottom-right" });
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100 py-20 mt-auto font-inter">
      <div className="container mx-auto px-4 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          {/* Logo & Info */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Nexxtrade"
                className="h-10 w-auto object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-2xl font-black text-text-dark tracking-tighter">Nexxtrade</span>
            </Link>
            <div className="text-text-light font-bold text-sm space-y-6">
              <p className="leading-relaxed">Level 18, One BKC Tower,<br />Bandra Kurla Complex,<br />Mumbai – 400 051</p>
              <div className="flex space-x-5">
                {['Twitter', 'Facebook', 'LinkedIn', 'Instagram'].map(social => (
                  <div
                    key={social}
                    onClick={() => showInfo(social)}
                    className="w-10 h-10 rounded-xl bg-[#f8f8f9] flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all cursor-pointer group"
                  >
                    <span className="text-[8px] font-black uppercase opacity-60 group-hover:opacity-100">{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-black text-text-dark text-xs uppercase tracking-[0.2em] mb-8">Investment Products</h4>
            <ul className="text-text-light font-bold text-[13px] space-y-4">
              <li><Link to="/resources?type=stocks" className="hover:text-primary transition-all">Stocks</Link></li>
              <li><Link to="/resources?type=fo" className="hover:text-primary transition-all">Futures & Options</Link></li>
              <li><Link to="/resources?type=mf" className="hover:text-primary transition-all">Mutual Funds</Link></li>
              <li><Link to="/resources?type=us-stocks" className="hover:text-primary transition-all">US Stocks</Link></li>
              <li><Link to="/resources?type=fd" className="hover:text-primary transition-all">Fixed Deposits</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-text-dark text-xs uppercase tracking-[0.2em] mb-8">Nexxtrade</h4>
            <ul className="text-text-light font-bold text-[13px] space-y-4">
              <li><button onClick={() => showInfo('About')} className="hover:text-primary transition-all text-left">About Us</button></li>
              <li><button onClick={() => showInfo('Pricing')} className="hover:text-primary transition-all text-left">Pricing & Transparency</button></li>
              <li><button onClick={() => showInfo('Blog')} className="hover:text-primary transition-all text-left">Investment Blog</button></li>
              <li><button onClick={() => showInfo('Media')} className="hover:text-primary transition-all text-left">Media & Press</button></li>
              <li><button onClick={() => showInfo('Careers')} className="hover:text-primary transition-all text-left">Careers at Nexxtrade</button></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-black text-text-dark text-xs uppercase tracking-[0.2em] mb-8">Support Center</h4>
            <ul className="text-text-light font-bold text-[13px] space-y-4 mb-3">
              <li><button onClick={() => showInfo('Help')} className="hover:text-primary transition-all text-left">Help and Support</button></li>
              <li><button onClick={() => showInfo('Safety')} className="hover:text-primary transition-all text-left">Trust & Safety</button></li>
              <li><button onClick={() => showInfo('Privacy')} className="hover:text-primary transition-all text-left">Privacy Policy</button></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-gray-100 pt-12">
          <div className="max-w-5xl">
            <p className="text-text-light/50 font-bold text-[10px] uppercase tracking-widest leading-loose">
              Disclaimer: Nexxtrade is an educational portfolio project demonstrating MNC-level fintech UI. No real financial transactions are processed.
              Investments in securities markets are subject to market risks. Read all related documents carefully before investing.
              SEBI Registered &middot; NSE &middot; BSE &middot; AMFI &mdash; &copy; 2024-2026 Nexxtrade Financial Technologies Pvt. Ltd.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
