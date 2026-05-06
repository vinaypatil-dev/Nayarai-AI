'use client'

import { motion } from 'framer-motion'

const sections = [
  {
    title: 'PART I — THIRD-PARTY PLATFORMS, LINKS, AND LOGO DISPLAY',
    items: [
      {
        subtitle: '1. Third-Party Platforms Accessible from This Site',
        content: `NAYARAi™’s website contains references to, links to, or displays recognizable icons and logos associated with the following third-party platforms and service providers (collectively, “Third-Party Services”):

•	YouTube (Google LLC)
•	LinkedIn (LinkedIn Corporation, a Microsoft subsidiary)
•	X (formerly Twitter) / X.com (X Corp.)
•	Facebook / Meta (Meta Platforms, Inc.)
•	Instagram (Meta Platforms, Inc.)
•	Pinterest (Pinterest, Inc.)
•	Calendly (Calendly, LLC) — used for meeting scheduling
•	GoDaddy (GoDaddy Inc.) — domain registration and hosting services
•	Microsoft Clarity / Microsoft Analytics (Microsoft Corporation)
•	Google Analytics / Google Site Analytics (Google LLC)

The above list is illustrative and not exhaustive. NAYARAi™ may add or remove Third-Party Services from time to time without prior notice.`
      },
      {
        subtitle: '2. Disclaimer of Responsibility for Third-Party Data Practices',
        content: `NAYARAi™ expressly disclaims all responsibility for the manner in which Third-Party Services collect, access, store, process, share, or use any information about you when you interact with those platforms, whether through links on our Site or through embedded tools (such as scheduling widgets or social media plugins).

When you click on a link to a Third-Party Service, leave our Site, or interact with a third-party widget or integration, you are subject to the privacy policies, terms of service, and data practices of that third party — not NAYARAi™’s policies. NAYARAi™ has no control over, and assumes no responsibility or liability for:

•	The content, accuracy, or availability of third-party websites or platforms;
•	The collection, use, storage, or sharing of your personal data by Third-Party Services;
•	Any security incidents, data breaches, or privacy violations that occur on or through third-party platforms;
•	The cookie practices or tracking technologies deployed by third-party platforms;
•	Any commercial or contractual relationship you may enter into with a Third-Party Service.

NAYARAi™ strongly encourages all users to read the privacy policies and terms of use of any Third-Party Service before submitting personal information or engaging with such platforms. You interact with Third-Party Services entirely at your own risk.`
      },
      {
        subtitle: '3. Display of Third-Party Logos — Trademark Acknowledgement',
        content: `The logos, icons, brand marks, and trade names of Third-Party Services displayed on our Site (collectively, “Third-Party Marks”) are the exclusive intellectual property of their respective owners. NAYARAi™ does not claim any ownership, affiliation, sponsorship, or endorsement by or of these companies unless expressly stated in writing.

The display of Third-Party Marks on NAYARAi™’s website is made in good faith for the purpose of identifying and referencing those platforms in a descriptive or nominative manner, consistent with the doctrine of nominative fair use as recognized under applicable intellectual property law, including but not limited to:

•	The Trade Marks Act, 1999 (Republic of India);
•	The Copyright Act, 1957 (Republic of India);
•	The Information Technology Act, 2000, and its rules;
•	Applicable international intellectual property conventions to which India is a party.

NAYARAi™ does not use Third-Party Marks in a manner that is likely to cause confusion, suggest sponsorship or endorsement, or otherwise infringe upon the trademark rights of their respective owners. The display of any such mark does not constitute a partnership, joint venture, licensing arrangement, or any other commercial relationship between NAYARAi™ and the relevant third party.`
      },
      {
        subtitle: '4. No Endorsement',
        content: `The listing or display of Third-Party Services on our Site does not constitute a recommendation, endorsement, or warranty by NAYARAi™ regarding the quality, reliability, accuracy, or suitability of any third-party platform, product, or service. Users exercise independent judgment in choosing to engage with any Third-Party Service.`
      },
      {
        subtitle: '5. No Responsibility for Third-Party Availability',
        content: `NAYARAi™ is not responsible for the availability, uptime, or continuity of any Third-Party Service. If a Third-Party Service is unavailable, NAYARAi™ shall not be liable for any loss, inconvenience, or disruption resulting therefrom.`
      }
    ]
  },
  {
    title: 'PART II — NAYARAi™ BRAND, LOGO, AND INTELLECTUAL PROPERTY PROTECTION',
    items: [
      {
        subtitle: '6. NAYARAi™’s Proprietary Marks',
        content: `The name “NAYARAi™”, together with its logo, wordmark, design elements, color scheme, taglines, service names, and all associated brand identifiers (collectively, “NAYARAi™ Marks”), are the exclusive intellectual property of NAYARAi. The NAYARAi™ Marks are integral to NAYARAi™’s commercial identity, professional reputation, and business operations.

NAYARAi™ Marks are protected under the following applicable laws of the Republic of India:

•	The Trade Marks Act, 1999 — including rights arising from use, registration, and goodwill associated with the mark;
•	The Copyright Act, 1957 — in respect of original artistic and design elements forming part of the NAYARAi™ logo and brand identity;
•	The Information Technology Act, 2000 — in respect of digital misuse or unauthorized online reproduction;
•	The Competition Act, 2002 — in respect of unfair trade practices and passing off;
•	Common law rights of passing off, applicable under Indian jurisprudence.`
      },
      {
        subtitle: '7. Prohibited Uses of NAYARAi™ Marks',
        content: `No individual, entity, organization, or platform is permitted to use the NAYARAi™ name, logo, or any substantially similar mark without the prior, express, and written authorization of NAYARAi. Prohibited uses include, without limitation:

•	Reproducing, copying, or downloading the NAYARAi™ logo or brand elements for any commercial or non-commercial purpose;
•	Using the NAYARAi™ name or logo in any manner that implies affiliation, endorsement, partnership, or association with NAYARAi™ without written consent;
•	Creating derivative works, modified versions, or lookalike representations of the NAYARAi™ logo or wordmark;
•	Using NAYARAi™ Marks in advertising, promotional materials, websites, social media profiles, or business communications without authorization;
•	Registering any domain name, social media handle, or business name that incorporates the NAYARAi™ mark or any confusingly similar variation;
•	Misrepresenting oneself or one’s services as NAYARAi™, or passing off goods or services as those of NAYARAi™;
•	Using NAYARAi™ Marks in meta tags, search engine keywords, or digital advertising in a manner that causes confusion or diverts business.`
      },
      {
        subtitle: '8. Legal Consequences of Unauthorized Use',
        content: `Any unauthorized use of NAYARAi™’s name, logo, or intellectual property shall constitute an infringement of NAYARAi™’s rights and will be treated as a serious legal violation. NAYARAi™ reserves the right to take all available legal action, including but not limited to:

•	Filing a civil suit for trademark infringement and/or passing off before the competent courts of the Republic of India;
•	Seeking injunctive relief (interim, interlocutory, and permanent) to restrain continued infringement;
•	Claiming damages, including actual damages, statutory damages, and the account of profits made through the infringing use;
•	Filing a criminal complaint under Section 103 and Section 104 of the Trade Marks Act, 1999, which provide for imprisonment of up to three (3) years and/or fines for fraudulent use of trademarks;
•	Initiating proceedings under the Copyright Act, 1957 for infringement of artistic works, which may result in imprisonment and fines;
•	Reporting fraudulent or impersonation conduct to relevant authorities under the Information Technology Act, 2000;
•	Engaging in domain dispute resolution proceedings under ICANN/IN Registry policies where applicable.

All infringement claims shall be subject to the jurisdiction of the courts of Bangalore, Karnataka, Republic of India, unless otherwise required by applicable law. NAYARAi™ will pursue enforcement vigorously to protect its brand, reputation, and commercial interests.`
      },
      {
        subtitle: '9. Reporting Infringement',
        content: `If you become aware of any unauthorized use of NAYARAi™’s name, logo, or intellectual property, please notify us immediately at:

NAYARAi™ — Legal & Compliance
Email: info@nayarai.com
Phone: +91 (789) 265 7083
Address: Bangalore, Karnataka, India`
      }
    ]
  },
  {
    title: 'PART III — GENERAL PROVISIONS',
    items: [
      {
        subtitle: '10. Amendments',
        content: `NAYARAi™ reserves the right to update or amend this Notice at any time. Any amendments shall be effective from the date of publication on our Site. Continued use of the Site following any amendment constitutes acceptance of the revised Notice.`
      },
      {
        subtitle: '11. Governing Law',
        content: `This Notice is governed by and shall be construed in accordance with the laws of the Republic of India. Any disputes arising in connection with this Notice shall be subject to the exclusive jurisdiction of the courts of Bangalore, Karnataka, India, subject to the arbitration provisions set out in NAYARAi™’s Terms of Service.`
      },
      {
        subtitle: '12. Severability',
        content: `If any provision of this Notice is found to be invalid, unlawful, or unenforceable by a court of competent jurisdiction, such provision shall be severed and the remaining provisions shall continue in full force and effect.`
      }
    ]
  }
]

export default function LegalNoticePage() {
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
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance uppercase">
              {'THIRD-PARTY DISCLAIMER, TRADEMARK, AND '}
              <span className="text-accent">{'INTELLECTUAL PROPERTY NOTICE'}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-2">Effective Date: April 14, 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-center md:text-left"
          >
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              This document sets out NAYARAi™’s position regarding third-party platforms, tools, and digital services accessible from or referenced on our website at NAYARAi.com (“Site”), and establishes the rights and protections applicable to NAYARAi™’s own intellectual property, including its brand name, logo, and associated marks. This Notice should be read in conjunction with NAYARAi™’s Privacy Policy, Terms of Service, and Cookie Policy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="space-y-8"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground border-b border-border/50 pb-4">
                {section.title}
              </h2>
              
              <div className="space-y-10">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="space-y-4">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {item.subtitle}
                    </h3>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-justify space-y-4">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
