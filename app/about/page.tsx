'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Parallax, ZoomScroll, FadeInView, StaggerChildren, childVariants, RotateIn } from '@/components/scroll-animations'
import { Card3D } from '@/components/card-3d'
import { ArrowRight,ShieldCheck, Users2, CheckCircle2,Handshake,Shield,Crosshair,Eye,BadgeCheck,ClipboardCheck,Workflow } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Team member images (placeholders)
const getAvatarUrl = (name: string) => {
  return `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(name.split(' ')[0])}`
}

const teamMembers = [
  {
    name: 'Dr. Prathap Raja Varma',
    role: 'Founder',
    image: getAvatarUrl('Dr. Prathap Raja Varma'),
  },
      {
    name: 'Claudia Andriamananjara-Cunderlik',
    role: 'CHIEF EXECUTIVE OFFICER',
    image: getAvatarUrl('Claudia Andriamananjara-Cunderlik'),
  },
    {
    name: 'Dr. Ranjana Iyer',
    role: 'Chief Scientific Officer',
    image: getAvatarUrl('Dr. Ranjana Iyer'),
  },
    {
    name: 'Dr. Harry Reddy',
    role: 'Chief Technical Officer',
    image: getAvatarUrl('Dr. Harry Reddy'),
  },
    {
    name: 'Sagar Pimpalwar',
    role: 'Director - Regulatory Affairs',
    image: getAvatarUrl('Sagar Pimpalwar'),
  },
  {
    name: 'Sophia Boucher',
    role: 'Product Expert',
    image: getAvatarUrl('Sophia Boucher'),
  },
  {
    name: 'Nishanth',
    role: 'Marketing Strategist',
    image: getAvatarUrl('Nishanth'),
  },
  {
    name: 'Ashish Kumbhare',
    role: 'Software Engineer',
    image: getAvatarUrl('Ashish Kumbhare'),
  },

]

const values = [
  {
    icon: ShieldCheck,
    title: 'Ethics',
    description:
      'We operate with uncompromising integrity, ensuring every action aligns with regulatory standards and ethical responsibility.',
  },
  {
    icon: CheckCircle2,
    title: 'Reliability',
    description:
      'Consistent, dependable execution you can trust—delivering accurate outcomes across every stage of the regulatory journey.',
  },
  {
    icon: Handshake,
    title: 'Partnership',
    description:
      'We work as an extension of your team, building long-term relationships focused on shared success and growth.',
  },
  {
    icon: Shield,
    title: 'Responsibility',
    description:
      'We take ownership of every decision and outcome, ensuring compliance, safety, and accountability at all levels.',
  },
  {
    icon: Crosshair,
    title: 'Accuracy',
    description:
      'Precision-driven processes that minimize risk and ensure every submission meets the highest regulatory expectations.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description:
      'Clear communication and complete visibility across processes, enabling informed and confident decision-making.',
  },
  {
    icon: BadgeCheck,
    title: 'Honesty',
    description:
      'We provide straightforward guidance grounded in facts, prioritizing long-term trust over short-term convenience.',
  },
  {
    icon: ClipboardCheck,
    title: 'Accountability',
    description:
      'Measured outcomes, clear ownership, and a commitment to delivering results you can rely on.',
  },
  {
    icon: Workflow,
    title: 'Process Excellence',
    description:
      'Structured, optimized workflows designed to enhance efficiency, reduce delays, and ensure regulatory success.',
  },
]

const certifications = ['FDA', 'EMA', 'ISO 13485', 'PMDA', 'Health Canada', 'TGA']


const getInitials = (name: string) => {
  const honorifics = ['dr.', 'mr.', 'mrs.', 'ms.', 'prof.']
  const parts = name
    .trim()
    .split(' ')
    .filter(p => !honorifics.includes(p.toLowerCase()))

  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function AboutPage() {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null)

  return (
    <div className="relative min-h-screen">

      {/* Hero Section */}
      <section className="pt-40 pb-12 px-6 relative overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance">
              
              <span className="text-accent">{'NAYA'}</span>{'RAi'}<sup>&trade;</sup>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
              {'Pioneering healthcare regulatory excellence'}
            </p>
          </motion.div>

<ZoomScroll>
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.96 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="glass-strong rounded-[3rem] p-10 md:p-14 max-w-5xl mx-auto relative overflow-hidden"
  >

    {/* Glow effect — top right */}
    <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent/20 blur-3xl rounded-full pointer-events-none" />

    {/* Glow effect — bottom left */}
    <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-accent/20 blur-3xl rounded-full pointer-events-none" />

    {/* Heading */}
    <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-center uppercase">
      Vision
    </h2>

    {/* Text */}
    <p className="text-lg md:text-xl leading-relaxed text-muted-foreground font-bold text-center">
      To bridge gaps in global regulatory landscapes with regulatory intelligence and provide dexterity to industry leaders with expert regulatory solutions for product marketization.
    </p>

  </motion.div>
</ZoomScroll>
        </div>
      </section>

      {/* Values Section */}
<section className="py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInView className="text-center mb-20">
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance">
              {'Our Core Values'}
            </h2>
            {/* <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              While our <b>ETHICS</b> are imbibed and imprinted onto <b>NAYARAi™'s</b> core business model, we acknowledge and hold
            </p> */}
          </FadeInView>

          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, idx) => (
              <motion.div key={idx} variants={childVariants}>
                <Card3D>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="glass-strong rounded-3xl p-8 h-full"
                  >
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 mx-auto"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <value.icon className="w-7 h-7 text-accent-foreground" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold mb-3 text-center">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-justify">{value.description}</p>
                  </motion.div>
                </Card3D>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Story Section */}
      {/* <section className="py-32 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Parallax offset={50}>
              <div>
                <h2 className="font-display text-5xl md:text-6xl font-bold mb-8 text-balance">
                  {'Our Story'}
                </h2>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    {'NAYARAi™ was born on 2025 in Tucson, Arizona, USA, by a team of industry veterans from a simple observation: brilliant healthcare innovations were being delayed or denied not because of scientific merit, but due to navigational challenges in the regulatory process that is ever changing and evolving in Real-Time.'}
                  </p>
                </div>
              </div>
            </Parallax>

            <Parallax offset={-50}>
              <RotateIn>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { number: '98%', label: 'Approval Rate' },
                    { number: '25+', label: 'Countries' },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="glass-strong rounded-3xl p-8 text-center"
                    >
                      <div className="font-display text-4xl md:text-5xl font-bold text-accent mb-2">
                        {stat.number}
                      </div>
                      <div className="text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </RotateIn>
            </Parallax>
          </div>
        </div>
      </section> */}

{/* <section className="py-32 px-6">
  <div className="max-w-[1600px] mx-auto">
    <FadeInView className="text-center mb-20">
      <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance">
        {'Our Team'}
      </h2>
    </FadeInView>

    <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {teamMembers.map((member, idx) => (
        <motion.div
          key={idx}
          variants={childVariants}
          onMouseEnter={() => setHoveredMember(member.name)}
          onMouseLeave={() => setHoveredMember(null)}
          whileHover={{ y: -6 }}
          className="glass-strong rounded-2xl p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent rounded-2xl pointer-events-none"
            animate={{ opacity: hoveredMember === member.name ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
<motion.div
  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border-2 border-border shadow-md bg-gradient-to-br from-primary/20 via-accent/20 to-accent/10"
  animate={{
    borderColor: hoveredMember === member.name
      ? 'rgba(250, 204, 21, 0.6)'
      : 'rgba(var(--border), 1)',
  }}
  transition={{ duration: 0.3 }}
>
  <span className="font-display text-2xl font-bold text-accent">
    {getInitials(member.name)}
  </span>
</motion.div>

          <h4 className="font-display text-base font-bold mb-1 leading-tight">
            {member.name}
          </h4>
          <p className="text-xs text-accent font-semibold tracking-wide uppercase">
            {member.role}
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={hoveredMember === member.name ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-accent/0 via-accent to-accent/0 origin-center"
          />
        </motion.div>
      ))}
    </StaggerChildren>
  </div>
</section> */}



      {/* Founder Profile Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInView className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong text-sm font-medium mb-6 text-accent border border-accent/20">
              Meet the Founder
            </span>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-balance">
              Leadership &amp; Expertise
            </h2>
          </FadeInView>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong rounded-[3rem] p-8 md:p-12 lg:p-16 relative overflow-hidden"
          >
            {/* Card glows */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent/15 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-5 gap-12 items-start">

              {/* Left — Identity */}
              <div className="lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Avatar */}
<motion.div
  whileHover={{ scale: 1.05 }}
  className="relative mb-6 flex justify-center"
>
  {/* Outer Ring */}
<div className="w-36 h-36 rounded-full p-[3px] bg-gradient-to-br from-primary/40 via-accent/40 to-accent/10 shadow-2xl">
  
  {/* Inner Circle */}
  <div className="w-full h-full rounded-full overflow-hidden bg-background flex items-center justify-center">
    <Image
    width={400}
    height={400}
      src="/pp.png"
      alt="Prathap"
      className="w-full h-full object-cover"
    />
  </div>

</div>

  {/* Animated Ring */}
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
    className="absolute -inset-2 rounded-full border border-dashed border-accent/30 pointer-events-none"
  />
</motion.div>
                {/* Role badges */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/20 uppercase tracking-wider">
                    Founder
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                    Regulatory Affairs Specialist
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-3 leading-tight">
                 Prathap Raja Varma
                </h3>

                {/* Domains */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
                  {['PharmD', 'MS Regulatory Affairs'].map((tag) => (
                    <span key={tag} className="px-4 py-1.5 rounded-full text-sm font-medium glass border border-border/40 text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* About */}
                <div>
                  <h4 className="font-display text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">About</h4>
                  <div className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify space-y-4">
                    <p>Prathap is a rare confluence of clinical pharmacologist, safety scientist, and regulatory architect — a professional whose career has been shaped at the sharpest edge of global healthcare innovation. With a Doctor of Pharmacy and a Master of Science in Regulatory Affairs, he brings a depth of scientific and regulatory literacy that few in the industry can match.</p>
                    <p>Born from a decade of frontline clinical experience and high-stakes regulatory practice across the United States, European Union, and India, Prathap founded NAYARAi™ with a singular conviction: that world-class regulatory intelligence should be accessible, strategic, and powered by the science behind it. He has personally orchestrated some of the most technically demanding regulatory pathways in existence — including Class III PMA submissions, EU MDR 2017/745 CE Marking, and global commercialization strategy across six regulatory jurisdictions.</p>
                    <p>At NAYARAi™, Prathap is not simply a consultant — he is your strategic partner, your regulatory conscience, and your most powerful advocate before the world's most demanding authorities.</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-accent/30 via-border/50 to-transparent" />

                {/* Specialties */}
                <div>
                  <h4 className="font-display text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Areas of Expertise</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Clinical Pharmacologist',
                        desc: "Prathap's clinical roots run deep — from individualizing complex oncology regimens and leading clinical pharmacology departments at premier cancer centers, to authoring Investigator Brochures and providing real-time clinical decision support. He has managed over 2,500+ patients across chemotherapy, immunotherapy, biologics, and injectables, bridging the critical gap between bench science and regulatory dossier.",
                      },
                      {
                        title: 'Post-Market Surveillance & Safety Scientist',
                        desc: 'With a career defined by vigilance, Prathap has authored Safety Monitoring Plans, overseen MDRs, managed PMCF plans, and led safety surveillance programs for Class II and Class III medical devices. His command of adverse event frameworks — across both pharma and medical device sectors — makes him an unmatched asset for PMS strategy and compliance.',
                      },
                      {
                        title: 'Medical Device Regulatory Expert',
                        desc: 'From 510(k) and De Novo to the most rigorous PMA and PMA Supplement pathways, Prathap has delivered regulatory approvals for some of the most advanced implantable and life-sustaining medical devices in the world. His expertise spans design control, risk management (ISO 14971), GSPR authoring, EUDAMED registration, and full EU MDR 2017/745 technical file strategy.',
                      },
                      {
                        title: 'Software as a Medical Device (SaMD)',
                        desc: 'A forward-thinking regulatory expert with hands-on SaMD experience, Prathap has led 510(k) Exempt strategy and full regulatory compliance planning for digital health applications — developing traceability matrices, URS documentation, and SOPs to navigate the unique demands of AI and software-driven device regulation under FDA and IMDRF frameworks.',
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        whileHover={{ y: -4 }}
                        className="glass rounded-2xl p-5 border border-border/30 hover:border-accent/30 transition-colors group"
                      >
                        <h5 className="font-display font-bold text-sm mb-2 leading-snug">{item.title}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed text-justify">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-accent/30 via-border/50 to-transparent" />

                {/* Frameworks & Competencies */}
                <div>
                  <h4 className="font-display text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">Frameworks &amp; Regulations</h4>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {'21 CFR 800s | 21 CFR 200s | EU MDR 2017/745 | FDA QMSR | CDSCO | Health Canada | SFDA | ICH | IMDRF | MDCG | ISO 14971 | ISO 13485 | ISO 10993'.split(' | ').map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium glass border border-border/40 text-muted-foreground">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <h4 className="font-display text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">Core Competencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {'Regulatory Strategy | Risk Management | PMS & Vigilance | CAPA Management | Recall Strategy | CTD/eCTD Submissions | IND | NDA/ANDA | BLA | 510(k) | PMA | De Novo | Design Control | cGMP / cGCP / cGLP | Ad Promo | Compliance'.split(' | ').map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium glass border border-border/40 text-muted-foreground">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <ZoomScroll>
            <motion.div className="glass-strong rounded-[3rem] p-12 md:p-16">
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance">
                {'Join Our Journey'}
              </h2>
              <p className="text-xl text-muted-foreground mb-10 text-balance">
                {'Discover how we can accelerate your regulatory success'}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full text-base px-8 w-full sm:w-auto" asChild>
                  <Link href="/contact">
                    {'Get in Touch'}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full text-base px-8 glass w-full sm:w-auto bg-transparent" asChild>
                  <Link href="/careers">
                    {'View Careers'}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </ZoomScroll>
        </div>
      </section>
    </div>
  )
}
