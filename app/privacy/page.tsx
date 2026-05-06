'use client'

import { motion } from 'framer-motion'

const sections = [
  {
    title: '1. About NAYARAi™ and This Policy',
    content: `NAYARAi™ (“we,” “us,” or “our”) is a healthcare regulatory consulting firm headquartered in Bangalore, Karnataka, India. We provide regulatory strategy, submission management, compliance, and clinical advisory services to clients in the medical device, pharmaceutical, and biotechnology sectors globally.\n\nThis Privacy Policy applies to:\n• Your use of our website at nayarai.com (the “Site”);\n• Your engagement with NAYARAi™’s consulting and professional services;\n• All communications you initiate with NAYARAi™ via email, phone, or online forms;\n• Scheduling interactions via third-party tools such as Calendly embedded on or linked from our Site.\n\nThis Policy does not apply to third-party websites, platforms, or services linked from our Site. For how those platforms handle your data, please refer to their own privacy policies.`
  },
  {
    title: '2. What Personal Data We Collect',
    items: [
      {
        subtitle: '2.1 Data You Provide Directly',
        content: `When you contact us, submit an enquiry, book a consultation, or engage our services, we may collect:\n• Full name and professional title or designation\n• Company or organization name and business address\n• Email address and telephone number\n• Details of your regulatory needs, product descriptions, or project scope shared in communications\n• Billing and payment information (processed exclusively through secure, PCI-compliant third-party payment processors — NAYARAi™ does not store raw card data)\n• Any other information you voluntarily provide to us`
      },
      {
        subtitle: '2.2 Data Collected Automatically',
        content: `When you visit our Site, we or our third-party service providers automatically collect the following technical data:\n• IP address and approximate geographic location (city/country level)\n• Browser type, version, and language settings\n• Operating system and device type\n• Pages visited, time and duration of visits, and navigation paths\n• Referring URLs (the page you arrived from)\n• Screen resolution and device identifiers\n\nThis data is collected through cookies and similar tracking technologies. See our Cookie Policy for detailed information.`
      },
      {
        subtitle: '2.3 Data from Third-Party Sources',
        content: `We may receive limited information about you from:\n• LinkedIn or other professional networks, where you have connected with or followed NAYARAi™ publicly\n• Referral partners or professional contacts who recommend our services\n• Publicly available professional directories or regulatory body registers\n\nWe use this information solely to understand professional context and to provide relevant services.`
      },
      {
        subtitle: '2.4 Sensitive Data',
        content: `NAYARAi™ does not intentionally collect sensitive personal data (such as health records, financial account numbers, biometric data, or government identification numbers) through our website. If such data is shared during a professional engagement, it is handled under a separate engagement agreement with enhanced confidentiality obligations.`
      }
    ]
  },
  {
    title: '3. How We Use Your Personal Data',
    content: `We use your personal data only for specified, legitimate purposes. These are:\n\n**a) To Respond to Enquiries and Provide Services**\nProcessing your contact details and enquiry information to respond promptly, schedule consultations, and deliver our regulatory consulting services.\n\n**b) To Manage Client Relationships**\nMaintaining records of our communications, engagements, and service delivery history for ongoing client management and quality assurance.\n\n**c) To Send Service-Related Communications**\nSending you updates, invoices, project-related notifications, and information directly related to your engagement with NAYARAi.\n\n**d) For Marketing Communications**\nWhere you have opted in, or where permitted by applicable law, sending you newsletters, industry updates, event invitations, or information about our services. You may opt out of marketing communications at any time by clicking “unsubscribe” in any such email or contacting us at info@nayarai.com.\n\n**e) To Improve Our Website and Services**\nAnalyzing aggregated, anonymized usage data to understand how visitors use our Site and to improve its content, structure, and performance.\n\n**f) To Comply with Legal Obligations**\nProcessing data as required to comply with applicable laws, regulations, court orders, or lawful requests from regulatory or law enforcement authorities in India or internationally.\n\n**g) To Detect and Prevent Fraud and Security Threats**\nMonitoring Site activity to identify, investigate, and prevent fraudulent, abusive, or unlawful use of our services or systems.`
  },
  {
    title: '4. Legal Basis for Processing',
    content: `Where data protection law applies — including the Digital Personal Data Protection Act, 2023 (India) (“DPDP Act”) and the General Data Protection Regulation (GDPR) for individuals in the European Economic Area — we rely on the following legal bases:\n\n• **Consent** — Where you have given us explicit, freely-given, and informed consent (e.g., subscribing to our newsletter or accepting non-essential cookies). You may withdraw consent at any time without affecting the lawfulness of prior processing.\n• **Contractual Necessity** — Where processing is necessary to enter into or perform a contract with you, or to take steps at your request prior to entering a contract.\n• **Legitimate Interests** — Where processing is necessary for our legitimate business interests (e.g., site analytics, fraud prevention, client relationship management), provided those interests are not overridden by your fundamental rights and freedoms.\n• **Legal Obligation** — Where we are required to process your data to comply with a legal or regulatory obligation applicable to NAYARAi.\n\nWe do not use automated decision-making or profiling that produces legal or similarly significant effects on individuals.`
  },
  {
    title: '5. How We Share Your Personal Data',
    items: [
      {
        subtitle: '5.1 We Do Not Sell Your Data',
        content: `NAYARAi™ does not sell, rent, trade, or otherwise commercially exploit your personal data to any third party. Your data is shared only as described below.`
      },
      {
        subtitle: '5.2 Service Providers and Data Processors',
        content: `We engage trusted third-party service providers who process data on our behalf under strict contractual obligations. These may include:\n• Cloud hosting and infrastructure providers (e.g., Vercel, GoDaddy)\n• Email delivery and CRM platforms\n• Website analytics providers (Google Analytics, Microsoft Clarity)\n• Meeting scheduling tools (Calendly)\n• Payment processors (PCI-DSS compliant providers)\n\nAll such providers are contractually required to maintain appropriate data security measures and to process your data only for the specified purposes.`
      },
      {
        subtitle: '5.3 Professional Advisors',
        content: `We may share data with lawyers, accountants, or auditors where necessary, subject to professional privilege or confidentiality obligations.`
      },
      {
        subtitle: '5.4 Legal and Regulatory Disclosure',
        content: `We may disclose your data to regulatory authorities, law enforcement agencies, or courts where required by applicable law, a valid legal order, or to protect the rights, safety, or property of NAYARAi™, our clients, or third parties.`
      },
      {
        subtitle: '5.5 Business Transfers',
        content: `In the event of a merger, acquisition, restructuring, or sale of assets involving NAYARAi™, your data may be transferred to the relevant successor entity, subject to equivalent privacy protections.`
      },
      {
        subtitle: '5.6 Third-Party Platforms (User-Initiated)',
        content: `When you choose to interact with third-party platforms accessible from our Site — such as LinkedIn, YouTube, X (Twitter), Facebook, Instagram, Pinterest, or Calendly — any data you submit to those platforms is processed by them under their own privacy policies. NAYARAi™ has no control over and assumes no responsibility for those platforms’ data practices. Please review each platform’s privacy policy before submitting personal data.`
      }
    ]
  },
  {
    title: '6. International Data Transfers',
    content: `NAYARAi™ is headquartered in India. Some of our service providers and clients are located in other countries, including the European Economic Area (EEA), the United Kingdom, and the United States. Where we transfer personal data across borders, we implement appropriate safeguards, including:\n• Standard Contractual Clauses (SCCs) approved by the European Commission, where applicable under GDPR;\n• Transfers only to countries or recipients offering equivalent data protection standards;\n• Compliance with the cross-border transfer provisions of the DPDP Act, 2023 as they are notified and implemented.\n\nBy using our Site or services, you acknowledge that your data may be processed in countries outside your country of residence, which may have different data protection laws.`
  },
  {
    title: '7. Data Retention',
    content: `We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law. Our standard retention periods are:\n\n• **Website enquiry and contact data**: 3 years from last interaction\n• **Client engagement and project data**: 7 years from project completion, or as required by applicable regulatory or professional obligations\n• **Marketing preferences and consent records**: Until consent is withdrawn, plus 1 year\n• **Financial and billing records**: 8 years in accordance with Indian accounting and tax law\n• **Website analytics data**: As set by the respective analytics provider (typically up to 26 months for Google Analytics)\n\nWhen data is no longer required, it is securely deleted or anonymized so that it can no longer be associated with any individual.`
  },
  {
    title: '8. Your Data Protection Rights',
    content: `Depending on your jurisdiction, you have the following rights regarding your personal data:\n\n• **Right of Access** — You may request a copy of the personal data we hold about you and information about how we use it.\n• **Right to Correction** — You may request that we correct inaccurate or incomplete personal data.\n• **Right to Erasure (“Right to be Forgotten”)** — You may request deletion of your personal data, subject to legal retention obligations.\n• **Right to Restrict Processing** — You may ask us to temporarily restrict the processing of your data in certain circumstances.\n• **Right to Object** — You may object to processing based on legitimate interests, including for direct marketing purposes.\n• **Right to Data Portability** — Where processing is based on consent or contract and carried out by automated means, you may request a structured, machine-readable copy of your data.\n• **Right to Withdraw Consent** — Where processing is consent-based, you may withdraw consent at any time without affecting the lawfulness of prior processing.\n• **Right to Lodge a Complaint** — You have the right to lodge a complaint with the relevant data protection authority in your jurisdiction (for India: The Data Protection Board of India under the DPDP Act; for EEA: your national supervisory authority).\n\nTo exercise any of the above rights, please contact us at info@nayarai.com. We will respond within 30 days. We may require identity verification before processing your request.`
  },
  {
    title: '9. Data Security',
    content: `NAYARAi™ takes the security of your personal data seriously. We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, alteration, disclosure, or destruction. These measures include:\n• SSL/TLS encryption for all data transmitted to and from our Site\n• Access controls and role-based permissions for internal systems\n• Regular security reviews and vulnerability assessments\n• Confidentiality obligations for all personnel handling personal data\n• Use of reputable, security-certified third-party service providers\n\nHowever, no method of electronic transmission or storage is completely secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee absolute security. In the event of a data breach that is likely to result in a high risk to your rights and freedoms, we will notify you and the relevant authorities in accordance with applicable law.`
  },
  {
    title: '10. Children’s Privacy',
    content: `Our Site and professional services are directed exclusively at business professionals and organizations. We do not knowingly collect personal data from individuals under the age of 18. If we become aware that we have inadvertently collected data from a minor, we will delete it promptly. If you believe we hold such data, please contact us immediately at info@nayarai.com.`
  },
  {
    title: '11. Third-Party Links and External Platforms',
    content: `Our Site contains links to, icons of, and integrations with third-party platforms including YouTube, LinkedIn, X (formerly Twitter), Facebook, Instagram, Pinterest, Calendly, GoDaddy, Microsoft Analytics, and Google Analytics. Clicking on these links or interacting with embedded tools will direct you to platforms operated by third parties.\n\nNAYARAi is not responsible for the privacy practices of any third-party platform. The display of third-party logos on our Site is for identification purposes only and does not constitute an endorsement of, or any partnership with, those platforms. Any personal data you provide directly to these third-party platforms is subject to their own privacy policies, which we encourage you to review.`
  },
  {
    title: '12. Cookies and Tracking Technologies',
    content: `Our Site uses cookies and similar technologies to function correctly and to collect analytics data. For full details on the types of cookies we use, what they do, how long they last, and how you can control them, please refer to our Cookie Policy, available on our Site.\n\nYou can manage your cookie preferences at any time via the Cookie Settings link in our Site footer or through your browser settings.`
  },
  {
    title: '13. Changes to This Privacy Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our data practices, the services we offer, or applicable law. When we make material changes, we will:\n• Update the effective date at the top of this document;\n• Post the revised Policy on our Site;\n• Where appropriate and required by law, notify you by email.\n\nYour continued use of our Site or services after any update is posted constitutes your acknowledgement of, and consent to, the revised Privacy Policy.`
  },
  {
    title: '14. Contact Us — Data Privacy Enquiries',
    content: `For any questions, concerns, or requests relating to this Privacy Policy or your personal data, please contact:\n\n**Organization:** NAYARAi™ — Data Privacy Team\n**Email:** info@nayarai.com\n**Phone:** +91 (789) 265 7083\n**Address:** Bangalore, Karnataka, India\n**Website:** nayarai.com\n\nWe aim to respond to all privacy-related requests within 30 days. For complex requests, we may extend this period by a further 30 days and will notify you accordingly.`
  }
]

export default function PrivacyPolicyPage() {
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
             className="text-center md:text-left mb-16"
          >
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance uppercase">
              {'PRIVACY '}
              <span className="text-accent">{'POLICY'}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-2">Effective Date: April 14, 2026<span className="mx-4">|</span>Version: 2.0</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-center md:text-left"
          >
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              This Privacy Policy explains in detail how NAYARAi™ collects, uses, stores, shares, and protects your personal data. We are committed to full transparency. Please read this document carefully before using our website or engaging our services.
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
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="space-y-8"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground border-b border-border/50 pb-4">
                {section.title}
              </h2>
              
              {section.content && (
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-justify space-y-4">
                  {/* Handle basic bold formatting in text */}
                  {section.content.split('\n').map((paragraph, i) => {
                    const parts = paragraph.split(/\*\*(.*?)\*\*/g);
                    return (
                      <p key={i}>
                        {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-foreground">{p}</strong> : p)}
                      </p>
                    );
                  })}
                </div>
              )}

              {section.items && (
                <div className="space-y-10">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="space-y-4">
                      <h3 className="font-display text-xl font-semibold text-foreground">
                        {item.subtitle}
                      </h3>
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-justify space-y-4">
                        {item.content.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
