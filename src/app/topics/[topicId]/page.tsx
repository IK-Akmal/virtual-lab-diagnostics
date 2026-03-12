"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getTopicById } from "@/data";
import AnalyzerAnimation from "@/components/animations/AnalyzerAnimation";
import GoryaevAnimation from "@/components/animations/GoryaevAnimation";
import MicroscopeAnimation from "@/components/animations/MicroscopeAnimation";
import {
  ArrowLeft, ChevronRight, ChevronLeft, Play, Pause,
  BookOpen, FlaskConical, ClipboardCheck, Zap, Award,
  TrendingUp, TrendingDown, Info
} from "lucide-react";

const animationComponents: Record<string, React.ElementType> = {
  "analyzer-workflow": AnalyzerAnimation,
  "goryaev-chamber": GoryaevAnimation,
  microscope: MicroscopeAnimation,
  spectrophotometer: AnalyzerAnimation,
  centrifuge: AnalyzerAnimation,
};

export default function TopicPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const topic = getTopicById(topicId);

  const [activeTab, setActiveTab] = useState<"theory" | "methods">("theory");
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Тема не найдена</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">Вернуться к дашборду</Link>
      </div>
    );
  }

  const method = topic.methods[selectedMethod];
  const AnimComponent = animationComponents[method?.animationType] || AnalyzerAnimation;

  const handleNext = () => {
    if (method && currentStep < method.steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setCurrentStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (method && step >= method.steps.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setCurrentStep(step);
      }
    }, 2000);
  };

  const markComplete = async () => {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId: topic.id, completed: true }),
    });
  };

  const tabs = [
    { id: "theory" as const, label: "Теория", icon: BookOpen },
    { id: "methods" as const, label: "Методы определения", icon: FlaskConical },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Дашборд
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{topic.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{topic.title}</h1>
        <p className="text-gray-500">{topic.description}</p>
      </div>

      {/* Navigation cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link href={`/topics/${topicId}`} className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center text-sm font-medium text-blue-700">
          <BookOpen className="w-5 h-5 mx-auto mb-1" /> Обучение
        </Link>
        <Link href={`/topics/${topicId}/test`} className="bg-white border border-gray-200 rounded-xl p-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
          <ClipboardCheck className="w-5 h-5 mx-auto mb-1" /> Тест
        </Link>
        <Link href={`/topics/${topicId}/tasks`} className="bg-white border border-gray-200 rounded-xl p-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
          <Zap className="w-5 h-5 mx-auto mb-1" /> Задачи
        </Link>
        <Link href={`/topics/${topicId}/skills`} className="bg-white border border-gray-200 rounded-xl p-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
          <Award className="w-5 h-5 mx-auto mb-1" /> Навыки
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "theory" && (
          <motion.div
            key="theory"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Definition */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" /> Определение
              </h2>
              <p className="text-gray-700 leading-relaxed">{topic.theory.definition}</p>
            </div>

            {/* Functions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Функции и характеристики</h2>
              <ul className="space-y-2">
                {topic.theory.functions.map((fn, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    {fn}
                  </li>
                ))}
              </ul>
            </div>

            {/* Normal values */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Нормальные значения</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-sm text-blue-600 font-medium mb-1">Мужчины</div>
                  <div className="text-gray-900 font-semibold">{topic.theory.normalValues.men}</div>
                </div>
                <div className="bg-pink-50 rounded-xl p-4">
                  <div className="text-sm text-pink-600 font-medium mb-1">Женщины</div>
                  <div className="text-gray-900 font-semibold">{topic.theory.normalValues.women}</div>
                </div>
                {topic.theory.normalValues.children && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-sm text-green-600 font-medium mb-1">Дети</div>
                    <div className="text-gray-900 font-semibold">{topic.theory.normalValues.children}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Clinical significance */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-500" /> Повышение
                </h2>
                <ul className="space-y-2">
                  {topic.theory.clinicalSignificance.increased.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-blue-500" /> Снижение
                </h2>
                <ul className="space-y-2">
                  {topic.theory.clinicalSignificance.decreased.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Additional info */}
            {topic.theory.additionalInfo && topic.theory.additionalInfo.length > 0 && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
                <h2 className="text-lg font-semibold text-amber-900 mb-3">Дополнительная информация</h2>
                <ul className="space-y-2">
                  {topic.theory.additionalInfo.map((info, i) => (
                    <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                      <span className="text-amber-500 mt-1">★</span> {info}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => { markComplete(); setActiveTab("methods"); }}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Теория изучена → Перейти к методам
            </button>
          </motion.div>
        )}

        {activeTab === "methods" && (
          <motion.div
            key="methods"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Method selector */}
            {topic.methods.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {topic.methods.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedMethod(i); setCurrentStep(0); setIsPlaying(false); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedMethod === i
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            )}

            {/* Method info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{method.name}</h2>
              <p className="text-gray-600">{method.description}</p>
            </div>

            {/* Animation */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Анимация процесса</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handlePlay}
                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentStep >= method.steps.length - 1}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-500 ml-2">
                    {currentStep + 1} / {method.steps.length}
                  </span>
                </div>
              </div>

              <AnimComponent steps={method.steps} currentStep={currentStep} />

              {/* Current step description */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-blue-50 rounded-xl p-4"
              >
                <div className="text-sm font-semibold text-blue-800 mb-1">
                  Шаг {currentStep + 1}: {method.steps[currentStep]?.title}
                </div>
                <div className="text-sm text-blue-700">
                  {method.steps[currentStep]?.description}
                </div>
              </motion.div>
            </div>

            {/* Steps list */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Все этапы</h3>
              <div className="space-y-3">
                {method.steps.map((step, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                    className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      i === currentStep ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      i <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{step.title}</div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Link
              href={`/topics/${topicId}/test`}
              className="block w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors text-center"
            >
              Перейти к тестированию →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
