'use client'

import { motion } from 'framer-motion'
import { Globe2, Target, Layers } from 'lucide-react'

export default function WhyChoose() {
  return (
    <section className="py-20 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Why Choose <span className='text-accent'>NAYA</span>RAi<sup>&trade;</sup>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
            Regulatory excellence. Delivered with certainty.
          </p>
        </div>


        {/* Content Block */}
<div className="mt-24 max-w-5xl mx-auto">

  {/* Highlight line */}
  <p className="text-2xl md:text-3xl font-semibold text-foreground leading-snug mb-8">
    Compliance is a competitive advantage.
  </p>

  {/* Content */}
  <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
    
    <p className='text-justify'>
      We partner with forward-thinking manufacturers who understand that compliance is not a checkbox, but a strategic advantage. With deep expertise across regulatory affairs, quality systems, clinical data, and risk management, we go beyond traditional consulting, bringing clarity to complexity and confidence to every decision.
    </p>

    <p className='text-justify'>
      From early development to post-market surveillance, we ensure your products are not only compliant, but resilient, audit ready, and built for long-term success.
    </p>

    <p className='text-justify'> 
      Our approach is proactive and data-driven, enabling you to reduce risk, accelerate approvals, and avoid costly setbacks such as recalls, warning letters, or compliance failures.
    </p>

    <p className='text-justify'>
      When precision matters and stakes are high, relying on fragmented or inexperienced support is a risk you can’t afford. Choosing the right regulatory partner means choosing expertise, accountability, and results.
    </p>

  </div>

  {/* Closing line */}
  <p className="text-xl md:text-2xl font-semibold text-foreground mt-10">
    Choose <span className='text-accent'>NAYA</span>RAi<sup>&trade;</sup> to turn compliance into confidence and strategy into success.
  </p>

</div>

      </div>
    </section>
  )
}