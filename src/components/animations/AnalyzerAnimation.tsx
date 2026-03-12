"use client";

import { motion } from "framer-motion";
import { MethodStep } from "@/data/types";

interface Props {
  steps: MethodStep[];
  currentStep: number;
}

export default function AnalyzerAnimation({ steps, currentStep }: Props) {
  return (
    <div className="relative w-full h-80 bg-gradient-to-b from-blue-50 to-white rounded-xl border border-blue-100 overflow-hidden">
      <svg viewBox="0 0 500 300" className="w-full h-full">
        {/* Analyzer body */}
        <motion.rect
          x="150" y="60" width="200" height="180" rx="12"
          fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"
          animate={{ opacity: currentStep >= 1 ? 1 : 0.4 }}
        />
        {/* Screen */}
        <motion.rect
          x="175" y="80" width="100" height="60" rx="4"
          fill={currentStep >= 3 ? "#22c55e" : "#1e293b"}
          animate={{ fill: currentStep >= 3 ? "#22c55e" : "#1e293b" }}
          transition={{ duration: 0.5 }}
        />
        {/* Screen text */}
        <motion.text
          x="225" y="115" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace"
          animate={{ opacity: currentStep >= 3 ? 1 : 0.3 }}
        >
          {currentStep >= 4 ? "ГОТОВО" : currentStep >= 3 ? "АНАЛИЗ..." : "ОЖИДАНИЕ"}
        </motion.text>
        {/* Sample slot */}
        <motion.rect
          x="300" y="100" width="30" height="80" rx="4"
          fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"
        />
        {/* Test tube */}
        <motion.g
          animate={{
            y: currentStep >= 1 ? 0 : -40,
            opacity: currentStep >= 0 ? 1 : 0,
          }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <rect x="305" y={currentStep >= 1 ? "105" : "60"} width="20" height="50" rx="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
          <rect x="305" y={currentStep >= 1 ? "105" : "60"} width="20" height="8" rx="2" fill="#7c3aed" />
          {/* Blood in tube */}
          <rect x="307" y={currentStep >= 1 ? "125" : "80"} width="16" height="28" rx="2" fill="#dc2626" opacity="0.8" />
        </motion.g>
        {/* Progress dots */}
        {steps.map((_, i) => (
          <motion.circle
            key={i}
            cx={200 + i * 25}
            cy="210"
            r="6"
            fill={i <= currentStep ? "#3b82f6" : "#e2e8f0"}
            animate={{ scale: i === currentStep ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.5, repeat: i === currentStep ? Infinity : 0, repeatDelay: 1 }}
          />
        ))}
        {/* Arrows showing flow */}
        <motion.path
          d="M 100 150 L 145 150"
          stroke="#3b82f6" strokeWidth="2" fill="none" markerEnd="url(#arrow)"
          animate={{ opacity: currentStep >= 0 ? 1 : 0.2 }}
        />
        <motion.path
          d="M 355 150 L 400 150"
          stroke="#22c55e" strokeWidth="2" fill="none" markerEnd="url(#arrow-green)"
          animate={{ opacity: currentStep >= 4 ? 1 : 0.2 }}
        />
        {/* Arrow markers */}
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
          <marker id="arrow-green" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
          </marker>
        </defs>
        {/* Labels */}
        <text x="80" y="170" textAnchor="middle" fill="#64748b" fontSize="9">Проба</text>
        <text x="420" y="170" textAnchor="middle" fill="#64748b" fontSize="9">Результат</text>
        <text x="250" y="50" textAnchor="middle" fill="#4f46e5" fontSize="12" fontWeight="bold">Гематологический анализатор</text>
      </svg>
    </div>
  );
}
