import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h2 className="font-heading text-2xl tracking-[0.3em] uppercase text-gold mb-4">
              Yagel
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              A signature of elegance and presence. Premium fragrances crafted
              for those who leave a lasting impression.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm tracking-[0.15em] uppercase text-foreground/80 mb-4">
              Navigate
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#collection"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm tracking-[0.15em] uppercase text-foreground/80 mb-4">
              Contact
            </h3>
            <p className="text-sm text-muted-foreground">
              For inquiries and support:
            </p>
            <a
              href="mailto:thehouseofcmj@yagelbycmj.com"
              className="text-sm text-gold mt-2 block hover:text-gold-light transition-colors"
            >
              thehouseofcmj@yagelbycmj.com
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Yagel. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/40 tracking-widest uppercase">
            Elegance &middot; Warmth &middot; Presence
          </p>
        </div>
      </div>
    </footer>
  );
}
