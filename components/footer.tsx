'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Phone, MapPin, Linkedin, Facebook, Youtube, Instagram } from 'lucide-react'

// Custom X (formerly Twitter) icon
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
  </svg>
)
import Image from 'next/image'

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    // { name: 'Products', href: '/products' },
    { name: 'Resources', href: '/resources' },
    {name: 'Careers', href: '/careers'},
    {name: 'Contact', href: '/contact'}
  ],
  services: [
    { name: 'Regulatory Intelligence & Strategy', href: '/services' },
    { name: 'Submission Management', href: '/services' },
    { name: 'Risk Management System', href: '/services' },
    { name: 'Quality Management System', href: '/services' },
    { name: 'Clinical Trial Management', href: '/services' },
    { name: 'Post Market Compliance', href: '/services' },
    { name: 'Labeling & AdPromo', href: '/services' },
    { name: 'Regulatory Liaison', href: '/services' },
     { name: 'Project Management', href: '/services' },
  ],
  support: [
    { name: 'Labelling & Artwork', href: '/services#labelling' },
    { name: 'eCTD & Publishing', href: '/services#ectd' },
    { name: 'Post Approval', href: '/services#post-approval' },
    { name: 'License & Certification', href: '/services#license' },
  ]
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="relative px-6 py-14">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.16, 0.06] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-8">
            {/* Brand */}
            <div className="lg:col-span-2">
<Link
  href="/"
  aria-label="NAYARAi™ home"
  className="inline-flex items-center gap-3 group"
>
  {/* Logo */}
  <Image
    width={100}
    height={100}
    src="/logo-1.png"
    alt="NAYARAi™ Logo"
    className="h-16 w-auto group-hover:scale-105 transition-transform dark-invert"
  />

  {/* Text */}
  <span className="font-display text-[40px] font-bold leading-none inline-flex items-baseline">
    <span className="text-accent group-hover:translate-x-0.5 transition-transform">
      NAYA
    </span>
    <span className="group-hover:opacity-80 transition-opacity">
      RAi<sup>&trade;</sup>
    </span>
  </span>
</Link>

              <p className="text-2xl text-accent/90 mt-2 font-medium">
              Accordance. Approvals. 
              </p>

              <p className="text-muted-foreground mt-1 mb-6 leading-relaxed max-w-sm">
                a regulatory company
              </p>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-display font-bold text-[14px] mb-4">QUICK LINKS</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, idx) => (
                  <motion.li key={idx} whileHover={{ x: 4 }}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
{/* Services */}
<div>
  <h3 className="font-display font-bold text-[14px] mb-4">
    SERVICES
  </h3>

  <ul className="grid grid-cols-1  gap-y-3">
    {footerLinks.services.map((link, idx) => (
      <motion.li key={idx} whileHover={{ x: 4 }}>
        <Link
          href={link.href}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          {link.name}
        </Link>
      </motion.li>
    ))}
  </ul>
</div>
<div>
  <h3 className="font-display font-bold text-[14px] mb-4">
    CONTACT
  </h3>

                <address className="not-italic space-y-3 mb-6">
                <motion.a
                  href="mailto:info@nayarai.com"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  info@nayarai.com
                </motion.a>

                <motion.a
                  href="tel:+917892657083"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                 +91 (789) 265 7083
                </motion.a>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  Bangalore, Karnataka, INDIA
                </div>
              </address>

              {/* ── Social icons: 2 rows × 3 columns ── */}
              <div className="grid lg:grid-cols-3 gap-2 grid-cols-6">
                {[
                  { icon: Linkedin, href: 'https://www.linkedin.com/company/nayarai/' },
                  { icon: Youtube, href: 'https://www.youtube.com/@NAYARAi_social' },
                  { icon: PinterestIcon, href: 'https://in.pinterest.com/NAYARAi_social/' },
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-background border border-border/40 hover:bg-accent/10 transition-all"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
</div>
          </div>

          {/* Bottom */}
          <div className="pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} NAYARAi<sup>&trade;</sup>. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:gap-6 text-sm text-muted-foreground">
              {[
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms-of-service' },
                { name: 'Cookie Policy', href: '/cookie' },
                { name: 'Legal Notice', href: '/legal' },
              ].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  whileHover={{ y: -2 }}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quantech credit — own centered row */}
          <div className="pt-6 flex justify-center hidden sr-only">
            <motion.p
              className="text-xs text-muted-foreground flex items-center gap-1.5"
              whileHover={{ scale: 1.02 }}
            >
              Website powered by{' '}
              <a
                href="https://www.quantech.pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground/80 hover:text-accent transition-colors underline underline-offset-2 decoration-accent/40 hover:decoration-accent"
              >
                Quantech
              </a>
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer