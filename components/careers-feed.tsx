'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FadeInView, StaggerChildren, childVariants, ZoomScroll } from '@/components/scroll-animations'
import { Card3D } from '@/components/card-3d'
import { JobApplicationModal } from '@/components/job-application-modal'
import {
  Briefcase, MapPin, Clock, Heart, Users, TrendingUp,
  Globe, GraduationCap, Coffee, ChevronDown, Sparkles, Code2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useMemo } from 'react'
import { Job } from '@/lib/types/contentful'

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive medical, dental, and vision insurance plus wellness programs',
    color: 'accent',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Clear advancement paths with mentorship and professional development opportunities',
    color: 'primary',
  },
  {
    icon: Globe,
    title: 'Remote Flexibility',
    description: 'Hybrid and remote work options to support your lifestyle and productivity',
    color: 'accent',
  },
  {
    icon: Coffee,
    title: 'Work-Life Balance',
    description: 'Generous PTO, flexible hours, and company-wide wellness days',
    color: 'primary',
  },
  {
    icon: GraduationCap,
    title: 'Learning Budget',
    description: 'Annual allowance for courses, conferences, and certifications',
    color: 'accent',
  },
  {
    icon: Users,
    title: 'Collaborative Culture',
    description: 'Work with passionate experts in a supportive, inclusive environment',
    color: 'primary',
  },
]

// ─── Job Description Renderer ─────────────────────────────────────────────────

function JobDescriptionRenderer({ content }: { content: string }) {
  // The jobDescription from Contentful comes as plain text with "- " bullets and newlines.
  const lines = content.split('\n').filter(l => l.trim().length > 0)

  return (
    <ul className="space-y-3">
      {lines.map((line, i) => {
        const text = line.replace(/^-\s*/, '').trim()
        return (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex items-start gap-3"
          >
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
          </motion.li>
        )
      })}
    </ul>
  )
}

// ─── Job Accordion Card ────────────────────────────────────────────────────────

function JobAccordionCard({
  job,
  isExpanded,
  onToggle,
  onApply,
  index,
}: {
  job: Job
  isExpanded: boolean
  onToggle: () => void
  onApply: () => void
  index: number
}) {
  const skills = job.skills || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass-strong rounded-3xl overflow-hidden border border-border/30 relative group"
    >
      {/* Accent top bar */}
      <div
        className="h-1 w-full"
        style={{
          background: 'linear-gradient(90deg, oklch(0.75 0.15 85), oklch(0.82 0.18 90), oklch(0.75 0.15 85))',
        }}
      />

      {/* Hover glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/5 blur-3xl rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6 md:p-8">
        {/* ─── Summary Row (always visible) ─── */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          {/* Left: Role info */}
          <div className="flex-1 min-w-0">
            {/* Title + Job ID */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-xl md:text-2xl font-bold leading-tight group-hover:text-accent transition-colors">
                  {job.title}
                </h3>
                <span className="text-xs text-muted-foreground">ID: {job.jobId}</span>
              </div>
            </div>

            {/* Short description */}
            {job.shortDescription && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 lg:mb-0 line-clamp-2">
                {job.shortDescription}
              </p>
            )}
          </div>

          {/* Right: Meta badges + Apply */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Location */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass border border-border/40">
                <MapPin className="w-3 h-3 text-accent" />
                {job.jobLocation || 'Remote'}
              </span>
              {/* Job Type */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass border border-border/40">
                <Clock className="w-3 h-3 text-accent" />
                {job.jobType}
              </span>
            </div>

            {/* Apply button */}
            <Button
              onClick={(e) => { e.stopPropagation(); onApply() }}
              className="rounded-full text-sm px-6"
            >
              Apply Now
            </Button>
          </div>
        </div>

        {/* Skills tags */}
        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-muted-foreground mr-1" />
            {skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
                style={{
                  background: 'oklch(0.75 0.15 85 / 0.08)',
                  borderColor: 'oklch(0.75 0.15 85 / 0.2)',
                  color: 'oklch(0.45 0.12 80)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* ─── View Details Toggle ─── */}
        <button
          onClick={onToggle}
          className="mt-5 flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors group/btn"
        >
          <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        {/* ─── Expanded Details (Accordion Body) ─── */}
        <AnimatePresence>
          {isExpanded && job.jobDescription && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-5 mt-5 border-t border-border/30">
                <h4 className="font-display text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">
                  Job Description
                </h4>
                <JobDescriptionRenderer content={job.jobDescription} />

                {/* Bottom apply bar */}
                <div className="mt-6 flex items-center justify-between pt-5 border-t border-border/20">
                  <p className="text-xs text-muted-foreground">
                    Ready to make an impact? We&apos;d love to hear from you.
                  </p>
                  <Button
                    onClick={(e) => { e.stopPropagation(); onApply() }}
                    variant="outline"
                    className="rounded-full text-sm"
                  >
                    Apply for this role
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function CareersFeed({ jobs }: { jobs: Job[] }) {
  const [activeDepartment, setActiveDepartment] = useState('all')
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<{ id: string; role: string } | null>(null)

  const departments = useMemo(() => {
    const list = ['all', ...new Set(jobs.map(j => j.jobType || 'Other'))]
    return list.map(dept => ({
      id: dept,
      name: dept === 'all' ? 'All Positions' : dept
    }))
  }, [jobs])

  const filteredPositions = activeDepartment === 'all'
    ? jobs
    : jobs.filter(p => p.jobType === activeDepartment)

  const handleApplyNow = (position: Job) => {
    setSelectedJob({ id: position.jobId, role: position.title })
    setIsModalOpen(true)
  }

  const toggleExpand = (jobId: string) => {
    setExpandedJobId(prev => (prev === jobId ? null : jobId))
  }

  return (
    <div className="relative min-h-screen">
      {/* Benefits Section */}
      <section className="py-20 pt-40 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <FadeInView className="text-center mb-20">
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance">
              Join Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              We invest in our people because they are our greatest asset, a team of passionate experts shaping the future of healthcare regulation.
            </p>
          </FadeInView>

<StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {benefits.map((benefit, idx) => (
    <motion.div key={idx} variants={childVariants}>
      <Card3D>
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="glass-strong rounded-3xl p-8 h-full flex flex-col items-center text-center"
        >

          {/* ICON */}
          <motion.div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
              benefit.color === 'accent' ? 'bg-accent/20' : 'bg-primary/10'
            }`}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <benefit.icon
              className={`w-7 h-7 ${
                benefit.color === 'accent' ? 'text-accent-foreground' : 'text-primary'
              }`}
            />
          </motion.div>

          {/* HEADING */}
          <h3 className="font-display text-2xl font-bold mb-3 text-center">
            {benefit.title}
          </h3>

          {/* PARAGRAPH */}
          <p className="text-muted-foreground leading-relaxed text-justify">
            {benefit.description}
          </p>

        </motion.div>
      </Card3D>
    </motion.div>
  ))}
</StaggerChildren>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <ZoomScroll>
            <div className="text-center mb-20">
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance">
                Open Positions
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                Find your next opportunity to make an impact
              </p>
            </div>
          </ZoomScroll>

          {/* Department Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-12"
          >
            <div className="glass-strong rounded-[2rem] p-2 flex flex-wrap justify-center gap-2 max-w-full">
              {departments.map((dept) => (
                <motion.button
                  key={dept.id}
                  onClick={() => setActiveDepartment(dept.id)}
                  className={`relative px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    activeDepartment === dept.id ? 'text-primary-foreground' : 'text-foreground'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeDepartment === dept.id && (
                    <motion.div
                      layoutId="dept-pill"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{dept.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Positions Accordion List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDepartment}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {filteredPositions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 glass-strong rounded-3xl"
                >
                  <Briefcase className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No open positions in this category right now.</p>
                  <p className="text-xs text-muted-foreground mt-1">Check back soon or explore other categories.</p>
                </motion.div>
              )}

              {filteredPositions.map((position, idx) => (
                <JobAccordionCard
                  key={`${activeDepartment}-${position.jobId}`}
                  job={position}
                  isExpanded={expandedJobId === position.jobId}
                  onToggle={() => toggleExpand(position.jobId)}
                  onApply={() => handleApplyNow(position)}
                  index={idx}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobRole={selectedJob?.role || ''}
        jobId={selectedJob?.id || ''}
      />
    </div>
  )
}
