"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children";

interface EducationItem {
  _id: string;
  title: string;
  institution: string;
  specialty: string;
  year: string;
}

export default function AboutSection() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/education")
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data.data || []).slice(0, 5).map((item: any) => ({
          ...item,
          year: new Date(item.startDate).getFullYear().toString(),
        }));
        setEducation(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch education:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Обо мне</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Мой путь в нутрициологии и health-коучинге
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Фото */}
          <FadeIn direction="right" delay={0.2}>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                {/* Placeholder для фото */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl">👩‍⚕️</span>
                </div>
              </div>

              {/* Декоративный элемент */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/20 rounded-full -z-10" />
            </div>
          </FadeIn>

          {/* Контент */}
          <div className="space-y-8">
            <FadeIn direction="left" delay={0.3}>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base md:text-lg text-muted leading-relaxed">
                  Привет! Меня зовут Ксения Каменская, и я сертифицированный нутрициолог и health-коуч с более чем 7-летним опытом работы.
                </p>
                <p className="text-base md:text-lg text-muted leading-relaxed">
                  Моя миссия — помочь вам обрести здоровье, энергию и гармонию с телом через научно обоснованный подход к питанию и образу жизни.
                </p>
                <p className="text-base md:text-lg text-muted leading-relaxed">
                  Я верю, что каждый человек уникален, и не существует универсальных решений. Поэтому я разработаю индивидуальную программу, которая подойдет именно вам и вашему образу жизни.
                </p>
              </div>
            </FadeIn>

            {/* Философия */}
            <FadeIn direction="left" delay={0.4}>
              <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl border-l-4 border-primary">
                <h3 className="text-lg font-semibold mb-2">Моя философия</h3>
                <p className="text-muted italic">
                  Здоровье — это не просто отсутствие болезней, это состояние полного физического, психического и социального благополучия.
                </p>
              </div>
            </FadeIn>

            {/* Timeline пути */}
            <FadeIn direction="left" delay={0.5}>
              <div>
                <h3 className="text-xl font-semibold mb-6">Мой путь</h3>
                {loading ? (
                  <p className="text-muted">Загрузка...</p>
                ) : (
                  <StaggerChildren className="space-y-4">
                    {education.map((item, index) => (
                      <StaggerItem key={item._id}>
                        <div className="flex gap-4 items-start">
                          <div className="flex-shrink-0 w-16 text-primary font-bold text-lg">
                            {item.year}
                          </div>
                          <div className="flex-1 pb-4 border-b border-border last:border-b-0">
                            <h4 className="font-semibold mb-1">{item.title}</h4>
                            <p className="text-sm text-muted">
                              {item.institution} • {item.specialty}
                            </p>
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerChildren>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
