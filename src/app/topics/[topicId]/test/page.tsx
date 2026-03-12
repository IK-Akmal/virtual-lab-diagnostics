"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getTopicById, getQuestionsByTopicId } from "@/data";
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ClipboardCheck,
  Zap,
  Award,
} from "lucide-react";

export default function TestPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const topic = getTopicById(topicId);
  const questions = getQuestionsByTopicId(topicId);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Тема не найдена
        </h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Вернуться
        </Link>
      </div>
    );
  }

  const question = questions[currentQ];
  const score = answers.reduce<number>(
    (acc, a, i) =>
      a !== null && a === questions[i]?.correctAnswer ? acc + 1 : acc,
    0,
  );

  const handleSelect = (optionIndex: number) => {
    if (showResult) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleCheck = () => setShowResult(true);

  const handleNext = () => {
    setShowResult(false);
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    await fetch("/api/test-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicId,
        score,
        totalQuestions: questions.length,
        answers: answers,
      }),
    });
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setAnswers(new Array(questions.length).fill(null));
    setShowResult(false);
    setSubmitted(false);
  };

  if (submitted) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl border border-gray-200 p-10"
        >
          <div
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              percent >= 70
                ? "bg-green-100"
                : percent >= 50
                  ? "bg-yellow-100"
                  : "bg-red-100"
            }`}
          >
            <span
              className={`text-3xl font-bold ${
                percent >= 70
                  ? "text-green-600"
                  : percent >= 50
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {percent}%
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {percent >= 70
              ? "Отлично!"
              : percent >= 50
                ? "Неплохо!"
                : "Нужно повторить"}
          </h1>
          <p className="text-gray-500 mb-2">
            Вы ответили правильно на {score} из {questions.length} вопросов
          </p>
          <p className="text-sm text-gray-400 mb-8">Тема: {topic.title}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Пройти заново
            </button>
            <Link
              href={`/topics/${topicId}/tasks`}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ситуационные задачи <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link
          href="/dashboard"
          className="hover:text-blue-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Дашборд
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/topics/${topicId}`} className="hover:text-blue-600">
          {topic.title}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Тест</span>
      </div>

      {/* Navigation cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link
          href={`/topics/${topicId}`}
          className="bg-white border border-gray-200 rounded-xl p-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <BookOpen className="w-5 h-5 mx-auto mb-1" /> Обучение
        </Link>
        <Link
          href={`/topics/${topicId}/test`}
          className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center text-sm font-medium text-blue-700"
        >
          <ClipboardCheck className="w-5 h-5 mx-auto mb-1" /> Тест
        </Link>
        <Link
          href={`/topics/${topicId}/tasks`}
          className="bg-white border border-gray-200 rounded-xl p-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <Zap className="w-5 h-5 mx-auto mb-1" /> Задачи
        </Link>
        <Link
          href={`/topics/${topicId}/skills`}
          className="bg-white border border-gray-200 rounded-xl p-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <Award className="w-5 h-5 mx-auto mb-1" /> Навыки
        </Link>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">
          Тестирование: {topic.title}
        </h1>
        <span className="text-sm text-gray-500">
          {currentQ + 1} / {questions.length}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <motion.div
        key={currentQ}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {currentQ + 1}. {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            let borderColor = "border-gray-200";
            let bgColor = "bg-white hover:bg-gray-50";
            let textColor = "text-gray-700";

            if (showResult) {
              if (i === question.correctAnswer) {
                borderColor = "border-green-400";
                bgColor = "bg-green-50";
                textColor = "text-green-800";
              } else if (
                i === answers[currentQ] &&
                i !== question.correctAnswer
              ) {
                borderColor = "border-red-400";
                bgColor = "bg-red-50";
                textColor = "text-red-800";
              }
            } else if (answers[currentQ] === i) {
              borderColor = "border-blue-400";
              bgColor = "bg-blue-50";
              textColor = "text-blue-800";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showResult}
                className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border ${borderColor} ${bgColor} ${textColor} transition-all`}
              >
                <span
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    showResult && i === question.correctAnswer
                      ? "border-green-500 bg-green-500 text-white"
                      : showResult && i === answers[currentQ]
                        ? "border-red-500 bg-red-500 text-white"
                        : answers[currentQ] === i
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-300"
                  }`}
                >
                  {showResult && i === question.correctAnswer ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : showResult && i === answers[currentQ] ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200"
          >
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Пояснение:</span>{" "}
              {question.explanation}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3">
        {!showResult ? (
          <button
            onClick={handleCheck}
            disabled={answers[currentQ] === null}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-40"
          >
            Проверить ответ
          </button>
        ) : currentQ < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Следующий вопрос →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            Завершить тест
          </button>
        )}
      </div>
    </div>
  );
}
