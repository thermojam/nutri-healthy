"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

interface CasesSectionProps {
  data?: {
    title: string;
    subtitle: string;
    cases?: {
      id: string;
      title: string;
      client: {
        name: string;
        anonymized: boolean;
        age?: number;
        gender?: "female" | "male";
      };
      problem: string;
      results: {
        title: string;
        value: string;
        metric?: string;
      }[];
      testimonial?: string;
      serviceName: string;
      duration: string;
    }[];
  };
}

export default function CasesSection({ data }: CasesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const casesData = data || {
    title: "Кейсы и результаты",
    subtitle: "Истории успеха моих клиентов с реальными результатами",
    cases: [
      {
        id: "1",
        title: "Минус 15 кг за 4 месяца",
        client: {
          name: "Екатерина",
          anonymized: false,
          age: 32,
          gender: "female",
        },
        problem:
          "Лишний вес после родов, низкая энергия, проблемы с кожей и волосами",
        results: [
          { title: "Похудение", value: "-15 кг", metric: "за 4 месяца" },
          { title: "Энергия", value: "8/10", metric: "вместо 3/10" },
          { title: "Анализы", value: "В норме", metric: "все показатели" },
        ],
        testimonial:
          "Я наконец-то чувствую себя легко и энергично! Спасибо за индивидуальный подход и поддержку!",
        serviceName: "Health-коучинг",
        duration: "4 месяца",
      },
      {
        id: "2",
        title: "Избавление от пищевого расстройства",
        client: {
          name: "Анна",
          anonymized: true,
          age: 28,
          gender: "female",
        },
        problem:
          "Компульсивное переедание, чувство вины после еды, низкая самооценка",
        results: [
          { title: "Срывы", value: "0", metric: "за 3 месяца" },
          { title: "Самооценка", value: "8/10", metric: "вместо 3/10" },
          { title: "Отношения", value: "Гармония", metric: "с едой и телом" },
        ],
        testimonial:
          "Я научилась слышать свой организм и получать удовольствие от еды без чувства вины. Это изменило мою жизнь!",
        serviceName: "Нутрициология + Психология",
        duration: "3 месяца",
      },
      {
        id: "3",
        title: "Восстановление здоровья ЖКТ",
        client: {
          name: "Михаил",
          anonymized: false,
          age: 45,
          gender: "male",
        },
        problem:
          "Хронические проблемы с пищеварением, вздутие, усталость после еды",
        results: [
          { title: "Симптомы", value: "-90%", metric: "исчезли" },
          { title: "Энергия", value: "Стабильная", metric: "весь день" },
          { title: "Сон", value: "8 часов", metric: "без пробуждений" },
        ],
        testimonial:
          "После многих лет безуспешного лечения у врачей я наконец-то нашел решение. Рекомендую!",
        serviceName: "Нутрициология",
        duration: "2 месяца",
      },
      {
        id: "4",
        title: "Гармония тела и духа",
        client: {
          name: "Ольга",
          anonymized: false,
          age: 50,
          gender: "female",
        },
        problem:
          "Боли в спине, скованность, стресс, отсутствие времени на себя",
        results: [
          { title: "Боли", value: "-80%", metric: "значительно меньше" },
          { title: "Гибкость", value: "+50%", metric: "за 2 месяца" },
          { title: "Стресс", value: "Контроль", metric: "техники работают" },
        ],
        testimonial:
          "Славянская гимнастика стала моим ежедневным ритуалом. Я чувствую себя моложе и счастливее!",
        serviceName: "Славянская гимнастика",
        duration: "2 месяца",
      },
    ],
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (casesData.cases?.length || 1));
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + (casesData.cases?.length || 1)) %
        (casesData.cases?.length || 1)
    );
  };

  return (
    <section id="cases" className="py-24 bg-card">
      <div className="container">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {casesData.title}
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {casesData.subtitle}
          </p>
        </FadeIn>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {casesData.cases?.slice(0, 4).map((caseItem, index) => (
            <FadeIn key={caseItem.id} delay={index * 0.1}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  {/* Заголовок и клиент */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          caseItem.client.anonymized
                            ? "bg-primary/20"
                            : "bg-gradient-to-br from-primary to-accent"
                        )}
                      >
                        {caseItem.client.anonymized ? (
                          <span className="text-xl">👤</span>
                        ) : (
                          <span className="text-xl font-bold text-white">
                            {caseItem.client.name[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {caseItem.client.anonymized
                            ? "Клиент"
                            : caseItem.client.name}
                        </h3>
                        <p className="text-sm text-muted">
                          {caseItem.client.age &&
                            `${caseItem.client.age} лет`}{" "}
                          • {caseItem.serviceName}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{caseItem.duration}</Badge>
                  </div>

                  {/* Проблема */}
                  <div>
                    <p className="text-sm text-muted mb-1">Запрос:</p>
                    <p className="text-sm">{caseItem.problem}</p>
                  </div>

                  {/* Результаты */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted font-medium">Результаты:</p>
                    {caseItem.results.map((result, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-primary font-bold">✓</span>
                        <span>
                          <strong className="text-primary">
                            {result.value}
                          </strong>
                          {result.metric && (
                            <span className="text-muted"> {result.metric}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Отзыв */}
                  {caseItem.testimonial && (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted text-sm">
                      <Quote className="h-4 w-4 inline mr-2 -mt-1 opacity-50" />
                      {caseItem.testimonial}
                    </blockquote>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {casesData.cases && casesData.cases[currentIndex] && (
                <Card className="overflow-hidden">
                  <CardContent className="p-6 space-y-4">
                    {/* Заголовок и клиент */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            casesData.cases[currentIndex].client.anonymized
                              ? "bg-primary/20"
                              : "bg-gradient-to-br from-primary to-accent"
                          )}
                        >
                          {casesData.cases[currentIndex].client.anonymized ? (
                            <span className="text-xl">👤</span>
                          ) : (
                            <span className="text-xl font-bold text-white">
                              {casesData.cases[currentIndex].client.name[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {casesData.cases[currentIndex].client.anonymized
                              ? "Клиент"
                              : casesData.cases[currentIndex].client.name}
                          </h3>
                          <p className="text-sm text-muted">
                            {casesData.cases[currentIndex].client.age &&
                              `${casesData.cases[currentIndex].client.age} лет`}{" "}
                            • {casesData.cases[currentIndex].serviceName}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {casesData.cases[currentIndex].duration}
                      </Badge>
                    </div>

                    {/* Название кейса */}
                    <h3 className="text-xl font-bold">
                      {casesData.cases[currentIndex].title}
                    </h3>

                    {/* Проблема */}
                    <div>
                      <p className="text-sm text-muted mb-1">Запрос:</p>
                      <p className="text-sm">
                        {casesData.cases[currentIndex].problem}
                      </p>
                    </div>

                    {/* Результаты */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted font-medium">
                        Результаты:
                      </p>
                      {casesData.cases[currentIndex].results.map(
                        (result, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className="text-primary font-bold">✓</span>
                            <span>
                              <strong className="text-primary">
                                {result.value}
                              </strong>
                              {result.metric && (
                                <span className="text-muted">
                                  {" "}
                                  {result.metric}
                                </span>
                              )}
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Отзыв */}
                    {casesData.cases[currentIndex].testimonial && (
                      <blockquote className="border-l-4 border-primary pl-4 italic text-muted text-sm">
                        <Quote className="h-4 w-4 inline mr-2 -mt-1 opacity-50" />
                        {casesData.cases[currentIndex].testimonial}
                      </blockquote>
                    )}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Навигация карусели */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {casesData.cases?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-border hover:bg-primary/50"
                  )}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* CTA */}
        <FadeIn delay={0.6}>
          <div className="mt-12 text-center">
            <p className="text-muted mb-4">
              Хотите такой же результат? Запишитесь на консультацию!
            </p>
            <a href="#contact">
              <Button size="lg">Начать свой путь к здоровью</Button>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
