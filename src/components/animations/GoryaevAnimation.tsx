"use client";

import { motion } from "framer-motion";
import { MethodStep } from "@/data/types";

interface Props {
  steps: MethodStep[];
  currentStep: number;
}

export default function GoryaevAnimation({ steps, currentStep }: Props) {
  return (
    <div className="relative w-full h-80 bg-gradient-to-b from-amber-50 to-white rounded-xl border border-amber-100 overflow-hidden">
      <svg viewBox="0 0 500 300" className="w-full h-full">
        {/* Title */}
        <text
          x="250"
          y="25"
          textAnchor="middle"
          fill="#92400e"
          fontSize="12"
          fontWeight="bold"
        >
          Камера Горяева
        </text>

        {/* Chamber base */}
        <motion.rect
          x="150"
          y="50"
          width="200"
          height="120"
          rx="4"
          fill="#fef3c7"
          stroke="#d97706"
          strokeWidth="2"
          animate={{ opacity: currentStep >= 2 ? 1 : 0.5 }}
        />

        {/* Grid lines */}
        {currentStep >= 2 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1="170"
                y1={70 + i * 20}
                x2="330"
                y2={70 + i * 20}
                stroke="#d97706"
                strokeWidth="0.5"
                opacity="0.5"
              />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={170 + i * 20}
                y1="50"
                x2={170 + i * 20}
                y2="170"
                stroke="#d97706"
                strokeWidth="0.5"
                opacity="0.5"
              />
            ))}
          </motion.g>
        )}

        {/* Diagonal counting squares (highlighted) */}
        {currentStep >= 4 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.rect
                key={i}
                x={170 + i * 30}
                y={55 + i * 20}
                width="20"
                height="20"
                fill="#3b82f6"
                opacity="0.3"
                rx="2"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.g>
        )}

        {/* Red blood cells in chamber */}
        {currentStep >= 3 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.circle
                key={i}
                cx={180 + (i % 8) * 20 + ((i * 7) % 10)}
                cy={60 + Math.floor(i / 8) * 25 + ((i * 3) % 10)}
                r="3"
                fill="#dc2626"
                opacity="0.7"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.03 }}
              />
            ))}
          </motion.g>
        )}

        {/* Coverslip */}
        <motion.rect
          x="145"
          y="45"
          width="210"
          height="130"
          rx="4"
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="1.5"
          strokeDasharray="5,3"
          animate={{ opacity: currentStep >= 2 ? 1 : 0 }}
        />
        {currentStep >= 2 && (
          <text x="250" y="42" textAnchor="middle" fill="#0ea5e9" fontSize="8">
            Покровное стекло
          </text>
        )}

        {/* Pipette */}
        {currentStep >= 2 && currentStep < 4 && (
          <motion.g
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <rect x="355" y="70" width="8" height="60" rx="2" fill="#94a3b8" />
            <motion.rect
              x="357"
              y="100"
              width="4"
              height="25"
              fill="#dc2626"
              opacity="0.6"
              animate={{ height: [25, 15, 25] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.g>
        )}

        {/* Test tube (step 0-1) */}
        {currentStep <= 1 && (
          <motion.g animate={{ opacity: currentStep === 0 ? 0.5 : 1 }}>
            <rect
              x="70"
              y="70"
              width="30"
              height="80"
              rx="4"
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <rect
              x="72"
              y="100"
              width="26"
              height="48"
              rx="3"
              fill="#dc2626"
              opacity="0.5"
            />
            <text
              x="85"
              y="170"
              textAnchor="middle"
              fill="#92400e"
              fontSize="8"
            >
              Кровь 1:200
            </text>
          </motion.g>
        )}

        {/* Step indicators */}
        {steps.map((_, i) => (
          <motion.circle
            key={i}
            cx={180 + i * 25}
            cy="210"
            r="6"
            fill={i <= currentStep ? "#d97706" : "#e2e8f0"}
            animate={{ scale: i === currentStep ? [1, 1.3, 1] : 1 }}
            transition={{
              duration: 0.5,
              repeat: i === currentStep ? Infinity : 0,
              repeatDelay: 1,
            }}
          />
        ))}

        {/* Formula (last step) */}
        {currentStep >= 5 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect
              x="130"
              y="230"
              width="240"
              height="40"
              rx="8"
              fill="#f0fdf4"
              stroke="#22c55e"
              strokeWidth="1"
            />
            <text
              x="250"
              y="255"
              textAnchor="middle"
              fill="#166534"
              fontSize="10"
              fontWeight="bold"
            >
              X = (a × 4000 × 200) / 80
            </text>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
