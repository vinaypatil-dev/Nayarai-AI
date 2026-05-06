'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ZoomScroll, FadeInView, StaggerChildren, childVariants } from '@/components/scroll-animations'
import { Card3D } from '@/components/card-3d'
import RegulatoryWorldMap from '@/components/regulatory-world-map'
import { ArrowRight, Shield, TrendingUp, CheckCircle2, Sparkles, Globe, Award,ShieldCheck,FileText,  Building2,ClipboardCheck,AlertTriangle,Megaphone, Globe2, Target, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import WhyChoose from '@/components/why'

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

  return (
    <div ref={containerRef} className="relative min-h-screen mt-24">
      
      {/* Hero Section */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-10 flex items-center justify-center overflow-hidden px-6"
      >
        {/* Animated 3D Background Grid */}

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-accent" />
                  {'Accordance. Approvals.'}
                </span>
              </motion.div>
              

              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[0.95]"
              >
                 <span className="text-accent">{'Navigate'}</span><br />
                {'Regulations'}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-xl text-muted-foreground mb-8 leading-relaxed"
              >
                {'Transform regulatory challenges into market opportunities with expert guidance. We accelerate product approvals across global markets.'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 mb-12"
              >
                <Button size="lg" className="rounded-full text-base px-8 group" asChild>
                  <Link href="/contact">
                    {'Get Started'}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full text-base px-8 glass bg-transparent" asChild>
                  <Link href="/services">
                    {'Explore Services'}
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right Visual Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[600px]">
                {/* Floating Icons */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [-2, 2, -2],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                  }}
                  className="absolute top-[15%] right-[20%] drop-shadow-2xl z-20"
                >
                  <Image src="/medicine.png" alt="Medicine icon" width={110} height={110} className="object-contain dark:invert dark:brightness-0" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 20, 0],
                    rotate: [2, -2, 2],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute top-[20%] left-[20%] drop-shadow-2xl z-20"
                >
                  <Image src="/ct-scan.png" alt="CT Scan icon" width={130} height={130} className="object-contain dark:invert dark:brightness-0" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotate: [-1, 1, -1],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute bottom-[20%] left-[25%] drop-shadow-2xl z-20"
                >
                  <Image src="/stethoscope.png" alt="Stethoscope icon" width={120} height={120} className="object-contain dark:invert dark:brightness-0" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 15, 0],
                    rotate: [1, -1, 1],
                  }}
                  transition={{
                    duration: 6.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                  className="absolute bottom-[15%] right-[25%] drop-shadow-2xl z-20"
                >
                  <Image src="/vaccine.png" alt="Vaccine icon" width={100} height={100} className="object-contain dark:invert dark:brightness-0" />
                </motion.div>

                {/* Central Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

            {/* Global Regulatory Network Section */}
      {/* <section className="py-32 px-6 bg-secondary/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <FadeInView className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance">
              {'Global Regulatory Network'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              {'Click on any marker to explore regulatory bodies worldwide'}
            </p>
          </FadeInView>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <RegulatoryWorldMap />
          </motion.div>

          <FadeInView className="text-center mt-12">
            <p className="text-muted-foreground max-w-3xl mx-auto">
              {'We maintain active relationships with regulatory authorities across major markets, ensuring your products meet local requirements and achieve faster approvals.'}
            </p>
          </FadeInView>
        </div>
      </section> */}

      {/* Services Preview Section */}
<section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <ZoomScroll>
            <div className="text-center mb-20">
              <FadeInView>
                <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance">
                  {'Comprehensive Regulatory Services'}
                </h2>
              </FadeInView>
            </div>
          </ZoomScroll>

          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
  {
    icon: ShieldCheck,
    title: 'Regulatory Strategy',
    description: 'We define clear, market-specific regulatory pathways that accelerate approvals while ensuring full compliance across regions.',
    color: 'accent'
  },
  {
    icon: FileText,
    title: 'Submission Management',
    description: 'End-to-end preparation, compilation, and lifecycle management of global regulatory submissions with precision.',
    color: 'primary'
  },
  {
    icon: Building2,
    title: 'Competent Authority Liaison',
    description: 'Seamless coordination and communication with regulatory bodies and notified authorities to streamline approvals.',
    color: 'accent'
  },
  {
    icon: ClipboardCheck,
    title: 'Audit Readiness',
    description: 'Maintain inspection ready documentation and systems that ensure confident audits.',
    color: 'primary'
  },
  {
    icon: AlertTriangle,
    title: 'Recall Mitigation',
    description: 'Identify early risk signals and implement CAPA-driven strategies to prevent recalls before they occur.',
    color: 'accent'
  },
  {
    icon: Megaphone,
    title: 'AdPromo Compliance',
    description: 'Ensure all promotional claims are accurate, compliant, and aligned with global regulatory standards.',
    color: 'primary'
  },
].map((service, idx) => (
              <motion.div key={idx} variants={childVariants} className="h-full">
                <Card3D className="h-full">
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="glass-strong rounded-3xl p-8 h-full group cursor-pointer"
                  >
                    <motion.div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto ${
                        service.color === 'accent' ? 'bg-accent/20' : 'bg-primary/10'
                      }`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <service.icon className={`w-7 h-7 ${
                        service.color === 'accent' ? 'text-accent-foreground' : 'text-primary'
                      }`} />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold mb-3 text-center">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-justify">{service.description}</p>
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      className="mt-6 flex items-center justify-center text-sm font-medium"
                    >
                      {'Learn more'}
                    </motion.div>
                  </motion.div>
                </Card3D>
              </motion.div>
            ))}
          </StaggerChildren>

          <FadeInView className="text-center mt-16">
            <Button size="lg" variant="outline" className="rounded-full glass bg-transparent" asChild>
              <Link href="/services">
                {'View All Services'}
              </Link>
            </Button>
          </FadeInView>
        </div>
      </section>

      {/* Why Choose Us Bento Grid */}
<WhyChoose/>


      {/* Stats Carousel Section */}
      {/* <section className="py-20 md:py-32 px-4 md:px-6 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear"
            }}
            className="absolute top-20 left-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-accent/10 blur-3xl"
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeInView className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-balance">
              {'Why Companies Trust NAYARAi™'}
            </h2>
          </FadeInView>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
               { icon: Globe, stat: '25+', label: 'Global Markets', color: 'from-primary to-accent' },
              { icon: CheckCircle2, stat: '98%', label: 'First-Time Success Rate', color: 'from-primary to-accent' },
              { icon: Award, stat: '25+', label: 'Years Experience', color: 'from-accent to-primary' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="glass-strong rounded-2xl md:rounded-3xl p-8 md:p-10 text-center group"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4 + idx * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                  }}
                  className={`w-16 md:w-20 h-16 md:h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl transition-shadow`}
                >
                  <item.icon className="w-8 md:w-10 h-8 md:h-10 text-white" />
                </motion.div>
                <motion.h3 className="font-display text-4xl md:text-5xl font-bold mb-2">
                  {item.stat}
                </motion.h3>
                <p className="text-muted-foreground text-sm md:text-base">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      {/* <section className="py-20 md:py-32 px-4 md:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <FadeInView className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-balance">
              {'Trusted by Industry Leaders'}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              {'See what our clients have to say'}
            </p>
          </FadeInView>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { quote: 'NAYARAi™ reduced our regulatory timeline by 9 months. Exceptional expertise!', author: 'CEO, MedTech Innovations', company: 'Medical Devices' },
              { quote: 'The clinical consulting team provided invaluable guidance through FDA approval.', author: 'VP Regulatory, BioHealth Inc', company: 'Pharmaceuticals' },
              { quote: 'Best decision for our global market expansion strategy. Highly recommended!', author: 'COO, Digital Health Labs', company: 'Digital Health' },
              { quote: 'Their quality management systems implementation was seamless and thorough.', author: 'Head of QA, DeviceCorp', company: 'Medical Devices' },
              { quote: 'Expert guidance on breakthrough device designation accelerated our launch.', author: 'Founder, InnovateLabs', company: 'Innovative Tech' },
              { quote: 'Outstanding support throughout our entire regulatory journey. True partners!', author: 'Director, Global Affairs', company: 'PharmaDynamics' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="glass-strong rounded-2xl md:rounded-3xl p-6 md:p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} initial={{ scale: 0, rotate: -180 }} whileInView={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                      <Star className="w-4 md:w-5 h-4 md:h-5 fill-accent text-accent" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm md:text-base text-foreground mb-6 italic">"{item.quote}"</p>
                <div className="border-t border-border/50 pt-4">
                  <p className="font-display font-bold text-sm md:text-base">{item.author}</p>
                  <p className="text-xs md:text-sm text-accent font-medium">{item.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-12 px-4 md:px-6 relative overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear"
          }}
          className="absolute -top-20 md:-top-40 -right-20 md:-right-40 w-64 md:w-96 h-64 md:h-96 rounded-full bg-accent/10 blur-3xl"
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ZoomScroll>
            <motion.div className="glass-strong rounded-2xl md:rounded-[3rem] p-8 md:p-12 lg:p-16">
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-balance">
                {'Ready to Navigate Regulatory Success?'}
              </h2>
              <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-10 text-balance">
                {'Let our experts guide your product through the regulatory landscape'}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                <Button size="lg" className="rounded-full text-sm md:text-base px-6 md:px-8 w-full sm:w-auto" asChild>
                  <Link href="/contact">
                    {'Schedule Consultation'}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full text-sm md:text-base px-6 md:px-8 glass w-full sm:w-auto bg-transparent" asChild>
                  <Link href="/about">
                    {'Learn More'}
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
