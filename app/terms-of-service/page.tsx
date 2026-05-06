'use client'

import { motion } from 'framer-motion'

const sections = [
  {
    title: '1. Introduction and Acceptance of Terms',
    content: `These Terms of Service ("Terms") constitute a legally binding agreement between NAYARAi™, a regulatory consulting firm registered and operating in Bangalore, Karnataka, India ("NAYARAi™", "we", "us", or "our"), and the client entity or individual ("Client", "you", or "your") engaging NAYARAi™ for any of its professional services.\n\nNAYARAi provides end-to-end regulatory consulting solutions across the medical device, pharmaceutical, biotechnology, and Software as a Medical Device (SaMD) sectors. Our services include, but are not limited to: Regulatory Intelligence & Strategy, Submission Management, Risk Management Systems (RMS), Quality Management Systems (QMS), Clinical Trial Management, Post Market Compliance, Labeling & Ad Promo, Regulatory Liaison, and Project Management.\n\nBy engaging NAYARAi™ — whether through a signed proposal, electronic acceptance, project kickoff, or payment — you agree to be bound by these Terms in their entirety. If you do not agree to these Terms, you must not engage NAYARAi™'s services.`
  },
  {
    title: '2. Project Commencement and Quality Agreement',
    content: `MANDATORY: No project of any nature shall be commenced by NAYARAi™ until the Client has (a) electronically signed these Terms of Service or the relevant engagement agreement, AND (b) executed and shared a fully signed copy of NAYARAi™'s Quality Agreement document with NAYARAi. Both conditions must be satisfied simultaneously before any work begins.`,
    items: [
      {
        subtitle: '2.1 Electronic Signature',
        content: `NAYARAi™ accepts electronic signatures (e-signatures) through recognized digital signature platforms. An electronically signed document carries the same legal weight as a wet-ink signature under applicable Indian law and international conventions.`
      },
      {
        subtitle: '2.2 Quality Agreement',
        content: `NAYARAi™'s Quality Agreement is a separate, mandatory governing document that defines quality standards, roles, responsibilities, communication protocols, and compliance requirements applicable to the engagement. The Client must review, complete, sign, and return this document before project activities commence.`
      },
      {
        subtitle: '2.3 Projects of Any Type',
        content: `This requirement applies universally — regardless of the service category, project size, duration, or value. No exceptions will be granted. NAYARAi™ reserves the right to refuse or pause work if either condition above is not met.`
      }
    ]
  },
  {
    title: '3. Scope of Services',
    content: `NAYARAi™ offers the following service categories to clients across biologics, medical devices, pharmaceuticals, and Software as a Medical Device (SaMD) sectors:\n\n• Regulatory Intelligence & Strategy — Gap analysis, feasibility assessment, regulatory landscape analysis, market and pathway selection (FDA, EMA, CDSCO, and others), strategic timeline planning, resource and budget forecasting, and risk mitigation planning.\n• Submission Management — Preparation, compilation, review, and management of regulatory submissions to global health authorities.\n• Risk Management System (RMS) — Development, implementation, and maintenance of risk management frameworks in accordance with applicable standards (e.g., ISO 14971).\n• Quality Management System (QMS) — Design, implementation, auditing, and improvement of quality management frameworks aligned with regulatory requirements.\n• Clinical Trial Management — Support for planning, execution, monitoring, and regulatory aspects of clinical trials.\n• Post Market Compliance — Vigilance, surveillance, periodic reporting, and compliance management post product approval or launch.\n• Labeling & Ad Promo — Regulatory review and guidance on product labeling and promotional material compliance.\n• Regulatory Liaison — Communication and representation with regulatory authorities on behalf of the Client.\n• Project Management — Oversight, coordination, and management of regulatory projects across teams and timelines.\n\nThe precise scope of each engagement shall be defined in a mutually agreed Statement of Work (SOW), project proposal, or service agreement issued by NAYARAi. Any scope changes must be agreed upon in writing before implementation.`
  },
  {
    title: '4. Client Responsibilities',
    content: `The Client agrees to:\n\n• Provide accurate, complete, and timely information, data, documentation, and access required for NAYARAi™ to perform the agreed services.\n• Designate a primary point of contact with appropriate authority to provide instructions, approvals, and sign-offs on deliverables.\n• Review all deliverables and provide written approval, feedback, or objections within the timeframes agreed in the SOW.\n• Comply with all applicable laws, regulations, and regulatory authority requirements relevant to their product and market.\n• Execute and share the Quality Agreement document with NAYARAi™ prior to project commencement.\n• Sign electronically and acknowledge these Terms of Service before any project activity begins.\n• Make all payments in accordance with Section 6 of these Terms.\n\nNAYARAi's ability to deliver services is contingent upon the Client fulfilling its obligations. Delays caused by the Client's failure to provide required inputs, approvals, or documentation shall not constitute a breach by NAYARAi™ and may result in revised timelines and/or additional costs.`
  },
  {
    title: '5. Project Completion, Sign-Off, and Transfer of Responsibility',
    content: `CRITICAL PROVISION: Upon formal project completion and Client sign-off, all regulatory, legal, compliance, and operational responsibilities in connection with the deliverables and outcomes of the project shall transfer fully and exclusively to the Client. NAYARAi™ shall bear no further liability, obligation, or responsibility of any nature whatsoever after the Client's sign-off.`,
    items: [
      {
        subtitle: '5.1 Project Completion',
        content: `A project shall be deemed complete upon the occurrence of any of the following:\n• Delivery of all agreed deliverables as defined in the SOW, and written acceptance thereof by the Client;\n• Written sign-off or approval by the Client's authorized representative on the final deliverable;\n• Expiry of the review period without written objection from the Client, as specified in the SOW.`
      },
      {
        subtitle: '5.2 Transfer of Responsibility',
        content: `From the date of project sign-off:\n• The Client assumes sole and complete responsibility for the implementation, submission, maintenance, compliance, and any regulatory outcomes arising from the deliverables.\n• The Client is solely responsible for any regulatory authority interactions, approvals, rejections, enforcement actions, product recalls, adverse events, or any other consequences relating to the deliverables.\n• NAYARAi™ shall not be liable for any errors, omissions, or deficiencies in the deliverables that were not identified and reported in writing by the Client prior to sign-off.\n• NAYARAi™ shall not be liable for any changes in regulatory requirements, guidance documents, or authority decisions occurring after the project sign-off date.`
      },
      {
        subtitle: '5.3 Post-Completion Support',
        content: `Any additional work, updates, revisions, or regulatory support required after project sign-off shall be treated as a new engagement and subject to separate agreement and fees.\n\nBy signing off on a completed project, the Client acknowledges that it has reviewed all deliverables to its satisfaction, and that all responsibility transfers to the Client at that moment. NAYARAi™'s liability is extinguished upon Client sign-off.`
      }
    ]
  },
  {
    title: '6. Payment Terms and Conditions',
    content: `All fees and payment terms shall be as set out in the NAYARAi™ project proposal, quotation, or service agreement. The following payment provisions apply universally to all engagements:`,
    items: [
      {
        subtitle: '6.1 General Payment Obligation',
        content: `The Client agrees to make all payments in full, on time, and in accordance with the payment schedule applicable to their engagement type. Timely payment is a condition of continued service delivery by NAYARAi™.`
      },
      {
        subtitle: '6.2 Upfront Payment for Specified Services',
        content: `For the following service categories, an upfront payment of 80% (eighty percent) of the total project quotation is mandatory before NAYARAi™ commences any work. The remaining 20% (twenty percent) is due upon project completion and delivery of final deliverables:\n\n• Risk Management System (RMS)\n• Regulatory Intelligence & Strategy\n• Quality Management System (QMS)\n• Project Management\n• Submission Management\n\nNAYARAi shall issue the relevant invoice(s) upon execution of the engagement agreement. The 80% upfront payment must be received and cleared before any project activities, meetings, or deliverable preparation commences. NAYARAi™ reserves the right to withhold final deliverables until the remaining 20% payment is received in full.`
      },
      {
        subtitle: '6.3 Retainer-Based Services',
        content: `Clients who engage NAYARAi™ on a retainer basis — for ongoing regulatory support, advisory, or managed services — shall make payments exclusively on a bi-weekly or monthly schedule, as mutually agreed at the commencement of the retainer arrangement. No other payment frequency shall be accepted for retainer engagements.\n\nRetainer fees are due on the agreed billing date regardless of the volume of work performed in that period. Unused retainer capacity does not carry forward to subsequent periods unless explicitly agreed in writing.`
      },
      {
        subtitle: '6.4 One-Time Project Completion Payments',
        content: `Clients who have agreed to a one-time payment structure upon project completion must make full payment within 28 (twenty-eight) calendar days of the project completion date. Failure to make payment within this period shall result in: (a) an interest charge of 9% (nine percent) per day on the outstanding balance, accruing from the 29th day; and (b) NAYARAi™ reserving the right to initiate legal proceedings before the High Court of Karnataka at Bangalore, India, for recovery of the outstanding dues, interest, and all associated legal costs.\n\nThe Client acknowledges and agrees that the 9% per day interest rate for overdue one-time completion payments is a genuine pre-estimate of the losses suffered by NAYARAi™ as a result of delayed payment and is not a penalty.`
      },
      {
        subtitle: '6.5 Late Payment Interest — General',
        content: `Without prejudice to Section 6.4 above, for all payment types not governed by the one-time completion payment structure, any overdue invoice that remains unpaid beyond the agreed due date shall attract a late payment interest charge of 2% (two percent) per month on the outstanding balance, calculated from the due date until the date of actual payment. This interest shall accrue on a monthly compounding basis.\n\nNAYARAi shall notify the Client of any overdue amount. If the Client disputes an invoice, the Client must notify NAYARAi™ in writing within 7 (seven) business days of the invoice date, setting out the grounds of dispute. Undisputed portions of an invoice remain payable by the due date.`
      },
      {
        subtitle: '6.6 Taxes and Duties',
        content: `All fees quoted by NAYARAi™ are exclusive of Goods and Services Tax (GST), withholding tax, or any other applicable taxes and duties, unless expressly stated otherwise. The Client is responsible for all applicable taxes on the services received. NAYARAi™ shall issue GST-compliant invoices as required under Indian tax law.`
      },
      {
        subtitle: '6.7 Payment Method',
        content: `Payments shall be made by bank transfer to the account details provided in the NAYARAi™ invoice, or through such other payment methods as NAYARAi™ may notify in writing from time to time. Payments are deemed received only upon full clearance of funds in NAYARAi™'s designated account.`
      }
    ]
  },
  {
    title: '7. Intellectual Property',
    items: [
      {
        subtitle: '7.1',
        content: `Upon receipt of full and final payment for a project, NAYARAi™ assigns to the Client all rights, title, and interest in the project-specific deliverables developed exclusively for the Client under the relevant SOW.`
      },
      {
        subtitle: '7.2',
        content: `NAYARAi™ retains all rights in its proprietary methodologies, frameworks, templates, tools, know-how, processes, background intellectual property, and any pre-existing materials used or incorporated in the deliverables. The Client is granted a non-exclusive, non-transferable license to use such background materials solely to the extent embedded in the delivered work product.`
      },
      {
        subtitle: '7.3',
        content: `The Client grants NAYARAi™ a limited license to use the Client's information, data, and materials solely for the purpose of delivering the agreed services.`
      }
    ]
  },
  {
    title: '8. Confidentiality',
    content: `Each party agrees to maintain in strict confidence all Confidential Information received from the other party and to use such information solely for the purpose of performing or receiving services under these Terms. "Confidential Information" means all non-public technical, commercial, regulatory, financial, or strategic information disclosed by one party to the other, whether orally, in writing, or in any other form.\n\nThis obligation of confidentiality shall not apply to information that: (a) is or becomes publicly available through no breach of these Terms; (b) was already known to the receiving party prior to disclosure; (c) is rightfully received from a third party without restriction; or (d) is required to be disclosed by law or regulatory authority, provided that prompt written notice is given to the disclosing party.\n\nThe confidentiality obligations shall survive the termination or expiry of these Terms for a period of five (5) years.`
  },
  {
    title: '9. Limitation of Liability',
    items: [
      {
        subtitle: '9.1',
        content: `NAYARAi™’s aggregate liability to the Client for any claim arising out of or in connection with these Terms or the services provided shall not exceed the total fees actually paid by the Client to NAYARAi™ for the specific project or service giving rise to the claim, in the twelve (12) months preceding the claim.`
      },
      {
        subtitle: '9.2',
        content: `NAYARAi™ shall not be liable for any indirect, consequential, special, incidental, punitive, or exemplary damages, including but not limited to loss of profit, loss of revenue, loss of business, loss of data, loss of regulatory approval, product recall costs, or reputational damage, howsoever arising.`
      },
      {
        subtitle: '9.3',
        content: `NAYARAi™ does not guarantee any specific regulatory outcome, approval, or timeline. Regulatory decisions are made exclusively by the relevant governmental or regulatory authorities and are outside NAYARAi™'s control.\n\nAs stated in Section 5, NAYARAi™ bears no liability whatsoever for any matter arising after the Client's formal sign-off on a completed project. All responsibilities pass to the Client at that point.`
      }
    ]
  },
  {
    title: '10. Term and Termination',
    items: [
      {
        subtitle: '10.1',
        content: `These Terms remain in force for the duration of each engagement between NAYARAi™ and the Client, and shall survive termination to the extent necessary to give effect to provisions relating to payment, intellectual property, confidentiality, limitation of liability, and dispute resolution.`
      },
      {
        subtitle: '10.2',
        content: `Either party may terminate an engagement by providing thirty (30) days' written notice to the other party, subject to payment of all fees for work performed up to the date of termination.`
      },
      {
        subtitle: '10.3',
        content: `NAYARAi™ may terminate an engagement immediately upon written notice if the Client: (a) fails to make payment by the due date and does not remedy such failure within seven (7) business days of written notice; (b) breaches the Quality Agreement or these Terms in a material way; or (c) becomes insolvent or enters into any insolvency proceedings.`
      },
      {
        subtitle: '10.4',
        content: `Upon termination, the Client shall pay NAYARAi™ for all work completed and expenses incurred up to the termination date. Any deliverables in progress shall be delivered in their then-current state, and the applicable sign-off and responsibility transfer provisions shall apply.`
      }
    ]
  },
  {
    title: '11. Dispute Resolution and Governing Law',
    items: [
      {
        subtitle: '11.1',
        content: `The parties shall attempt to resolve any dispute arising out of or in connection with these Terms through good-faith negotiation within thirty (30) days of written notice of the dispute.`
      },
      {
        subtitle: '11.2',
        content: `If a dispute is not resolved through negotiation, the parties agree to submit the matter to binding arbitration under the Arbitration and Conciliation Act, 1996 (as amended). The seat and venue of arbitration shall be Bangalore, Karnataka, India. The arbitration shall be conducted in English before a sole arbitrator mutually appointed by the parties.`
      },
      {
        subtitle: '11.3',
        content: `Notwithstanding the foregoing, NAYARAi™ reserves the right to seek urgent or interim relief, including injunctive relief and recovery of overdue payments, before the High Court of Karnataka at Bangalore, India. The Client expressly submits to the exclusive jurisdiction of the courts of Bangalore, Karnataka for any such proceedings.`
      },
      {
        subtitle: '11.4',
        content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.`
      }
    ]
  },
  {
    title: '12. Data Protection and Privacy',
    content: `NAYARAi™ processes personal data in accordance with its Privacy Policy, available at www.nayarai.com/privacy, and in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India. Where NAYARAi™ processes personal data of EU/EEA individuals on behalf of the Client, the General Data Protection Regulation (GDPR) obligations shall also apply. The Client is responsible for ensuring it has a lawful basis for sharing personal data with NAYARAi™ for processing purposes.`
  },
  {
    title: '13. Force Majeure',
    content: `Neither party shall be liable for any failure or delay in performing its obligations under these Terms to the extent that such failure or delay is caused by a Force Majeure Event — meaning any circumstance beyond the reasonable control of the affected party, including acts of God, pandemic, epidemic, natural disaster, war, civil unrest, government action, or regulatory authority decisions. The affected party shall notify the other in writing within five (5) business days of the Force Majeure Event and shall use reasonable efforts to mitigate its effects.`
  },
  {
    title: '14. General Provisions',
    items: [
      {
        subtitle: '14.1 Entire Agreement',
        content: `These Terms, together with the Quality Agreement, the relevant SOW or project proposal, and any engagement letter, constitute the entire agreement between the parties with respect to its subject matter and supersede all prior representations, negotiations, or agreements.`
      },
      {
        subtitle: '14.2 Amendments',
        content: `NAYARAi™ reserves the right to amend these Terms from time to time. Clients will be notified of material changes in writing. Continued engagement after notification constitutes acceptance of the revised Terms.`
      },
      {
        subtitle: '14.3 Severability',
        content: `If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.`
      },
      {
        subtitle: '14.4 Waiver',
        content: `No failure or delay by NAYARAi™ in exercising any right under these Terms shall operate as a waiver of that right.`
      },
      {
        subtitle: '14.5 Assignment',
        content: `The Client may not assign or transfer any rights or obligations under these Terms without NAYARAi™'s prior written consent. NAYARAi™ may assign its rights and obligations to an affiliate or successor entity.`
      },
      {
        subtitle: '14.6 Notices',
        content: `All formal notices under these Terms shall be in writing and delivered by email with read receipt or courier to the parties' registered addresses. Notices to NAYARAi™ shall be sent to info@nayarai.com, Bangalore, Karnataka, India.`
      }
    ]
  },
  {
    title: '15. Contact Information',
    content: `For any queries regarding these Terms of Service, the Quality Agreement, invoicing, or project engagements, please contact:\n\n**NAYARAi™**\n**Email:** info@nayarai.com\n**Phone:** +91 (789) 265 7083\n**Address:** Bangalore, Karnataka, India\n**Website:** www.nayarai.com\n\n**ACKNOWLEDGEMENT AND ACCEPTANCE**\nBy engaging NAYARAi™'s services — whether through electronic signature, written confirmation, payment, or project commencement — the Client acknowledges that it has read, understood, and agrees to be bound by these Terms of Service in their entirety.\n\n© 2026 NAYARAi™. All rights reserved. Bangalore, Karnataka, India.`
  }
]

export default function TermsOfServicePage() {
  const renderText = (text: string) => {
    return text.split('\\n').map((paragraph, i) => {
      const parts = paragraph.split(/\\*\\*(.*?)\\*\\*/g);
      return (
        <p key={i}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-foreground">{p}</strong> : p)}
        </p>
      );
    });
  };

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
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance uppercase text-foreground">
              {'TERMS OF '}
              <span className="text-accent">{'SERVICE'}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-2">Effective Date: 15 April 2026<span className="mx-4">|</span>Version: 1.0</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-center md:text-left"
          >
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              These Terms of Service constitute a legally binding agreement between NAYARAi™ and the client entity or individual engaging NAYARAi™ for any of its professional services.
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
                  {renderText(section.content)}
                </div>
              )}

              {section.items && (
                <div className="space-y-10">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="space-y-2">
                      {item.content && (
                        <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-justify space-y-4">
                          {item.subtitle ? (
                            <>
                              {item.content.split('\n').map((paragraph, i) => {
                                const parts = paragraph.split(/\*\*(.*?)\*\*/g);
                                return (
                                  <p key={i}>
                                    {i === 0 && (
                                      <span className="font-display font-semibold text-foreground mr-2">
                                        {item.subtitle}
                                      </span>
                                    )}
                                    {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-foreground">{p}</strong> : p)}
                                  </p>
                                );
                              })}
                            </>
                          ) : (
                            renderText(item.content)
                          )}
                        </div>
                      )}
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
