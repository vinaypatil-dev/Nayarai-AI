'use client'

import React from "react"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface JobApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  jobRole: string
  jobId: string
}

export function JobApplicationModal({ isOpen, onClose, jobRole, jobId }: JobApplicationModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    resume: null as File | null,
    coverLetter: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('fullName', formData.fullName)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('coverLetter', formData.coverLetter)
      formDataToSend.append('jobRole', jobRole)
      formDataToSend.append('jobId', jobId)
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume)
      }

      const res = await fetch('/api/apply', {
        method: 'POST',
        body: formDataToSend
      })

      if (!res.ok) {
        throw new Error('Failed to submit application')
      }

      setSubmitted(true)
    } catch (error) {
      console.error(error)
      alert("Failed to submit application. Please try again.")
    } finally {
      setIsLoading(false)
    }
    
    // Reset after 3 seconds on success
    if (submitted || true) {
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ fullName: '', email: '', phone: '', resume: null, coverLetter: '' })
        onClose()
      }, 3000)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <motion.div className="glass-strong rounded-2xl md:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 flex items-center justify-between p-6 md:p-8 border-b border-border/50 bg-glass">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold">Apply Now</h2>
                  <p className="text-sm md:text-base text-accent font-medium mt-1">{jobRole}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle2 className="w-8 h-8 text-accent" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold mb-2">Application Submitted!</h3>
                    <p className="text-muted-foreground">We'll review your application and get back to you soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                        placeholder="Your full name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Resume (PDF or DOC)</label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          required
                          className="hidden"
                          id="resume-upload"
                        />
                        <label
                          htmlFor="resume-upload"
                          className="block w-full px-4 py-6 border-2 border-dashed border-accent/30 rounded-lg cursor-pointer hover:border-accent/50 transition-colors text-center glass"
                        >
                          <Upload className="w-6 h-6 text-accent mx-auto mb-2" />
                          <p className="text-sm font-medium">
                            {formData.resume ? formData.resume.name : 'Click to upload resume'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
                        </label>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Cover Letter</label>
                      <textarea
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
                        placeholder="Tell us why you're a great fit for this role..."
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                      className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isLoading ? 'Submitting...' : 'Submit Application'}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
