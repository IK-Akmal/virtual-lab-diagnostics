"use client";

import { motion } from "framer-motion";
import { MethodStep } from "@/data/types";

interface Props {
  steps: MethodStep[];
  currentStep: number;
}

export default function MicroscopeAnimation({ steps, currentStep }: Props) {
  return (
    <div className="relative w-full h-80 bg-gradient-to-b from-purple-50 to-white rounded-xl border border-purple-100 overflow-hidden">
      <svg viewBox="0 0 500 300" className="w-full h-full">
        <text x="250" y="25" textAnchor="middle" fill="#7c3aed" fontSize="12" fontWeight="bold">Микроскопическое исследование</text>

        {/* Microscope body */}
        <rect x="200" y="60" width="100" height="180" rx="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
        {/* Eyepiece */}
        <rect x="230" y="40" width="40" height="30" rx="4" fill="#64748b" />
        <ellipse cx="250" cy="38" rx="15" ry="5" fill="#475569" />
        {/* Objective */}
        <rect x="235" y="175" width="30" height="25" rx="3" fill="#475569" />
        {/* Stage */}
        <rect x="170" y="200" width="160" height="10" rx="2" fill="#94a3b8" />
        {/* Base */}
        <rect x="180" y="230" width="140" height="15" rx="4" fill="#64748b" />

        {/* Slide on stage */}
        <motion.rect
          x="195" y="190" width="110" height="12" rx="2"
          fill="#bfdbfe" stroke="#60a5fa" strokeWidth="1"
          animate={{ opacity: currentStep >= 1 ? 1 : 0.3 }}
        />

        {/* View circle (what you see through microscope) */}
        <motion.g animate={{ opacity: currentStep >= 4 ? 1 : 0 }}>
          <circle cx="400" cy="140" r="70" fill="#fefce8" stroke="#a855f7" strokeWidth="2" />
          {/* Blood cells in view */}
          {currentStep >= 4 && Array.from({ length: 15 }).map((_, i) => {
            const cx = 370 + (i % 5) * 15;
            const cy = 110 + Math.floor(i / 5) * 20;
            const isTarget = i % 3 === 0;
            return (
              <motion.circle
                key={i}
                cx={cx} cy={cy} r={isTarget ? 5 : 4}
                fill={isTarget ? "#7c3aed" : "#fca5a5"}
                stroke={isTarget ? "#5b21b6" : "#ef4444"}
                strokeWidth="0.5"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              />
            );
          })}
          <text x="400" y="225" textAnchor="middle" fill="#7c3aed" fontSize="8">×1000 (иммерсия)</text>
        </motion.g>

        {/* Staining bottle */}
        {currentStep >= 2 && currentStep <= 3 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x="60" y="100" width="25" height="50" rx="4" fill="#c084fc" stroke="#a855f7" strokeWidth="1" />
            <rect x="65" y="95" width="15" height="10" rx="2" fill="#7c3aed" />
            <text x="72" y="170" textAnchor="middle" fill="#7c3aed" fontSize="7">Краситель</text>
          </motion.g>
        )}

        {/* Step indicators */}
        {steps.map((_, i) => (
          <motion.circle
            key={i}
            cx={180 + i * 25}
            cy="275"
            r="6"
            fill={i <= currentStep ? "#a855f7" : "#e2e8f0"}
            animate={{ scale: i === currentStep ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.5, repeat: i === currentStep ? Infinity : 0, repeatDelay: 1 }}
          />
        ))}
      </svg>
    </div>
  );
}
