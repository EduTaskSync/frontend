import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'framer-motion';

interface AuroraLoadingStateProps {
  heading: string;
  subheading: string;
}

export const AuroraLoadingState = ({ heading, subheading }: AuroraLoadingStateProps) => {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">{heading}</div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">{subheading}</div>
      </motion.div>
    </AuroraBackground>
  );
};
