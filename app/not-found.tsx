'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 90, 0]
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear"
        }}
        className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-accent/20 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut"
        }}
        className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[100px] pointer-events-none"
      />

      <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-block mb-8"
        >
          <span className="font-display text-[150px] md:text-[200px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/20">
            404
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
        </motion.div>

        {/* Messaging */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto text-balance">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="rounded-full px-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 bg-background/50 backdrop-blur-sm border-border/50">
            <Link href="/contact">
              <Search className="w-4 h-4 mr-2" />
              Contact Support
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
