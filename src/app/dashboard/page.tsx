"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { allTopics } from "@/data";
import {
  HeartPulse, Droplets, Calculator, Shield, PieChart, CircleDot, Timer,
  BookOpen, ClipboardCheck, Zap, CheckCircle2
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "heart-pulse": HeartPulse,
  droplets: Droplets,
  calculator: Calculator,
  shield: Shield,
  "pie-chart": PieChart,
  "circle-dot": CircleDot,
  timer: Timer,
};

interface ProgressItem {
  topicId: string;
  completed: boolean;
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<ProgressItem[]>([]);

  useEffect(() => {
    fetch("/api/progress")
      .then((res) => res.json())
      .then((data) => setProgress(data))
      .catch(() => {});
  }, []);

  const completedCount = progress.filter((p) => p.completed).length;
  const totalTopics = allTopics.length;
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Общий анализ крови</h1>
        <p className="text-gray-500">Выберите тему для изучения</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Общий прогресс</span>
          <span className="text-sm font-semibold text-blue-700">{completedCount} / {totalTopics} тем</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <motion.div
            className="bg-blue-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTopics.map((topic, index) => {
          const Icon = iconMap[topic.icon] || BookOpen;
          const isCompleted = progress.some((p) => p.topicId === topic.id && p.completed);

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link href={`/topics/${topic.id}`}>
                <div className={`bg-white rounded-2xl border p-6 hover:shadow-lg transition-all cursor-pointer group ${isCompleted ? "border-green-300 bg-green-50/30" : "border-gray-200"}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCompleted ? "bg-green-100" : "bg-blue-50"}`}>
                      <Icon className={`w-6 h-6 ${isCompleted ? "text-green-600" : "text-blue-600"}`} />
                    </div>
                    {isCompleted && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{topic.description}</p>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Теория
                    </span>
                    <span className="flex items-center gap-1">
                      <ClipboardCheck className="w-3.5 h-3.5" /> 10 тестов
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> Навыки
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
