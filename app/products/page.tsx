'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ZoomScroll, StaggerChildren, childVariants } from '@/components/scroll-animations'
import { Card3D } from '@/components/card-3d'
import {
  Globe2,
  Brain,
  Database,
  Search,
  Bell,
  DatabaseZap,
  BarChart3,
  GitBranch,
  FileSearch,
  Workflow,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Globe2,
    title: 'Global Regulatory Intelligence',
    description:
      'Continuous monitoring of global agencies such as US FDA, EMA, CDSCO, HC, ANVISA, NMPA, TGA, and notified bodies for real-time updates.',
  },
  {
    icon: Brain,
    title: 'AI Change Detection',
    description:
      'Automatically identify regulatory changes and assess their impact on products, submissions, and processes.',
  },
  {
    icon: Database,
    title: 'Data Aggregation & Validation',
    description:
      'Collect and validate structured and unstructured global regulatory data for accuracy and compliance.',
  },
  {
    icon: Search,
    title: 'Regulatory Knowledge Repository',
    description:
      'Centralized and searchable database of global regulations, standards, and historical decisions.',
  },
  {
    icon: BarChart3,
    title: 'Decision Intelligence',
    description:
      'Advanced analytics and dashboards that support strategic regulatory decision-making.',
  },
  {
    icon: GitBranch,
    title: 'eQMS & Risk Integration',
    description:
      'Seamless integration with quality and risk systems for unified compliance and traceability.',
  },
  {
    icon: FileSearch,
    title: 'Audit Trail & Traceability',
    description:
      'End-to-end documentation ensuring inspection readiness and regulatory transparency.',
  },
  {
    icon: Activity,
    title: 'Predictive Compliance',
    description:
      'AI-driven forecasting to identify trends, risks, and future regulatory shifts.',
  },
  {
    icon: Bell,
    title: 'Custom Alerts',
    description:
      'Real-time notifications tailored to your product, market, and regulatory classification.',
  },
  {
    icon: Workflow,
    title: 'Lifecycle Alignment',
    description:
      'Embed regulatory intelligence across design, clinical, submission, and post-market stages.',
  },
  {
    icon: Layers,
    title: 'Multi-Market Compliance',
    description:
      'Manage global market strategies with region-specific insights and harmonization tools.',
  },
    {
    icon: DatabaseZap,
    title: 'Data Migration',
    description:
      'Seamlessly transition legacy and fragmented data into a unified, intelligent ecosystem with FREC-QMS AI’s advanced Data Migration capabilities',
  },
]

export default function ProductsPage() {
  return (
    <div className="relative min-h-screen">

      {/* HERO */}
      <section className="pt-40 pb-12 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-6xl md:text-7xl font-bold mb-6">
            <span className="text-accent">SITA</span>-AI
          </h1>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our proprietary FREC-QMS AI delivers advanced Regulatory Intelligence by continuously monitoring and engaging with global regulatory authorities and notified bodies. The platform proactively identifies evolving regulatory requirements, emerging risks, and compliance trends that may impact your medical devices and digital health products.
          </p>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Powered by intelligent data aggregation, validation, and analytics, FREC-QMS AI transforms complex regulatory information into actionable insights—enabling informed decision-making, faster market adaptation, and sustained compliance across jurisdictions.
          </p>

          <p className="text-lg text-muted-foreground leading-relaxed">
            By integrating Regulatory Intelligence with Quality and Risk Management systems, the platform ensures end-to-end traceability, audit readiness, and strategic alignment throughout the product lifecycle.
          </p>

        </div>
      </section>

      {/* FEATURES */}
<section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">

          <ZoomScroll>
            <div className="text-center mb-16">
              <h2 className="font-display text-5xl font-bold mb-4">
                Core Features
              </h2>
              <p className="text-lg text-muted-foreground">
                Built for modern regulatory intelligence and compliance excellence
              </p>
            </div>
          </ZoomScroll>

          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={childVariants}>
                <Card3D>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="glass-strong rounded-3xl p-8 h-full group"
                  >
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 mx-auto group-hover:bg-accent/30 transition"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="w-7 h-7 text-accent-foreground" />
                    </motion.div>

                    <h3 className="font-display text-xl font-semibold mb-2 text-center">
                      {feature.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed text-justify">
                      {feature.description}
                    </p>
                  </motion.div>
                </Card3D>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ZoomScroll>
            <motion.div className="glass-strong rounded-[3rem] p-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Request a Demo
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
  Turn compliance into confidence with a guided demo of SITA-AI.
</p>

              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </motion.div>
          </ZoomScroll>
        </div>
      </section>

    </div>
  )
}