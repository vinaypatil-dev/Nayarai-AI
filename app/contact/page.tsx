'use client'

import React, { useState, type ReactElement } from "react"
import { motion, type Variants } from 'framer-motion'
import { Parallax, ZoomScroll, FadeInView, StaggerChildren } from '@/components/scroll-animations'
import { Card3D } from '@/components/card-3d'
import { WorldClock } from '@/components/world-clock'
import {
  Mail, Phone, MapPin, Clock, Send, MessageSquare,
  Globe, Linkedin, ArrowRight, Calendar, Youtube, Facebook, Instagram
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

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

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+1', country: 'CA', flag: '🇨🇦' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+234', country: 'NG', flag: '🇳🇬' },
  { code: '+254', country: 'KE', flag: '🇰🇪' },
  { code: '+62', country: 'ID', flag: '🇮🇩' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
  { code: '+63', country: 'PH', flag: '🇵🇭' },
  { code: '+66', country: 'TH', flag: '🇹🇭' },
  { code: '+84', country: 'VN', flag: '🇻🇳' },
  { code: '+48', country: 'PL', flag: '🇵🇱' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
]
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'


const contactReasons = [
  'General Inquiry',
  'Regulatory Consultation',
  'Product Information',
  'Partnership Opportunity',
  'Career Information',
  'Media Inquiry',
]

// typed as Variants and keep original easing curve (cast to any to satisfy TS)
const childVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      // framer-motion allows a cubic-bezier array, but TS types are stricter;
      // cast to any to preserve the original curve.
      ease: [0.25, 0.46, 0.45, 0.94] as any,
    },
  },
}

function ContactPage(): ReactElement {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    countryCode: '+1',
    phone: '',
    reason: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')



  const handleBookingClick = () => {
    const bookingSection = document.getElementById('outlook-booking')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: formData.countryCode + ' ' + formData.phone,
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit form')
      }

      console.log('[v0] Form submitted:', formData)
      setSubmitMessage('Thanks — we received your message.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        countryCode: '+1',
        phone: '',
        reason: '',
        message: '',
      })

      // Hide message after a while
      setTimeout(() => setSubmitMessage(''), 5000)
    } catch (err) {
      console.error('Form submit error', err)
      setSubmitMessage('Something went wrong — please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="pt-40 pb-0 px-6 relative overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-150 h-150 rounded-full bg-accent/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 left-0 w-125 h-125 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance">
              {'Get in '}
              <span className="text-accent">
                Touch
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
              {'Ready to accelerate your regulatory journey? Let us help you navigate to success.'}
            </p>
          </motion.div>
        </div>
      </section>

            {/* World Clock Section */}
      <section className="pb-20 pt-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* <FadeInView className="text-center mb-10 md:mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-balance">
              {'Our Global Presence'}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              {'We operate across timezones — always connected with you wherever you are'}
            </p>
          </FadeInView> */}
          <WorldClock />
        </div>
      </section>

      <section id="outlook-booking" className="py-24 px-4 md:px-6 relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeInView className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-balance">
              {'Book a '}
              <span className="text-accent">{'Free Consultation'}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              {'Select a convenient date and time to discuss your regulatory needs with our trusted experts.'}
            </p>
          </FadeInView>

          {/* Booking iframe card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
            className="glass-strong rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {/* Gradient top bar */}
            <div className="h-1.5 bg-gradient-to-r from-accent via-primary to-accent" />

            <div className="p-2 md:p-4">
              <iframe
                src="https://outlook.office.com/book/NotSureWheretoStartTalktoaRegulatoryExpert1@NETORGFT20614077.onmicrosoft.com/?ismsaljsauthenabled"
                width="100%"
                height="700"
                scrolling="yes"
                style={{
                  border: 0,
                  borderRadius: '1.5rem',
                  minHeight: '600px',
                }}
                title="Book a Free Consultation with a Regulatory Expert"
                allow="payment; clipboard-write"
              />
            </div>
          </motion.div>

          {/* Fallback CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-muted-foreground text-sm mb-4">
              {'Having trouble viewing the calendar? Open it directly ↓'}
            </p>
            <a
              href="https://outlook.office.com/book/NotSureWheretoStartTalktoaRegulatoryExpert1@NETORGFT20614077.onmicrosoft.com/?ismsaljsauthenabled"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-accent-foreground font-semibold text-base shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              {'Schedule Online'}
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ZoomScroll className="h-full">
                <motion.div className="glass-strong rounded-[3rem] p-8 md:p-12 h-full flex flex-col">
                  <div className="mb-8">
                    <h2 className="font-display text-4xl font-bold mb-3">{'Send us a message'}</h2>
                    <p className="text-muted-foreground">
                      {'Fill out the form below and our team will get back to you within 24 hours'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{'Full Name'}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="glass rounded-2xl h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{'Email Address'}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                          required
                          className="glass rounded-2xl h-12"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company">{'Company'}</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Company Name"
                          className="glass rounded-2xl h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{'Phone Number'}</Label>
                        <div className="flex gap-2">
                          <select
                            id="countryCode"
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className="w-[120px] h-12 px-2 glass rounded-2xl bg-background/50 border border-input text-foreground text-sm shrink-0"
                          >
                            {countryCodes.map((cc) => (
                              <option key={`${cc.country}-${cc.code}`} value={cc.code}>
                                {cc.flag} {cc.code}
                              </option>
                            ))}
                          </select>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(555) 000-0000"
                            className="glass rounded-2xl h-12 flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">{'How can we help?'}</Label>
                      <select
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        className="w-full h-12 px-4 glass rounded-2xl bg-background/50 border border-input text-foreground"
                      >
                        <option value="">{'Select a reason'}</option>
                        {contactReasons.map((reason) => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 flex-1 flex flex-col">
                      <Label htmlFor="message">{'Message'}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your regulatory needs..."
                        required
                        className="glass rounded-2xl resize-none flex-1 min-h-[150px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-full text-base h-14 group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-2"
                          >
                            <Send className="w-5 h-5" />
                          </motion.div>
                          {'Sending...'}
                        </>
                      ) : (
                        <>
                          {'Send Message'}
                          <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              </ZoomScroll>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 flex flex-col h-full gap-6">
              <StaggerChildren className="flex flex-col gap-4 flex-1">
                {[
                  {
                    icon: FaWhatsapp,
                    title: 'Chat with us',
                    description: 'Start a conversation',
                    color: 'accent',
                    href: 'https://wa.me/917892657083',
                  },
                  {
                    icon: Mail,
                    title: 'Email us',
                    description: 'info@nayarai.com',
                    color: 'primary',
                    href: 'mailto:info@nayarai.com',
                  },
                  {
                    icon: Phone,
                    title: 'Call us',
                    description: '+91 (789) 265 7083',
                    color: 'accent',
                    href: 'tel:+917892657083',
                  },
                  {
                    icon: Calendar,
                    title: 'Book a meeting',
                    description: 'Check availability',
                    color: 'primary',
                  },
                ].map((contact, idx) => (
                  <motion.div key={idx} variants={childVariants} className="flex-1">
                    <Card3D className="h-full">
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="glass-strong rounded-3xl p-5 sm:p-6 group cursor-pointer h-full flex flex-col justify-center"
                        onClick={() => {
                          if (idx === 3) handleBookingClick()
                          else if ((contact as any).href) window.location.href = (contact as any).href
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <motion.div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                              contact.color === 'accent' ? 'bg-accent/20' : 'bg-primary/10'
                            }`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <contact.icon className={`w-6 h-6 ${
                              contact.color === 'accent' ? 'text-accent-foreground' : 'text-primary'
                            }`} />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="font-display text-xl font-bold mb-1">{contact.title}</h3>
                            <p className="text-muted-foreground text-sm">{contact.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    </Card3D>
                  </motion.div>
                ))}
              </StaggerChildren>
    <motion.div className="glass-strong rounded-3xl p-8 relative">
      <h3 className="font-display text-2xl font-bold mb-6">
        Follow Us
      </h3>

      <div className="flex flex-wrap gap-4">
        {[
          { icon: Linkedin, href: 'https://www.linkedin.com/company/nayarai/', color: 'hover:bg-[#0077b5]' },
          { icon: Youtube, href: 'https://www.youtube.com/@NAYARAi_social', color: 'hover:bg-[#ff0000]' },
          { icon: PinterestIcon, href: 'https://in.pinterest.com/NAYARAi_social/', color: 'hover:bg-[#bd081c]' },
        ].map((social, idx) => (
          <motion.a
            key={idx}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`relative z-10 cursor-pointer w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center transition-all duration-300 ${social.color} hover:text-white`}
          >
            <social.icon className="w-6 h-6" />
          </motion.a>
        ))}
      </div>
    </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage