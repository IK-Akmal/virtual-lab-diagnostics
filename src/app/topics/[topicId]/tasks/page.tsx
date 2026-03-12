"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getTopicById } from "@/data";
import {
  ArrowLeft, ChevronRight, Send, CheckCircle2, Lightbulb,
  BookOpen, ClipboardCheck, Zap, Award
} from "lucide-react";

export default function TasksPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const topic = getTopicById(topicId);

  const [currentTask, setCurrentTask] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState<boolean[]>([]);
  const [showHint, setShowHint] = useState(false);

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Тема не найдена</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">Вернуться</Link>
      </div>
    );
  }

  const task = topic.situations[currentTask];

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    await fetch("/api/task-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, taskId: task.id, answer }),
    });
    const newSubmitted = [...submitted];
    newSubmitted[currentTask] = true;
    setSubmitted(newSubmitted);
  };

  const handleNextTask = () => {
    if (currentTask < topic.situations.length - 1) {
      setCurrentTask((t) => t + 1);
      setAnswer("");
      setShowHint(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Дашборд
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/topics/${topicId}`} className="hover:text-blue-600">{topic.title}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Ситуационные задачи</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link href={`/topics/${topicId}`} className="bg-white border border-gray-200 rounded-xl p-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
          <BookOpen className="w-5 h-5 mx-auto mb-1" /> Обучение
        </Link>
        <Link href={`/topics/${topicId}/test`} className="bg-white border border-gray-200 rounded-xl p-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
          <ClipboardCheck className="w-5 h-5 mx-auto mb-1" /> Тест
        </Link>
        <Link href={`/topics/${topicId}/tasks`} className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center text-sm font-medium text-blue-700">
          <Zap className="w-5 h-5 mx-auto mb-1" /> Задачи
        </Link>
        <Link href={`/topics/${topicId}/skills`} className="bg-white border border-gray-200 rounded-xl p-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
          <Award className="w-5 h-5 mx-auto mb-1" /> Навыки
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Ситуационные задачи</h1>
        <span className="text-sm text-gray-500">
          {currentTask + 1} / {topic.situations.length}
        </span>
      </div>

      {task && (
        <motion.div
          key={currentTask}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-blue-600 mb-3">Клиническая ситуация</h2>
            <p className="text-gray-800 leading-relaxed mb-4">{task.caseDescription}</p>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h3 className="text-sm font-semibold text-amber-800 mb-1">Вопрос:</h3>
              <p className="text-amber-900">{task.question}</p>
            </div>
          </div>

          {task.hint && (
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? "Скрыть подсказку" : "Показать подсказку"}
              </button>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 bg-amber-50 rounded-xl p-4 border border-amber-200 text-sm text-amber-800"
                >
                  {task.hint}
                </motion.div>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Ваш ответ (свободный текст):</h3>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted[currentTask]}
              rows={6}
              className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Опишите ваш анализ ситуации, предполагаемый диагноз, дополнительные исследования и тактику ведения..."
            />

            {!submitted[currentTask] ? (
              <button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" /> Отправить ответ
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center gap-2 text-green-600"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Ответ сохранён</span>
              </motion.div>
            )}
          </div>

          <div className="flex gap-3">
            {currentTask < topic.situations.length - 1 ? (
              <button
                onClick={handleNextTask}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Следующая задача →
              </button>
            ) : (
              <Link
                href={`/topics/${topicId}/skills`}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors text-center"
              >
                Перейти к оценке навыков →
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
