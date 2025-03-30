'use client';
import { useMemo } from 'react';
import { motion } from 'motion/react';

export default function ColourfulText({ text }: { text: string }) {
  // Use useMemo to ensure colors are only shuffled once when component mounts
  const colorAssignments = useMemo(() => {
    const colors = [
      'rgb(131, 179, 32)',
      'rgb(47, 195, 106)',
      'rgb(42, 169, 210)',
      'rgb(4, 112, 202)',
      'rgb(107, 10, 255)',
      'rgb(183, 0, 218)',
      'rgb(218, 0, 171)',
      'rgb(230, 64, 92)',
      'rgb(232, 98, 63)',
      'rgb(249, 129, 47)',
    ];

    // Shuffle the colors once
    const shuffled = [...colors].sort(() => Math.random() - 0.5);

    // Create color assignments for each character
    return text.split('').map((char, index) => ({
      char,
      color: shuffled[index % shuffled.length],
    }));
  }, [text]); // Only recalculate if text changes

  return (
    <>
      {colorAssignments.map((item, index) => (
        <motion.span
          key={`${item.char}-${index}`}
          style={{
            color: item.color,
          }}
          animate={{
            y: [0, -3, 0],
            scale: [1, 1.01, 1],
            filter: ['blur(0px)', `blur(1px)`, 'blur(0px)'],
            opacity: [1, 0.9, 1],
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
            repeat: 0, // Only animate once
          }}
          className="inline-block whitespace-pre font-sans tracking-tight"
        >
          {item.char}
        </motion.span>
      ))}
    </>
  );
}
