import { motion } from "motion/react";
import { Bot } from "lucide-react";

import { PageLayout } from "../components/common/PageLayout";
import { PageHeader } from "../components/common/PageHeader";
import { ChatInterface } from "../components/common/ChatInterface";

const VirtualCounselPage = () => {
  return (
    <PageLayout sectionTitle="Virtual Counsel" className="pb-0" fixedHeight>
      <PageHeader
        icon={Bot}
        tag="Virtual Counsel"
        title="Your Personal"
        highlightedTitle="Legal Assistant."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grow flex flex-col min-h-0 pb-6"
      >
        <ChatInterface
          context="General Legal Advisor"
          placeholder="Ask about Indian law, procedures, or definitions..."
          suggestions={[
            "What is anticipatory bail?",
            "Difference between FIR and Charge Sheet?",
            "How to file a consumer complaint?",
            "Explain 'Force Majeure' in simple terms.",
            "What are the rights of an arrested person?",
          ]}
          className="h-full shadow-xl border-stone-200"
          initialMessages={[
            {
              id: "welcome-1",
              role: "assistant",
              text: "Hello! I am your Virtual Counsel. I can help you understand Indian legal procedures, define complex terms, or guide you through preliminary compliance steps. How may I assist you today?",
              timestamp: new Date(),
            },
          ]}
        />
      </motion.div>
    </PageLayout>
  );
};

export default VirtualCounselPage;
