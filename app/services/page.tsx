'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { FadeInView, ZoomScroll } from '@/components/scroll-animations'
import { 
  ShieldCheck, FileText, Eye, ClipboardCheck,
  Megaphone, Handshake, LayoutDashboard, CheckCircle2, ChevronDown, ShieldAlert,
  FlaskConical, Cpu, Pill, Monitor
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef, useState, useCallback, useLayoutEffect } from 'react'

const services = [
  {
    id: 1,
    icon: ShieldCheck,
    title: 'Regulatory Strategy',
    location: 'Global Services',
    status: 'Featured',
    description: 'Strategic pathways for faster approvals and compliant market entry',
    overview:
      'Develop strategic regulatory pathways that accelerate market entry while ensuring full compliance. Our experts analyze market landscapes, identify optimal approval routes, and create detailed timelines that keep your product development on track—across all product categories.',
    features: [
      'Gap analysis & feasibility assessment',
      'Regulatory landscape & competitor analysis',
      'Market & pathway selection (FDA, EMA, CDSCO)',
      'Strategic timeline & milestone planning',
      'Resource & budget forecasting',
      'Risk mitigation & contingency planning',
      'Competitive regulatory intelligence',
      'Regulatory due diligence (M&A, licensing)',
    ],
    featureDetails: [
      {
        title: 'Gap Analysis & Feasibility Assessment',
        description:
          'Evaluate product readiness against regulatory requirements and identify critical gaps early for all product categories.',
      },
      {
        title: 'Regulatory Landscape Analysis',
        description:
          'Analyze evolving global regulations, guidance documents, and competitor positioning across biologics, pharmaceuticals, medical devices, and digital health for informed strategy.',
      },
      {
        title: 'Market & Pathway Selection',
        description:
          'Identify optimal regulatory pathways based on product type and target markets.',
      },
      {
        title: 'Strategic Timeline Planning',
        description:
          'Develop realistic, milestone-driven regulatory timelines aligned with clinical, quality, and manufacturing activities.',
      },
      {
        title: 'Resource & Budget Forecasting',
        description:
          'Estimate regulatory costs, submission timelines, and resource allocation across all product categories for efficient execution.',
      },
      {
        title: 'Risk Mitigation & Contingency Planning',
        description:
          'Apply risk-based approaches to anticipate regulatory hurdles and define mitigation strategies tailored to each product type.',
      },
      {
        title: 'Competitive Regulatory Intelligence',
        description:
          'Benchmark against competitors\' regulatory strategies, precedent-setting approvals, and evolving guidance.',
      },
      {
        title: 'Regulatory Due Diligence',
        description:
          'Assess regulatory status and risks for M&A, licensing, or in-licensing opportunities across all product categories.',
      },
    ],
benefits: [
  'BLA strategy',
  'Biosimilar pathway analysis',
  'Comparability protocols',
  'NDA / ANDA strategy',
  'Orphan Drug Designation (ODD)',
  'PIP / Paediatric Plans',
  '510(k) & PMA pathways',
  'CE Marking (EU MDR)',
  'CDSCO device classification',
  'SaMD risk classification (IMDRF)',
  'AI/ML regulatory planning',
  'Predetermined change control',
],
    rating: 4.9,
    reviews: 127,
  },

  {
    id: 2,
    icon: FileText,
    title: 'Submission Management',
    location: 'Global Submissions',
    status: 'Popular',
    description: 'End-to-end submission preparation and lifecycle management',
    overview:
      'End-to-end management of regulatory submissions with meticulous attention to detail. From initial document preparation to post-submission communications, we ensure your application meets all requirements for a smooth review process—across biologics, pharmaceuticals, medical devices, and software as a medical device.',
    features: [
      'Dossier compilation & formatting (CTD, eCTD, ACTD)',
      'Electronic submission management (FDA ESG, EMA CESP, CDSCO eCTD)',
      'Pre-submission strategy (Pre-IND, Pre-IDE, Pre-BLA, Q-Sub)',
      'Deficiency letter response & query management',
      'Lifecycle management submissions (supplements, variations, renewals)',
      'SaMD submission specialization (PCCP, AI/ML, SOUP)',
      'Labeling & package insert alignment',
      'Submission tracking & milestone management',
    ],
    featureDetails: [
      {
        title: 'Dossier Compilation & Formatting',
        description:
          'Preparation of CTD, eCTD, ACTD, and region-specific dossiers for all product types.',
      },
      {
        title: 'Electronic Submission Management',
        description:
          'End-to-end eCTD authoring, validation, and gateway submission via FDA ESG, EMA CESP, and CDSCO eCTD portals.',
      },
      {
        title: 'Pre-Submission Strategy',
        description:
          'Pre-IND, Pre-IDE, Pre-BLA, Q-Sub, and pre-submission meetings with health authorities to align on regulatory pathways.',
      },
      {
        title: 'Deficiency Letter Response',
        description:
          'Drafting comprehensive, scientifically robust responses to regulatory queries, RTAs, and complete response letters.',
      },
      {
        title: 'Lifecycle Management Submissions',
        description:
          'Supplements, variations (Type IA/IB/II), amendments, renewals, and post-approval changes for all product categories.',
      },
      {
        title: 'SaMD Submission Specialization',
        description:
          'Predetermined Change Control Plans (PCCP), validated AI/ML transparency documentation, and Software of Unknown Provenance (SOUP) analysis.',
      },
      {
        title: 'Labeling & Package Insert Alignment',
        description:
          'Ensure submission labeling is consistent with approved claims and regional requirements.',
      },
      {
        title: 'Submission Tracking & Milestone Management',
        description:
          'Real-time dashboard tracking of submission status, queries, and approval timelines.',
      },
    ],
    benefits: [
      'High-quality submissions',
      'Faster review timelines',
      'Reduced deficiencies',
      'Global regulatory alignment',
    ],
    rating: 5.0,
    reviews: 203,
    regulatoryMatrix: [
      {
        region: 'USA, EU, Australia, Canada, UK',
        archetype: 'Reference Regulators (Tier 1)',
        keyRegulators: [
          'U.S. Food and Drug Administration',
          'European Medicines Agency',
          'Therapeutic Goods Administration',
          'Health Canada',
          'Medicines and Healthcare products Regulatory Agency',
        ],
        biologics: ['BLA', 'MAA', 'NDS',"Biologics Licence"],
        pharmaceuticals: ['NDA', 'ANDA', 'MAA',"NDS","ARTG Registration","MA"],
        medicalDevices: ['510(k) / PMA / De Novo', 'CE Mark – MDR 2017', 'Licence','ARTG','CAPS / UKCA '],
        saMD: ['510(k) / De Novo / PMA ', 'CE Mark under MDR / AI Act', 'SaMD Licence','ARTG','UKCA + AI Act'],
      },
      {
        region: 'Japan, South Korea',
        archetype: 'Asia – Developed',
        keyRegulators: [
          'Pharmaceuticals and Medical Devices Agency',
          'Ministry of Food and Drug Safety',
        ],
        biologics: ['JBLA', 'Biologics Approval'],
        pharmaceuticals: ['J-NDA',"Korea NDA"],
        medicalDevices: ['Shonin / Ninsho','GMP + Device Approval'],
        saMD: ['SaMD Shonin','Digital Health Approval'],
      },
      {
        region: 'China',
        archetype: 'China',
        keyRegulators: ['National Medical Products Administration'],
        biologics: ['Biologics License Application'],
        pharmaceuticals: ['NDA / ANDA','(CTD format)'],
        medicalDevices: ['Device Registration','Class I – III'],
        saMD: ['SaMD Classification System','Class II–III digital health'],
      },
      {
        region: 'India',
        archetype: 'India',
        keyRegulators: ['Central Drugs Standard Control Organization / DCGI'],
        biologics: ['New Drug Approval (Biologics under NDR 2019)'],
        pharmaceuticals: ['NDA / Generic Approval CTD / ACTD format '],
        medicalDevices: ['MD-7 (Import)', 'MD-9 (Manufacture)', 'MD-14 (Loan Licence)'],
        saMD: ['SaMD under MDR 2017 Class A–D risk-based'],
      },
      {
        region: 'Singapore, Malaysia, Thailand, Philippines, Indonesia',
        archetype: 'ASEAN',
        keyRegulators: [
          'Singapore HSA',
          'Malaysia NPRA',
          'Thailand FDA',
          'Philippines FDA',
          'Indonesia BPOM',
        ],
        biologics: ['ACTD-based Biological Product Submission'],
        pharmaceuticals: ['ACTD / CSDT submission','via ASEAN NRAs'],
        medicalDevices: ['Device Registration (CSDT)','Singapore Class A–D','Device Registration (CSDT)'],
        saMD: ['SaMD via medical device framework','(risk-based, IMDRF aligned)'],
      },
      {
        region: 'Brazil, Mexico',
        archetype: 'Latin America',
        keyRegulators: [
          'Agência Nacional de Vigilância Sanitária (ANVISA)',
          'Federal Commission for Protection against Sanitary Risk (COFEPRIS)',
        ],
        biologics: ['CTD-based Biological Dossier','(ANVISA RDC)'],
        pharmaceuticals: ['NDA-equivalent','CTD / ANVISA format'],
        medicalDevices: ['Device Registration','ANVISA Class I–IV'],
        saMD: ['SaMD treated as medical device','ANVISA digital health guidance'],
      },
      {
        region: 'Saudi Arabia, United Arab Emirates',
        archetype: 'Middle East',
        keyRegulators: ['Saudi Food and Drug Authority (SFDA)', 'UAE MoHAP / DCCU'],
        biologics: ['SFDA / UAE reference pathways','Reliance-based Biological Approval'],
        pharmaceuticals: ['SFDA & UAE MoH pathways','Reliance / Bridging submissions'],
        medicalDevices: ['SFDA Medical Device Regulations','Device Registration'],
        saMD: ['SFDA digital health framework','SaMD via device regulations'],
      },
      {
        region: 'South Africa, Regional Bodies',
        archetype: 'Africa',
        keyRegulators: [
          'South African Health Products Regulatory Authority (SAHPRA)',
          'African Medicines Agency (AMA)',
        ],
        biologics: ['CTD / Reliance Pathway','SAHPRA Biologics Review'],
        pharmaceuticals: ['CTD / SAHPRA NDA','Regional NRA submissions'],
        medicalDevices: ['Device Registration','SAHPRA + Regional NRAs'],
        saMD: ['Limited SaMD frameworks','Device-based classification (emerging)'],
      },
      {
        region: 'Russia, Armenia, Belarus, Kazakhstan, Kyrgyzstan',
        archetype: 'Eurasian Union',
        keyRegulators: ['(Russia, EAEU Secretariat)','EEC / Roszdravnadzor'],
        biologics: ['(CTD-aligned)','EAEU Unified Biologics Dossier'],
        pharmaceuticals: ['CTD-based dossier','EAEU NDA (Unified Registration)'],
        medicalDevices: ['EAEU TR 017/2013','Unified Device Registration'],
        saMD: ['EAEU device classification applicable','Emerging SaMD rules'],
      },
      {
        region: 'Rest of World (RoW)',
        archetype: 'Rest of World (RoW)',
        keyRegulators: ['Smaller National Regulatory Authorities'],
        biologics: ['Reliance Pathways','(WHO PQ / ICH CTD)'],
        pharmaceuticals: ['Generic / CTD submission via national NRAs'],
        medicalDevices: ['Import licence / registration via national NRAs'],
        saMD: ['Device-based classification with IMDRF alignment'],
      },
    ],
  },

  {
    id: 3,
    icon: ShieldAlert,
    title: 'Risk Management System',
    location: 'ISO 14971 / ICH Q9',
    status: 'Essential',
    description: 'Comprehensive risk identification, analysis, and mitigation',
    overview:
      'Implement a comprehensive, lifecycle-spanning Risk Management System aligned with global regulatory standards. Our approach integrates hazard analysis, benefit-risk evaluation, and real-world signal detection to protect patients and ensure regulatory compliance across all product categories.',
    features: [
      'Risk identification & hazard analysis',
      'FMEA, FTA & risk matrix evaluation (ISO 14971 / ICH Q9)',
      'Benefit-risk analysis',
      'Integrated Risk Management File (RMF)',
      'Recall mitigation & FSCA/FSCN management',
      'Post-market risk surveillance & signal detection',
      'CAPA integration',
      'Regulatory compliance & audit readiness',
      'Digital risk traceability',
      'Cybersecurity risk assessment (SaMD)',
      'Usability & human factors risk (Medical Devices / SaMD)',
    ],
    featureDetails: [
      {
        title: 'Risk Identification & Hazard Analysis',
        description:
          'Systematic identification of hazards across design, manufacturing, clinical use, and post-market environments for biologics, pharma, devices, and SaMD.',
      },
      {
        title: 'Risk Assessment & Evaluation',
        description:
          'Quantitative and qualitative risk analysis using FMEA, FTA, and risk matrices aligned with ISO 14971 and ICH Q9.',
      },
      {
        title: 'Benefit-Risk Analysis',
        description:
          'Structured evaluation ensuring benefits outweigh residual risks, supporting regulatory submissions and approvals.',
      },
      {
        title: 'Integrated Risk Management File (RMF)',
        description:
          'End-to-end documentation including Risk Management Plan, Hazard Analysis, Risk Evaluation, and Risk Control Reports.',
      },
      {
        title: 'Recall Mitigation',
        description:
          'Establishing recall SOPs during product development, conducting mock-recall drills, and providing real-time regulatory guidance during Field Safety Corrective Notices (FSCNs) to Field Safety Corrective Actions (FSCAs).',
      },
      {
        title: 'Post-Market Risk Surveillance',
        description:
          'Continuous monitoring of real-world data, adverse events, and complaints to update risk profiles and ensure ongoing compliance.',
      },
      {
        title: 'Signal Detection & Trending',
        description:
          'Identification of emerging risks through data analytics, complaint trends, and pharmacovigilance inputs.',
      },
      {
        title: 'CAPA Integration',
        description:
          'Seamless linkage with Corrective and Preventive Actions to address root causes and prevent recurrence.',
      },
      {
        title: 'Regulatory Compliance & Audit Readiness',
        description:
          'Ensure alignment with global standards (ISO 14971, ICH Q9, IMDRF) and maintain inspection-ready documentation.',
      },
      {
        title: 'Digital Risk Traceability',
        description:
          'End-to-end traceability linking risks to design inputs, clinical data, regulatory submissions, and quality systems.',
      },
      {
        title: 'Cybersecurity Risk Assessment (SaMD)',
        description:
          'Threat modeling, vulnerability assessment, and security risk management per FDA cybersecurity guidance and IEC 81001-5-1.',
      },
      {
        title: 'Usability & Human Factors Risk (Medical Devices / SaMD)',
        description:
          'Risk-based usability engineering per IEC 62366-1 and FDA Human Factors guidance.',
      },
    ],
    benefits: [
      'Risk per ICH Q9 & ICH Q10',
      'Biological hazard ID',
      'Viral safety',
      'Immunogenicity risk',
      "ICH Q9 quality risk management",
      "process FMEA",
      "contamination & impurity risk",
      "ISO 14971 risk management",
      "use FMEA, FTA, HAZOP",
      "Usability (IEC 62366-1)",
      "IMDRF SaMD risk framework",
      "cybersecurity risk (FDA, ENISA)",
      "algorithm bias risk"
    ],
    rating: 4.9,
    reviews: 156,
  },

  {
    id: 4,
    icon: ClipboardCheck,
    title: 'Quality Management System',
    location: 'ISO 13485 / FDA',
    status: 'Essential',
    description: 'Build scalable, compliant, and audit-ready QMS',
    overview:
      'Build a robust, scalable Quality Management System that ensures consistent product quality, regulatory compliance, and operational excellence across the entire product lifecycle. Our QMS framework is designed to align with global regulatory standards while enabling organizations to streamline processes, maintain audit readiness, and drive continuous improvement.',
    features: [
      'eQMS design & implementation (ISO 13485, FDA QMSR, EU MDR, ICH Q10)',
      'Document & records management',
      'Design control & DHF/DMR management',
      'Software lifecycle management (SaMD / IEC 62304)',
      'Change control management',
      'Deviation, nonconformance & CAPA management',
      'Supplier quality management',
      'Training & competency management',
      'Audit management (internal & external)',
      'Complaint handling & vigilance',
      'Process validation & qualification (IQ/OQ/PQ)',
      'Data integrity & 21 CFR Part 11 / ALCOA+ compliance',
      'Continuous improvement & quality metrics',
      'Digital traceability & system integration',
    ],
    featureDetails: [
      {
        title: 'eQuality System Design & Implementation',
        description:
          'Develop and deploy eQMS frameworks aligned with ISO 13485, FDA 21 CFR Part 820 (QMSR), ICH Q10, EU MDR, and CDSCO requirements for all product categories.',
      },
      {
        title: 'Document & Records Management',
        description:
          'Centralized control of SOPs, policies, specifications, and records with version control, approval workflows, and audit trails.',
      },
      {
        title: 'Design Control & DHF/DMR Management',
        description:
          'End-to-end management of Design History Files (DHF) and Device Master Records (DMR), ensuring traceability from user needs to design outputs, verification, and validation.',
      },
      {
        title: 'Software Lifecycle Management (SaMD)',
        description:
          'IEC 62304-compliant software development lifecycle management including SOUP management, configuration control, and software verification & validation.',
      },
      {
        title: 'Change Control Management',
        description:
          'Structured processes to evaluate, approve, and implement changes with impact assessment and regulatory alignment.',
      },
      {
        title: 'Deviation, Nonconformance & CAPA Management',
        description:
          'Identification, investigation, and resolution of quality issues with root cause analysis and effective CAPA implementation.',
      },
      {
        title: 'Supplier Quality Management',
        description:
          'Qualification, auditing, and continuous monitoring of suppliers to ensure compliance and supply chain integrity.',
      },
      {
        title: 'Training & Competency Management',
        description:
          'Track personnel training, qualifications, and competency to ensure compliance with regulatory and internal requirements.',
      },
      {
        title: 'Audit Management (Internal & External)',
        description:
          'Plan, execute, and manage audits with structured reporting, findings tracking, and readiness for regulatory inspections.',
      },
      {
        title: 'Complaint Handling & Vigilance',
        description:
          'Systematic handling of customer complaints, adverse events, and vigilance reporting aligned with regulatory requirements.',
      },
      {
        title: 'Process Validation & Qualification',
        description:
          'Ensure processes are validated (IQ/OQ/PQ) and consistently produce products meeting predefined specifications.',
      },
      {
        title: 'Data Integrity & Electronic Records Compliance',
        description:
          'Ensure compliance with 21 CFR Part 11 and ALCOA+ principles for secure, reliable data management.',
      },
      {
        title: 'Continuous Improvement & Quality Metrics',
        description:
          'KPI-driven monitoring, trend analysis, and management review to drive ongoing quality enhancement.',
      },
      {
        title: 'Digital Traceability & Integration',
        description:
          'Seamless integration with Risk Management, Regulatory, and Clinical systems for end-to-end traceability.',
      },
    ],
    standards: ['ISO 13485', 'FDA 21 CFR Part 820', 'ICH Q10', 'EU MDR', 'CDSCO Schedule M', 'IEC 62304', '21 CFR Part 11', 'ALCOA+'],
benefits: [
  'ICH Q10 PQS',
  'FDA 21 CFR Part 600s',
  'Biologics cGMP',
  'batch release QMS',
  'ICH Q10',
  'FDA 21 CFR Part 211',
  'EU GMP Annex 11',
  'CDSCO Schedule M',
  'ISO 13485',
  'FDA QMSR (21 CFR Part 820)',
  'EU MDR Annex IX/XI',
  'MDR 2017',
  'IEC 62304 software lifecycle',
  'FDA SaMD quality system',
  'ISO 13485 for SaMD organizations',
],
    rating: 5.0,
    reviews: 178,
  },

  {
    id: 5,
    icon: FlaskConical,
    title: 'Clinical Trial Management',
    location: 'Global Clinical Studies',
    status: 'Featured',
    description: 'End-to-end clinical study execution and compliance',
    overview:
      'Design and execute clinical studies that generate robust regulatory evidence. Our clinical and scientific experts guide you through protocol development, study execution, and data analysis to meet regulatory requirements efficiently—across biologics, pharmaceuticals, medical devices, and SaMD.',
    features: [
      'Study design & protocol development',
      'Regulatory & ethics submissions (ICH E6 GCP, FDA, EMA, CDSCO)',
      'Site feasibility & selection',
      'Clinical Trial Management System (CTMS)',
      'Patient recruitment & retention',
      'Risk-based monitoring (RBM) & site management',
      'Data management & EDC integration',
      'Safety & pharmacovigilance integration',
      'Trial Master File (TMF/eTMF) management',
      'Clinical supplies & logistics management',
      'Quality oversight & audit readiness',
      'Data analysis & clinical study reporting (CSR)',
      'SaMD clinical validation studies (AI/ML algorithm validation)',
      'Medical device performance studies (CPSS, PMCF, ISO 14155)',
    ],
    featureDetails: [
      {
        title: 'Study Design & Protocol Development',
        description:
          'Develop scientifically robust study protocols, endpoints, and statistical plans aligned with regulatory expectations and clinical objectives for all product types.',
      },
      {
        title: 'Regulatory & Ethics Submissions',
        description:
          'Preparation and management of submissions to regulatory authorities and ethics committees per ICH E6 GCP, FDA, EMA, and CDSCO requirements.',
      },
      {
        title: 'Site Feasibility & Selection',
        description:
          'Identify and qualify clinical sites based on patient population, infrastructure, investigator expertise, and past performance.',
      },
      {
        title: 'Clinical Trial Management System (CTMS)',
        description:
          'Centralized platform for study tracking, site management, subject enrollment, monitoring activities, and milestone oversight.',
      },
      {
        title: 'Patient Recruitment & Retention',
        description:
          'Strategic planning and execution of patient enrollment with tools to improve engagement, diversity, and retention rates.',
      },
      {
        title: 'Monitoring & Site Management',
        description:
          'Risk-based monitoring (RBM), site visits (on-site/remote), and performance tracking to ensure protocol adherence and data integrity.',
      },
      {
        title: 'Data Management & EDC Integration',
        description:
          'Capture, validate, and manage clinical data using Electronic Data Capture (EDC) systems with real-time data cleaning and query resolution.',
      },
      {
        title: 'Safety & Pharmacovigilance Integration',
        description:
          'Continuous monitoring, reporting, and analysis of adverse events (AEs/SAEs) to ensure patient safety and regulatory compliance.',
      },
      {
        title: 'Trial Master File (TMF/eTMF) Management',
        description:
          'Maintain complete, inspection-ready documentation with full traceability and version control.',
      },
      {
        title: 'Clinical Supplies & Logistics Management',
        description:
          'Planning and tracking of investigational product (IP) supply, storage, distribution, and accountability.',
      },
      {
        title: 'Quality Oversight & Audit Readiness',
        description:
          'Ensure compliance through audits, inspection readiness, and adherence to SOPs and regulatory standards.',
      },
      {
        title: 'Data Analysis & Clinical Study Reporting',
        description:
          'Statistical analysis and preparation of Clinical Study Reports (CSRs) to support regulatory submissions.',
      },
      {
        title: 'SaMD Clinical Validation Studies',
        description:
          'Design and execute real-world performance and validation studies for AI/ML-based software, including algorithm performance benchmarking and reader studies.',
      },
      {
        title: 'Medical Device Performance Studies',
        description:
          'Clinical Performance & Safety Studies (CPSS), Post-Market Clinical Follow-up (PMCF) studies, and clinical evaluation per EU MDR Annex XIV and ISO 14155 GCP for medical devices.',
      },
    ],
    standards: ['ICH E6 GCP', 'ICH E2E', 'FDA CFR', 'EMA Guidelines', 'EU MDR Annex XIV', 'ISO 14155'],
benefits: [
  'Phase I–III trials',
  'biosimilar comparability & PK/PD',
  'immunogenicity studies',
  'Phase I–IV trials',
  'BA/BE studies',
  'Paediatric Investigation Plans (PIP)',
  'Clinical Performance & Safety Studies (CPSS)',
  'PMCF',
  'EU MDR Annex XIV',
  'SaMD clinical validation',
  'real-world performance studies',
  'AI algorithm validation',
],
    rating: 4.8,
    reviews: 89,
  },

  {
    id: 6,
    icon: Eye,
    title: 'Post Market Compliance',
    location: 'Global Markets',
    status: 'Essential',
    description: 'Continuous compliance, vigilance, and safety monitoring',
    overview:
      'Ensure continuous regulatory compliance and patient safety through a robust Post-Market Compliance framework that monitors product performance in real-world use. Our approach integrates vigilance, surveillance, and data analytics to detect safety signals, manage risks, and maintain compliance across global markets—for all product categories.',
    features: [
      'Post-market surveillance (PMS) system',
      'Vigilance & adverse event reporting (FAERS, EudraVigilance)',
      'Signal detection & risk trending',
      'Periodic safety reporting (PSUR, PBRER, PMCF, DSUR)',
      'Complaint handling & investigation',
      'Field Safety Corrective Actions (FSCA) & recalls',
      'Post-Market Clinical Follow-up (PMCF) under EU MDR',
      'SaMD post-market monitoring (AI drift, cybersecurity patches)',
      'Regulatory reporting & global compliance',
      'Risk management integration (ISO 14971)',
      'CAPA & quality system integration',
      'Inspection readiness & audit support',
      'Digital traceability & Real-World Evidence (RWE)',
    ],
    featureDetails: [
      {
        title: 'Post-Market Surveillance (PMS) System',
        description:
          'Continuous collection and evaluation of real-world data, including complaints, adverse events, and performance metrics for all product categories.',
      },
      {
        title: 'Vigilance & Adverse Event Reporting',
        description:
          'Timely detection, assessment, and reporting of adverse events in compliance with global regulations and ICH E2E Pharmacovigilance Planning principles.',
      },
      {
        title: 'Signal Detection & Risk Trending',
        description:
          'Advanced analytics to identify emerging safety signals, trends, and potential product risks.',
      },
      {
        title: 'Periodic Safety Reporting',
        description:
          'Preparation and submission of PSUR, PBRER, PMCF reports, and Annual Reports to regulatory authorities.',
      },
      {
        title: 'Complaint Handling & Investigation',
        description:
          'Structured intake, triage, root cause analysis, and resolution of product complaints with full traceability.',
      },
      {
        title: 'Field Safety Corrective Actions (FSCA) & Recalls',
        description:
          'End-to-end management of safety actions, including recalls, safety notices, and regulatory notifications.',
      },
      {
        title: 'Post-Market Clinical Follow-up (PMCF)',
        description:
          'Ongoing clinical evaluation to confirm safety and performance, particularly for medical devices and SaMD under EU MDR.',
      },
      {
        title: 'SaMD Post-Market Monitoring',
        description:
          'Real-world performance monitoring, AI/ML model drift detection, cybersecurity patch management, and software update reporting.',
      },
      {
        title: 'Regulatory Reporting & Global Compliance',
        description:
          'Ensure adherence to post-market requirements and timelines across all regions and product types.',
      },
      {
        title: 'Integration with Risk Management',
        description:
          'Continuous feedback loop updating the risk management file (ISO 14971) based on post-market data.',
      },
      {
        title: 'CAPA & Quality System Integration',
        description:
          'Link post-market findings with CAPA processes to drive corrective and preventive actions.',
      },
      {
        title: 'Inspection Readiness & Audit Support',
        description:
          'Maintain complete, inspection-ready documentation for regulatory audits and inspections.',
      },
      {
        title: 'Digital Traceability & Real-World Evidence (RWE)',
        description:
          'End-to-end traceability of product performance with integration of real-world data to support regulatory and clinical decisions.',
      },
    ],
    standards: ['ISO 14971', 'ICH E2C', 'ICH E2E', 'EU MDR', 'FDA 21 CFR', 'MAUDE', 'EudraVigilance'],
benefits: [
  'PSUR / PBRER',
  'periodic benefit-risk evaluations',
  'EudraVigilance',
  'biologics complaints',
  'PSUR / PBRER (ICH E2C)',
  'FAERS / EudraVigilance reporting',
  'DSUR',
  'PV inspections',
  'PMCF under EU MDR',
  'MDR / MDV reporting',
  'MAUDE',
  'UDI compliance',
  'FSCA management',
  'Post-market performance monitoring',
  'real-world evidence (RWE)',
  'cybersecurity patch management',
  'AI drift monitoring',
],
    rating: 4.8,
    reviews: 142,
  },

  {
    id: 7,
    icon: Megaphone,
    title: 'Labeling & AdPromo',
    location: 'Global Compliance',
    status: 'Featured',
    description: 'Compliant labeling and promotional material strategy',
    overview:
      'Ensure accurate, compliant, and strategically aligned product communication across labeling and promotional materials. Our approach integrates regulatory intelligence, medical accuracy, and brand strategy to develop and review content that meets global regulatory requirements—across all product categories.',
    features: [
      'Labeling strategy & IFU / prescribing information development',
      'Regulatory labeling compliance (global standards)',
      'Promotional material review (MLR process)',
      'Claims substantiation & scientific review',
      'Advertising & promotional compliance (FDA 21 CFR Part 202)',
      'SaMD labeling & AI/ML transparency statements',
      'UDI / EUDAMED compliance (Medical Devices)',
      'Global labeling harmonization',
      'Artwork & packaging review',
      'Digital & omnichannel promotion compliance',
      'Labeling change management',
      'Translation & localization compliance',
      'Audit trail & documentation',
      'Training & governance framework',
    ],
    featureDetails: [
      {
        title: 'Labeling Strategy & Development',
        description:
          'Creation and optimization of product labeling, including Instructions for Use (IFU), prescribing information, summaries of safety and effectiveness, and device labels.',
      },
      {
        title: 'Regulatory Labeling Compliance',
        description:
          'Ensure alignment with global regulations and standards for content, format, language, and claims across all product categories.',
      },
      {
        title: 'Promotional Material Review (MLR Process)',
        description:
          'Medical, Legal, and Regulatory (MLR) review of advertising and promotional materials to ensure accuracy, balance, and compliance.',
      },
      {
        title: 'Claims Substantiation & Scientific Review',
        description:
          'Verification of all claims against clinical evidence, published literature, and approved labeling.',
      },
      {
        title: 'Advertising & Promotional Compliance',
        description:
          'Ensure adherence to regulations governing promotional practices, including FDA 21 CFR Part 202 and international guidelines.',
      },
      {
        title: 'SaMD Labeling & Transparency Statements',
        description:
          'Regulatory-compliant labeling for AI/ML-based products including intended use, algorithm descriptions, performance metrics, and limitations.',
      },
      {
        title: 'UDI / EUDAMED Compliance (Medical Devices)',
        description:
          'Unique Device Identification (UDI) labeling compliance for the FDA UDI system and EU EUDAMED registration.',
      },
      {
        title: 'Global Labeling Harmonization',
        description:
          'Align labeling content across regions while managing country-specific variations and requirements.',
      },
      {
        title: 'Artwork & Packaging Review',
        description:
          'Compliance review of packaging components, artwork, symbols (ISO 15223), and UDI elements.',
      },
      {
        title: 'Digital & Omnichannel Promotion Compliance',
        description:
          'Review of websites, social media, and digital campaigns to ensure regulatory compliance across channels.',
      },
      {
        title: 'Labeling Change Management',
        description:
          'Structured management of updates to labeling based on regulatory changes, safety updates, or product modifications.',
      },
      {
        title: 'Translation & Localization Compliance',
        description:
          'Ensure accurate translation and cultural adaptation of labeling and promotional content for global markets.',
      },
      {
        title: 'Audit Trail & Documentation',
        description:
          'Maintain complete documentation of review cycles, approvals, and version history for audit readiness.',
      },
      {
        title: 'Training & Governance Framework',
        description:
          'Establish SOPs and training programs for internal teams to ensure consistent and compliant communication practices.',
      },
    ],
    standards: ['FDA 21 CFR Part 202', 'EU MDR Annex I', 'ISO 15223', 'UDI Requirements', 'EUDAMED'],
benefits: [
  'PI / SmPC',
  'biosimilar interchangeability language',
  'carton & container labels',
  'Prescribing Information (PI)',
  'Patient Package Insert',
  '21 CFR Part 202 Ad Promo',
  'IFU',
  'device label',
  'UDI/EUDAMED',
  'symbols (ISO 15223)',
  'EU MDR labeling requirements',
  'SaMD UI/UX labeling',
  'intended use & indications',
  'algorithm transparency statements',
  'cybersecurity disclosure',
],
    rating: 5.0,
    reviews: 94,
  },

  {
    id: 8,
    icon: Handshake,
    title: 'Regulatory Liaison',
    location: 'FDA, EMA, CDSCO',
    status: 'Popular',
    description: 'Strategic communication with regulatory authorities',
    overview:
      'Act as your trusted interface with global regulatory authorities—ensuring clear, timely, and strategic communication throughout the product lifecycle. Our Regulatory Liaison services bridge the gap between your organization and health authorities, facilitating efficient interactions, minimizing delays, and strengthening regulatory confidence in your product.',
    features: [
      'Health authority interaction management (FDA, EMA, CDSCO, PMDA)',
      'Regulatory strategy communication',
      'Pre-submission engagements (pre-IND, pre-IDE, pre-BLA, Q-Sub, INTERACT)',
      'Response to regulatory queries & deficiency letters',
      'Meeting preparation & authority representation',
      'Submission coordination & follow-up',
      'Negotiation & issue resolution',
      'Global regulatory coordination',
      'Commitment tracking & compliance',
      'Inspection & audit facilitation',
      'Regulatory intelligence feedback loop',
      'Documentation & communication traceability',
    ],
    featureDetails: [
      {
        title: 'Health Authority Interaction Management',
        description:
          'Coordinate and manage communications with agencies such as FDA, EMA, CDSCO, PMDA, and other NRAs across pre-submission, submission, and post-approval stages.',
      },
      {
        title: 'Regulatory Strategy Communication',
        description:
          'Translate complex regulatory strategies into clear, structured communications aligned with agency expectations.',
      },
      {
        title: 'Pre-Submission Engagements',
        description:
          'Plan and support scientific advice meetings, pre-IND, pre-IDE, pre-BLA, Q-Sub, INTERACT (EMA), and CDSCO pre-submission interactions.',
      },
      {
        title: 'Response to Regulatory Queries',
        description:
          'Prepare, review, and submit high-quality responses to deficiency letters, information requests, and review questions.',
      },
      {
        title: 'Meeting Preparation & Representation',
        description:
          'Develop briefing documents, presentation materials, and represent clients during regulatory meetings.',
      },
      {
        title: 'Submission Coordination & Follow-Up',
        description:
          'Ensure timely submissions, track review progress, and manage follow-ups with regulatory authorities.',
      },
      {
        title: 'Negotiation & Issue Resolution',
        description:
          'Strategically address regulatory concerns, negotiate requirements, and facilitate resolution of complex issues.',
      },
      {
        title: 'Global Regulatory Coordination',
        description:
          'Harmonize communication across multiple regions to ensure consistent messaging and efficient global approvals.',
      },
      {
        title: 'Commitment Tracking & Compliance',
        description:
          'Monitor post-approval commitments, regulatory conditions, and ensure timely fulfillment.',
      },
      {
        title: 'Inspection & Audit Facilitation',
        description:
          'Act as a liaison during regulatory inspections, ensuring clear communication and efficient resolution of observations.',
      },
      {
        title: 'Regulatory Intelligence Feedback Loop',
        description:
          'Capture insights from agency interactions to refine regulatory strategy and inform future submissions.',
      },
      {
        title: 'Documentation & Communication Traceability',
        description:
          'Maintain comprehensive records of all communications, submissions, and commitments for audit readiness.',
      },
    ],
benefits: [
  'Pre-BLA meetings',
  'Biosimilar Product Development (BPD) meetings',
  'FDA Type A/B/C',
  'Pre-IND meetings',
  'End-of-Phase meetings',
  'INTERACT (EMA)',
  'CDSCO Pre-submission',
  'Pre-Sub Q-Sub (FDA)',
  'MHRA NICE meetings',
  'Notified Body interactions (EU MDR)',
  'Pre-De Novo meetings',
  'AI/ML pre-submission briefings',
  'CDSCO SaMD interactions',
],
    rating: 4.9,
    reviews: 211,
  },

  {
    id: 9,
    icon: LayoutDashboard,
    title: 'Project Management',
    location: 'End-to-End Execution',
    status: 'Essential',
    description: 'Structured execution of regulatory and product lifecycle projects',
    overview:
      'Drive successful product development and regulatory outcomes through structured, transparent, and results-oriented Project Management. Our approach integrates cross-functional coordination, risk-based planning, and milestone-driven execution to ensure projects are delivered on time, within scope, and in full regulatory compliance—across biologics, pharmaceuticals, medical devices, and SaMD.',
    features: [
      'Project planning & governance',
      'Integrated timeline & milestone management',
      'Cross-functional coordination (Regulatory, Clinical, QMS, R&D, Manufacturing)',
      'Resource allocation & capacity planning',
      'Budgeting & cost control',
      'Risk & issue management',
      'Regulatory milestone tracking',
      'Performance monitoring & KPI reporting',
      'Change management & impact assessment',
      'Stakeholder communication & governance',
      'Quality & compliance integration',
      'Digital project traceability',
      'Agile / hybrid project delivery (SaMD)',
    ],
    featureDetails: [
      {
        title: 'Project Planning & Governance',
        description:
          'Define scope, objectives, deliverables, and governance structures with clear roles, responsibilities, and decision frameworks.',
      },
      {
        title: 'Integrated Timeline & Milestone Management',
        description:
          'Develop detailed, dependency-driven project plans aligned with regulatory submissions, clinical studies, and quality activities.',
      },
      {
        title: 'Cross-Functional Coordination',
        description:
          'Seamlessly manage collaboration across Regulatory, Clinical, Quality, R&D, Manufacturing, and external stakeholders.',
      },
      {
        title: 'Resource Allocation & Capacity Planning',
        description:
          'Optimize utilization of internal teams and external partners to ensure efficient project execution.',
      },
      {
        title: 'Budgeting & Cost Control',
        description:
          'Monitor project budgets, forecast expenditures, and ensure financial discipline throughout the project lifecycle.',
      },
      {
        title: 'Risk & Issue Management',
        description:
          'Identify, assess, and mitigate project risks with proactive issue tracking and escalation frameworks.',
      },
      {
        title: 'Regulatory Milestone Tracking',
        description:
          'Monitor key submission timelines, approvals, queries, and commitments across global regulatory authorities.',
      },
      {
        title: 'Performance Monitoring & Reporting',
        description:
          'KPI-driven dashboards, progress reports, and executive summaries to ensure transparency and informed decision-making.',
      },
      {
        title: 'Change Management & Impact Assessment',
        description:
          'Structured evaluation and control of project changes with clear documentation and stakeholder alignment.',
      },
      {
        title: 'Stakeholder Communication & Governance',
        description:
          'Ensure clear, consistent communication with internal teams, leadership, and external partners.',
      },
      {
        title: 'Quality & Compliance Integration',
        description:
          'Align project execution with QMS, Risk Management, and regulatory requirements to ensure audit readiness.',
      },
      {
        title: 'Digital Project Traceability',
        description:
          'End-to-end tracking of tasks, decisions, documents, and deliverables for full transparency and accountability.',
      },
      {
        title: 'Agile / Hybrid Project Delivery (SaMD)',
        description:
          'Agile sprint planning and hybrid project governance adapted for SaMD development cycles and regulatory cadence.',
      },
    ],
benefits: [
  'BLA / biosimilar development timelines',
  'CMC',
  'clinical & regulatory integration',
  'NDA / ANDA project governance',
  'CMC milestones',
  'lifecycle management planning',
  'PMA / 510(k) / CE Mark project plans',
  'design control milestones',
  'V&V scheduling',
  'SaMD release planning',
  'IEC 62304 sprint governance',
  'AI/ML model iteration tracking',
],
    rating: 4.9,
    reviews: 150,
  },
]

const industries = [
   { name: 'Biologics', icon: FlaskConical },
  { name: 'Medical Devices', icon: Cpu },
  { name: 'Pharmaceuticals', icon: Pill },
  { name: 'Software as Medical Device', icon: Monitor },
]

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(services[0])
  const [expandedAccordionId, setExpandedAccordionId] = useState<number | null>(services[0].id)
  const [pendingScrollId, setPendingScrollId] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const accordionHeaderRefs = useRef<Record<number, HTMLButtonElement | null>>({})

  useLayoutEffect(() => {
    if (pendingScrollId === null) return
    const el = accordionHeaderRefs.current[pendingScrollId]
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo(0, top)
    }
    setPendingScrollId(null)
  }, [pendingScrollId])

  const handleAccordionClick = useCallback((serviceId: number) => {
    setPendingScrollId(serviceId)
    setExpandedAccordionId(prev => prev === serviceId ? null : serviceId)
  }, [])
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Featured':
        return 'bg-accent/20 text-accent-foreground'
      case 'Popular':
        return 'bg-primary/10 text-primary'
      case 'Essential':
        return 'bg-blue-500/10 text-blue-600'
      default:
        return 'bg-secondary text-secondary-foreground'
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-screen">

      {/* Hero Section */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="pt-40 pb-20 px-6 relative overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance">
              {'Comprehensive '}
              <span className="text-accent">{'Regulatory'}</span>
              {' Services'}
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
              {'End-to-end solutions for navigating the global regulatory landscape'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong rounded-[2rem] p-8 md:p-12 max-w-6xl mx-auto"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-center">
              {'Industries We Serve'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {industries.map((industry, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-background/50 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <industry.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="font-medium text-sm">{industry.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Master-Detail Services Section */}
      <section className="pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInView className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-balance">
              {'Featured Services'}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              {'Explore our comprehensive portfolio of regulatory solutions'}
            </p>
          </FadeInView>

          <div className="grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
            {/* Desktop Sidebar - Services List (Hidden on mobile, Sticky on desktop) */}
            <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-32 w-full">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-2 md:space-y-3"
              >
                {services.map((service, idx) => {
                  const isActive = selectedService.id === service.id
                  return (
                    <motion.button
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedService(service)}
                      className={`w-full text-left p-3 md:p-4 rounded-2xl transition-all ${
                        isActive 
                          ? 'glass-strong shadow-lg border-2 border-accent/30' 
                          : 'glass hover:glass-strong'
                      }`}
                    >
                      <div className="flex items-start gap-2 md:gap-3 mb-2">
                        <div className={`w-9 md:w-10 h-9 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-accent/20' : 'bg-primary/10'
                        }`}>
                          <service.icon className={`w-4 md:w-5 h-4 md:h-5 ${
                            isActive ? 'text-accent-foreground' : 'text-primary'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-xs md:text-sm mb-1">{service.title}</h3>
                          <p className="text-xs text-muted-foreground mb-1 line-clamp-1"></p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            getStatusColor(service.status)
                          }`}>
                            {service.status}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </motion.div>
            </div>

            {/* Mobile Accordion - Services List (Visible only on mobile) */}
            <div className="lg:hidden w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-3"
              >
                {services.map((service, idx) => {
                  const isExpanded = expandedAccordionId === service.id
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="overflow-hidden"
                    >
                      {/* Accordion Header */}
                      <motion.button
                        ref={(el) => { accordionHeaderRefs.current[service.id] = el }}
                        onClick={() => handleAccordionClick(service.id)}
                        whileHover={{ scale: isExpanded ? 1 : 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left p-4 rounded-xl transition-all flex items-center justify-between ${
                          isExpanded
                            ? 'glass-strong shadow-lg border-2 border-accent/30 bg-accent/5 rounded-b-none'
                            : 'glass hover:glass-strong border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isExpanded ? 'bg-accent/20' : 'bg-primary/10'
                          }`}>
                            <service.icon className={`w-5 h-5 ${
                              isExpanded ? 'text-accent-foreground' : 'text-primary'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display font-bold text-sm mb-1 truncate">{service.title}</h3>
                            <div>
                                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-medium ${
                                  getStatusColor(service.status)
                                }`}>
                                  {service.status}
                                </span>
                              </div>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-2 flex-shrink-0"
                        >
                          <ChevronDown className={`w-5 h-5 transition-colors ${
                            isExpanded ? 'text-accent' : 'text-muted-foreground'
                          }`} />
                        </motion.div>
                      </motion.button>

                      {/* Accordion Content - Full Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden glass-strong rounded-b-xl border-2 border-t-0 border-accent/30"
                          >
                            <div className="p-4 space-y-4">
                              {/* Status */}
                              <div>
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                                  getStatusColor(service.status)
                                }`}>
                                  {service.status}
                                </span>
                              </div>

                              {/* Overview */}
                              <div>
                                <h4 className="font-display font-bold text-xs mb-2">Overview</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">{service.overview}</p>
                              </div>



                              {/* Key Features - Mobile */}
                              <div>
                                <h4 className="font-display font-bold text-xs mb-2">Key Features</h4>
                                {service.id === 2 && service.regulatoryMatrix ? (
                                  <div className="space-y-2">
                                    {service.regulatoryMatrix.map((row, idx) => (
                                      <div key={idx} className="glass rounded-xl p-3 border border-border/30">
                                        <div className="mb-2">
                                          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Key Regulators</p>
                                          <div className="flex flex-wrap gap-1">
                                            {row.keyRegulators.map((r, i) => (
                                              <span key={i} className="inline-block bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[9px] leading-tight font-medium">{r}</span>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/30">
                                          <div>
                                            <p className="text-[9px] text-muted-foreground font-semibold mb-0.5">Biologics</p>
                                            <div className="flex flex-wrap gap-0.5">
                                              {row.biologics.map((b, i) => (
                                                <span key={i} className="inline-block bg-accent/10 rounded px-1 py-0.5 text-[9px] leading-tight">{b}</span>
                                              ))}
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-[9px] text-muted-foreground font-semibold mb-0.5">Pharma</p>
                                            <div className="flex flex-wrap gap-0.5">
                                              {row.pharmaceuticals.map((p, i) => (
                                                <span key={i} className="inline-block bg-accent/10 rounded px-1 py-0.5 text-[9px] leading-tight">{p}</span>
                                              ))}
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-[9px] text-muted-foreground font-semibold mb-0.5">Devices</p>
                                            <div className="flex flex-wrap gap-0.5">
                                              {row.medicalDevices.map((d, i) => (
                                                <span key={i} className="inline-block bg-accent/10 rounded px-1 py-0.5 text-[9px] leading-tight">{d}</span>
                                              ))}
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-[9px] text-muted-foreground font-semibold mb-0.5">SaMD</p>
                                            <div className="flex flex-wrap gap-0.5">
                                              {row.saMD.map((s, i) => (
                                                <span key={i} className="inline-block bg-accent/10 rounded px-1 py-0.5 text-[9px] leading-tight">{s}</span>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="space-y-2">
<ul className="list-disc pl-5 space-y-2 marker:text-accent">
  {service.benefits.map((benefit, i) => (
    <motion.li
      key={i}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="text-xs md:text-sm text-muted-foreground font-medium leading-snug"
    >
      {benefit}
    </motion.li>
  ))}
</ul>
                                  </div>
                                )}
                              </div>
                              {/* Feature Details - Mobile */}
                              {service.featureDetails && service.featureDetails.length > 0 && (
                                <div>
                                  <h4 className="font-display font-bold text-xs mb-2">Service Features</h4>
                                  <div className="space-y-2">
                                    {service.featureDetails.map((detail, i) => (
                                      <div key={i} className="glass rounded-lg p-2.5 border border-border/30">
                                        <p className="text-[10px] font-semibold text-accent mb-0.5">{detail.title}</p>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed">{detail.description}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* CTA Buttons */}
                              <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                                <Button size="sm" className="rounded-lg text-xs w-full" asChild>
                                  <Link href="/contact">
                                    Request Consultation
                                  </Link>
                                </Button>
                                <Button size="sm" variant="outline" className="rounded-lg text-xs w-full glass bg-transparent" asChild>
                                  <Link href="/resources">
                                    View Resources
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>

            {/* Right Panel - Service Features (Desktop only) */}
            <div className="hidden lg:block lg:col-span-9 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedService.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-strong rounded-2xl md:rounded-[2rem] overflow-hidden"
                >
                  {/* Header with gradient */}
                  <div className="relative h-40 md:h-48 lg:h-64 bg-gradient-to-br from-accent/20 via-primary/10 to-accent/10 p-6 md:p-8 lg:p-12 flex flex-col justify-end overflow-hidden">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear"
                      }}
                      className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 rounded-full bg-accent/20 blur-3xl"
                    />
                    <div className="relative z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-12 md:w-16 lg:w-20 h-12 md:h-16 lg:h-20 rounded-2xl bg-background/90 backdrop-blur-sm flex items-center justify-center mb-3 md:mb-4 shadow-xl"
                      >
                        <selectedService.icon className="w-6 md:w-8 lg:w-10 h-6 md:h-8 lg:h-10 text-accent-foreground" />
                      </motion.div>
                      <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{selectedService.title}</h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-8 lg:p-12 space-y-6 md:space-y-8">
                    <div>
                      <h3 className="font-display text-lg md:text-xl font-bold mb-2 md:mb-3">Overview</h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{selectedService.overview}</p>
                    </div>
                    {/* Key Features - Desktop */}
                    <div>
                      <h3 className="font-display text-lg md:text-xl font-bold mb-3 md:mb-4">Key Features</h3>
                      {selectedService.id === 2 && selectedService.regulatoryMatrix ? (
                        <div className="overflow-x-auto rounded-xl border border-border/50">
                          <table className="w-full text-xs md:text-sm" style={{ tableLayout: 'fixed' }}>
                            <colgroup>
                              <col style={{ width: '35%' }} />
                              <col style={{ width: '11%' }} />
                              <col style={{ width: '11%' }} />
                              <col style={{ width: '14%' }} />
                              <col style={{ width: '12%' }} />
                              <col style={{ width: '11%' }} />
                            </colgroup>
                            <thead>
                              <tr className="bg-accent/10 border-b border-border/50">
                                <th className="text-left p-3 font-semibold text-muted-foreground" style={{ minWidth: '200px' }}>Key Regulators</th>
                                <th className="text-left p-3 font-semibold text-muted-foreground whitespace-nowrap">Region</th>
                                <th className="text-left p-3 font-semibold text-muted-foreground whitespace-nowrap">Biologic</th>
                                <th className="text-left p-3 font-semibold text-muted-foreground whitespace-nowrap">Pharmaceutical</th>
                                <th className="text-left p-3 font-semibold text-muted-foreground whitespace-nowrap">Medical Device
</th>
                                <th className="text-left p-3 font-semibold text-muted-foreground whitespace-nowrap">SaMD</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedService.regulatoryMatrix.map((row, idx) => (
                                <motion.tr
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.04 }}
                                  className="border-b border-border/30 hover:bg-accent/5 transition-colors"
                                >
                                  <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                      {row.keyRegulators.map((r, i) => (
                                        <span key={i} className="inline-block bg-primary/10 rounded-md px-1.5 py-0.5 text-[10px] leading-tight">{r}</span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-3 font-semibold text-foreground text-[11px] break-words leading-snug">{row.region}</td>
                                  <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                      {row.biologics.map((b, i) => (
                                        <span key={i} className="inline-block bg-accent/10 rounded-md px-1.5 py-0.5 text-[10px] leading-tight">{b}</span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                      {row.pharmaceuticals.map((p, i) => (
                                        <span key={i} className="inline-block bg-accent/10 rounded-md px-1.5 py-0.5 text-[10px] leading-tight">{p}</span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                      {row.medicalDevices.map((d, i) => (
                                        <span key={i} className="inline-block bg-accent/10 rounded-md px-1.5 py-0.5 text-[10px] leading-tight">{d}</span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                      {row.saMD.map((s, i) => (
                                        <span key={i} className="inline-block bg-accent/10 rounded-md px-1.5 py-0.5 text-[10px] leading-tight">{s}</span>
                                      ))}
                                    </div>
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
<div className="flex flex-wrap gap-2 md:gap-3">
  {selectedService.benefits.map((benefit, idx) => (
    <motion.span
      key={idx}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="px-3 py-1 rounded-full text-xs md:text-sm font-semibold 
                 bg-accent/15 text-accent border border-accent/20 
                 uppercase tracking-wider whitespace-nowrap"
    >
      {benefit}
    </motion.span>
  ))}
</div>
                      )}
                    </div>

                    {/* Service Features - Desktop */}
                    {(selectedService as any).featureDetails && (selectedService as any).featureDetails.length > 0 && (
                      <div>
                        <h3 className="font-display text-lg md:text-xl font-bold mb-3 md:mb-4">Service Features</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {(selectedService as any).featureDetails.map((detail: { title: string; description: string }, idx: number) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.04 }}
                              className="glass rounded-xl p-4 border border-border/30 hover:border-accent/30 transition-colors"
                            >
                              <p className="text-xs md:text-sm font-semibold text-accent mb-1">{detail.title}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{detail.description}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
<div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-border/50">
  
  <Button
    size="lg"
    className="rounded-full px-6 md:px-8 flex-1 w-full text-sm md:text-base"
    asChild
  >
    <Link href="/contact">
      {'Request Consultation'}
    </Link>
  </Button>

  <Button
    size="lg"
    variant="outline"
    className="rounded-full px-6 md:px-8 flex-1 w-full glass bg-transparent text-sm md:text-base"
    asChild
  >
    <Link href="/resources">
      {'View Resources'}
    </Link>
  </Button>

</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 md:px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <ZoomScroll>
            <motion.div className="glass-strong rounded-2xl md:rounded-[3rem] p-8 md:p-12 lg:p-16">
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-balance">
                {'Ready to Get Started?'}
              </h2>
              <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-10 text-balance">
                {'Let us design a regulatory success tailored to your unique needs'}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                <Button size="lg" className="rounded-full text-sm md:text-base px-6 md:px-8 w-full sm:w-auto" asChild>
                  <Link href="/contact">
                    {'Request Consultation'}
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
