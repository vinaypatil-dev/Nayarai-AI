'use client'

import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
export function FloatingEnquiryButton() {
  const phoneNumber = '917892657083' // without +
  const message = encodeURIComponent('Hi, I would like to know more about your services.')
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-2xl flex items-center justify-center group"
    >
      {/* Pulse Animation */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-[#25D366] rounded-full opacity-40"
      />

      <FaWhatsapp className="h-7 w-7 relative z-10" />

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-full mr-4 bg-black text-white px-4 py-2 rounded-lg whitespace-nowrap shadow-lg pointer-events-none"
      >
        Chat on WhatsApp
      </motion.div>
    </motion.a>
  )
}
