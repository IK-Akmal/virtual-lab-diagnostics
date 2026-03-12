"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Microscope,
  BookOpen,
  ClipboardCheck,
  Award,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Интерактивное обучение",
    description:
      "7 тем общего анализа крови с подробной теорией, методами определения и пошаговыми анимациями",
  },
  {
    icon: ClipboardCheck,
    title: "Тесты и задачи",
    description:
      "70 тестовых вопросов и ситуационные задачи с клиническими сценариями для проверки знаний",
  },
  {
    icon: Award,
    title: "Оценка навыков",
    description:
      "Интерактивные симуляции для отработки практических навыков лабораторной диагностики",
  },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-accent)] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Microscope className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Виртуальная лаборатория
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
              Лабораторная диагностика
            </p>
            <p className="text-lg text-white/75 mb-10 max-w-2xl mx-auto">
              Интерактивная платформа для изучения общего анализа крови с
              анимациями, тестами и ситуационными задачами
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={session ? "/dashboard" : "/register"}
                className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors shadow-lg"
              >
                {session ? "Перейти к обучению" : "Начать обучение"}
                <ArrowRight className="w-5 h-5" />
              </Link>
              {!session && (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors"
                >
                  Войти в аккаунт
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-4">
            Как работает платформа
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Три этапа для полного освоения лабораторной диагностики
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Темы общего анализа крови
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
              {[
                "Гемоглобин",
                "Эритроциты",
                "Эритроцитарные индексы",
                "Лейкоциты",
                "Лейкоформула",
                "Тромбоциты",
                "СОЭ",
              ].map((topic, i) => (
                <div
                  key={i}
                  className="bg-[var(--color-bg)] rounded-xl p-4 text-center font-medium text-[var(--color-text)] border border-[var(--color-border)]"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--color-primary-dark)] text-white/70 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>
            Виртуальная лаборатория — Лабораторная диагностика &copy;{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
