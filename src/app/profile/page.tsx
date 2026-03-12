"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { allTopics } from "@/data";
import {
  User, Trophy, BookOpen, ClipboardCheck, Calendar,
  CheckCircle2, Clock
} from "lucide-react";

interface TestResult {
  id: string;
  topicId: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
}

interface ProgressItem {
  topicId: string;
  completed: boolean;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [results, setResults] = useState<TestResult[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);

  useEffect(() => {
    fetch("/api/test-results").then((r) => r.json()).then(setResults).catch(() => {});
    fetch("/api/progress").then((r) => r.json()).then(setProgress).catch(() => {});
  }, []);

  const completedTopics = progress.filter((p) => p.completed).length;
  const totalTopics = allTopics.length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / results.length)
    : 0;

  const getTopicTitle = (topicId: string) =>
    allTopics.find((t) => t.id === topicId)?.title || topicId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{session?.user?.name}</h1>
            <p className="text-gray-500">{session?.user?.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Пройдено тем</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedTopics} / {totalTopics}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Средний балл</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <ClipboardCheck className="w-4 h-4" />
              <span className="text-sm font-medium">Тестов пройдено</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{results.length}</p>
          </div>
        </div>
      </div>

      {/* Topic progress */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Прогресс по темам</h2>
      <div className="space-y-3 mb-8">
        {allTopics.map((topic, i) => {
          const isCompleted = progress.some((p) => p.topicId === topic.id && p.completed);
          const topicResults = results.filter((r) => r.topicId === topic.id);
          const bestScore = topicResults.length > 0
            ? Math.max(...topicResults.map((r) => Math.round((r.score / r.totalQuestions) * 100)))
            : null;

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/topics/${topic.id}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-300" />
                    )}
                    <span className="font-medium text-gray-900">{topic.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {bestScore !== null && (
                      <span className={`font-semibold ${bestScore >= 70 ? "text-green-600" : bestScore >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                        Лучший: {bestScore}%
                      </span>
                    )}
                    {topicResults.length > 0 && (
                      <span className="text-gray-400">
                        {topicResults.length} попыт.
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Test history */}
      {results.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-4">История тестов</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {results.slice(0, 20).map((result) => {
                const percent = Math.round((result.score / result.totalQuestions) * 100);
                return (
                  <div key={result.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{getTopicTitle(result.topicId)}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(result.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${
                        percent >= 70 ? "text-green-600" : percent >= 50 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {percent}%
                      </span>
                      <p className="text-xs text-gray-400">{result.score}/{result.totalQuestions}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
