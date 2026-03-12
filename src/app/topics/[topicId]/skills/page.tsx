"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getTopicById } from "@/data";
import {
  ArrowLeft, ChevronRight, CheckCircle2, XCircle, RotateCcw,
  BookOpen, ClipboardCheck, Zap, Award
} from "lucide-react";

export default function SkillsPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const topic = getTopicById(topicId);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!topic || topic.skillSteps.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {topic ? "Нет заданий для оценки навыков" : "Тема не найдена"}
        </h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">Вернуться</Link>
      </div>
    );
  }

  const step = topic.skillSteps[currentStep];
  const isCorrect = selectedOption === step.correctAction;

  const handleCheck = () => {
    if (!selectedOption) return;
    setChecked(true);
    if (isCorrect) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (currentStep < topic.skillSteps.length - 1) {
      setCurrentStep((s) => s + 1);
      setSelectedOption(null);
      setChecked(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setChecked(false);
    setCorrectCount(0);
    setCompleted(false);
  };

  if (completed) {
    const percent = Math.round((correctCount / topic.skillSteps.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl border border-gray-200 p-10"
        >
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
            percent >= 70 ? "bg-green-100" : percent >= 50 ? "bg-yellow-100" : "bg-red-100"
          }`}>
            <Award className={`w-12 h-12 ${
              percent >= 70 ? "text-green-600" : percent >= 50 ? "text-yellow-600" : "text-red-600"
            }`} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {percent >= 70 ? "Навыки освоены!" : percent >= 50 ? "Нужна практика" : "Требуется повторение"}
          </h1>
          <p className="text-gray-500 mb-2">
            Правильно: {correctCount} из {topic.skillSteps.length}
          </p>
          <p className="text-3xl font-bold text-gray-900 mb-8">{percent}%</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Пройти заново
            </button>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              К дашборду
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Дашборд
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/topics/${topicId}`} className="hover:text-blue-600">{topic.title}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Оценка навыков</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link href={`/topics/${topicId}`} className="bg-white border border-gray-200 rounded-xl p-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
          <BookOpen className="w-5 h-5 mx-auto mb-1" /> Обучение
        </Link>
        <Link href={`/topics/${topicId}/test`} className="bg-white border border-gray-200 rounded-xl p-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
          <ClipboardCheck className="w-5 h-5 mx-auto mb-1" /> Тест
        </Link>
        <Link href={`/topics/${topicId}/tasks`} className="bg-white border border-gray-200 rounded-xl p-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
          <Zap className="w-5 h-5 mx-auto mb-1" /> Задачи
        </Link>
        <Link href={`/topics/${topicId}/skills`} className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center text-sm font-medium text-purple-700">
          <Award className="w-5 h-5 mx-auto mb-1" /> Навыки
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Оценка навыков</h1>
        <span className="text-sm text-gray-500">{currentStep + 1} / {topic.skillSteps.length}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
        <div
          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / topic.skillSteps.length) * 100}%` }}
        />
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
            <h2 className="text-lg font-semibold text-purple-900">{step.instruction}</h2>
          </div>

          <div className="space-y-3">
            {step.options.map((option, i) => {
              let style = "border-gray-200 bg-white hover:bg-gray-50 text-gray-700";
              if (checked) {
                if (option === step.correctAction) {
                  style = "border-green-400 bg-green-50 text-green-800";
                } else if (option === selectedOption && option !== step.correctAction) {
                  style = "border-red-400 bg-red-50 text-red-800";
                }
              } else if (option === selectedOption) {
                style = "border-purple-400 bg-purple-50 text-purple-800";
              }

              return (
                <button
                  key={i}
                  onClick={() => !checked && setSelectedOption(option)}
                  disabled={checked}
                  className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border transition-all ${style}`}
                >
                  {checked && option === step.correctAction ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : checked && option === selectedOption ? (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                      option === selectedOption ? "border-purple-500 bg-purple-500" : "border-gray-300"
                    }`}>
                      {option === selectedOption && <div className="w-full h-full rounded-full bg-white scale-40" />}
                    </div>
                  )}
                  <span className="text-sm">{option}</span>
                </button>
              );
            })}
          </div>

          {checked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 rounded-xl p-4 ${
                isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <p className={`text-sm font-medium ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                {isCorrect ? "Правильно!" : `Неверно. Правильный ответ: ${step.correctAction}`}
              </p>
            </motion.div>
          )}
        </div>

        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!selectedOption}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-40"
          >
            Проверить
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            {currentStep < topic.skillSteps.length - 1 ? "Следующий шаг →" : "Завершить оценку"}
          </button>
        )}
      </motion.div>
    </div>
  );
}
