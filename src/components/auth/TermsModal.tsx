import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-ivory w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-charcoal/10 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-20">
              <div>
                <h2 className="font-serif text-2xl font-bold text-charcoal">Terms & Conditions</h2>
                <p className="text-xs text-charcoal/60 font-sans tracking-wider mt-1">LAST UPDATED: JANUARY 2026</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-charcoal/5 rounded-full transition-colors cursor-pointer text-charcoal/60 hover:text-charcoal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto font-sans text-charcoal/80 leading-relaxed text-sm space-y-6 scrollbar-thin">
              <p className="font-medium">
                Welcome to JURIBOT. Please read these Terms & Conditions (“Terms”) carefully before using the JURIBOT platform (“Service”).
                By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, you must not use the Service.
              </p>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">1. ABOUT JURIBOT</h3>
                <p className="mb-2">JURIBOT is an AI-assisted platform designed to help users:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Understand legal documents in simple language</li>
                  <li>Ask legal queries for clarity and general knowledge</li>
                  <li>Explore case trends and legal patterns</li>
                  <li>Access cost projections for planning and insight</li>
                  <li>Use multilingual interfaces for accessibility</li>
                </ul>
                <p className="mt-2 text-charcoal/60 italic">The Service is offered for informational and educational purposes and is not a replacement for professional legal services.</p>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">2. NO LEGAL ADVICE / NO LAWYER-CLIENT RELATIONSHIP</h3>
                <p className="mb-2 font-bold">JURIBOT:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>Is not a law firm</li>
                  <li>Does not provide legal advice</li>
                  <li>Does not represent users in any legal capacity</li>
                  <li>Does not create a lawyer-client relationship</li>
                </ul>
                <p className="mb-2 font-bold">All outputs provided by the Service (“Outputs”) are:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>Informational</li>
                  <li>Non-binding</li>
                  <li>Not guaranteed to be accurate or complete</li>
                </ul>
                <p className="mb-2">Users should consult licensed legal professionals for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Legal advice</li>
                  <li>Legal filings</li>
                  <li>Representation</li>
                  <li>Case strategy</li>
                  <li>Dispute resolution</li>
                </ul>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">3. ELIGIBILITY</h3>
                <p>To use the Service, you must:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Be at least 18 years old</li>
                  <li>Have legal capacity to enter into agreements</li>
                  <li>Agree to these Terms and related policies</li>
                </ul>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">4. USER CONTENT</h3>
                <p>“User Content” includes documents, case descriptions, chat queries, cost data, and other information submitted through the Service.</p>
                <p className="mt-2 font-bold">Users are solely responsible for:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2 mb-4">
                  <li>Accuracy of User Content</li>
                  <li>Legality of User Content</li>
                  <li>Confidentiality of User Content</li>
                  <li>Compliance with applicable laws</li>
                </ul>
                <p className="font-bold">Users must not upload:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Classified or sealed documents</li>
                  <li>Data protected by court order</li>
                  <li>Confidential government information</li>
                  <li>Healthcare records (PHI)</li>
                  <li>Information belonging to third parties without authorization</li>
                </ul>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">5. ZERO DATA RETENTION POLICY</h3>
                <p>JURIBOT is designed with a zero-retention, privacy-first architecture. Specifically:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2 mb-4">
                  <li>No uploaded documents are stored</li>
                  <li>No chat history is stored</li>
                  <li>No cost projection inputs are stored</li>
                  <li>No case details are stored</li>
                  <li>No personal profiles are generated</li>
                  <li>No behavioral analytics are stored</li>
                  <li>No third-party data brokerage or advertising occurs</li>
                </ul>
                <p>When a session ends or the user exits the interface, User Content becomes irretrievable. The Service does not support history restoration or data recovery.</p>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">6. NO TRAINING OR MODEL REUSE (BY DEFAULT)</h3>
                <p>User Content is not used for model training, dataset creation, evaluation, embedding repositories, or behavioral profiling unless the user provides explicit informed consent (if introduced in future versions).</p>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">7. TEMPORARY PROCESSING ONLY</h3>
                <p>All processing of User Content occurs in-memory solely for generating on-screen Outputs. No permanent write operations occur unless explicitly requested via future optional features.</p>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">8. THIRD-PARTY SERVICES & INTEGRATIONS</h3>
                <p>If third-party libraries or APIs are integrated, JURIBOT is not responsible for availability, security, updates, or data handling policies. Users may be bound by third-party terms where applicable.</p>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">9. PROHIBITED USES</h3>
                <p>Users must not:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Misuse the Service for illegal purposes</li>
                  <li>Use Outputs to provide unlicensed legal advice</li>
                  <li>Misrepresent the Service as legal counsel</li>
                  <li>Upload malicious files, malware, or harmful content</li>
                  <li>Attempt to reverse-engineer, extract, or replicate system behavior</li>
                  <li>Use the platform for commercial legal service delivery without proper licensing</li>
                </ul>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">10. ACCURACY LIMITATIONS</h3>
                <p>Due to the nature of AI systems:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Outputs may be incorrect, incomplete, outdated, or misinterpreted</li>
                  <li>Legal documents may vary in structure and meaning</li>
                  <li>Historical cases may not predict outcomes accurately</li>
                  <li>Cost estimates are indicative and non-binding</li>
                  <li>Translations may not reflect legally accurate phrasing</li>
                </ul>
                <p className="mt-2 font-bold">Users rely on Outputs at their own discretion and risk.</p>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">11. PAYMENTS & FEES (IF INTRODUCED)</h3>
                <p>If JURIBOT introduces paid plans, subscription terms will specify fees, billing cycles, refunds, cancellation, and taxes. Free-tier users may have feature limitations.</p>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">12. INTELLECTUAL PROPERTY</h3>
                <p>All platform materials (Software, UI/UX, Algorithms, Logos, etc.) are owned or licensed by JURIBOT.</p>
                <p className="mt-2">Users may not copy, modify, distribute, sell, reverse-engineer, scrape, or create derivative works without written permission.</p>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">13. INDEMNIFICATION</h3>
                <p>Users agree to indemnify and hold harmless JURIBOT from claims arising out of misuse of the Service, violation of these Terms, unlawful use of Outputs, or unauthorized legal service delivery.</p>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">14. LIMITATION OF LIABILITY</h3>
                <p>To the maximum extent permitted by law, JURIBOT shall not be liable for indirect damages, special damages, consequential damages, loss of data, loss of business, or loss of profits. Total liability shall not exceed fees paid in the prior 6 months or ₹0 for free users.</p>
              </section>

               <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">15. TERMINATION</h3>
                <p>JURIBOT may suspend or terminate access for terms violations, misuse, due to legal requirements, or at its discretion. Users may stop using the Service at any time.</p>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">16. GOVERNING LAW & JURISDICTION</h3>
                <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in [Insert City, India].</p>
              </section>

              <section>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">17. AMENDMENTS</h3>
                <p>JURIBOT may modify these Terms at any time. Continued use constitutes acceptance of revised Terms.</p>
              </section>
            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-charcoal/10 bg-ivory/50">
              <button
                onClick={onAccept}
                className="w-full bg-charcoal text-ivory py-3 rounded-lg font-medium hover:bg-coffee transition-colors tracking-wide text-sm cursor-pointer"
              >
                I UNDERSTAND
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
