"use client";

import { motion } from "framer-motion";
import { FileText, Award, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children";

interface EducationSectionProps {
  data?: {
    title: string;
    subtitle: string;
    items?: {
      id: string;
      title: string;
      institution: string;
      specialty: string;
      year: string;
      degree?: string;
      documents?: {
        type: "diploma" | "certificate" | "course";
        url: string;
        name: string;
      }[];
    }[];
  };
}

const documentIcons = {
  diploma: Award,
  certificate: FileText,
  course: BookOpen,
};

const documentLabels = {
  diploma: "Диплом",
  certificate: "Сертификат",
  course: "Курс",
};

export default function EducationSection({ data }: EducationSectionProps) {
  const educationData = data || {
    title: "Образование и дипломы",
    subtitle: "Все документы подтверждены и сертифицированы",
    items: [
      {
        id: "1",
        title: "Нутрициология и диетология",
        institution: "Московский Государственный Университет",
        specialty: "Диетология",
        year: "2017",
        degree: "Магистр",
        documents: [
          { type: "diploma", url: "#", name: "Диплом МГУ" },
        ],
      },
      {
        id: "2",
        title: "Международная сертификация INM",
        institution: "Institute for Nutrition Medicine",
        specialty: "Нутрициология",
        year: "2019",
        documents: [
          { type: "certificate", url: "#", name: "Сертификат INM" },
        ],
      },
      {
        id: "3",
        title: "Health-коучинг",
        institution: "International Coach Federation",
        specialty: "Коучинг здоровья",
        year: "2021",
        documents: [
          { type: "certificate", url: "#", name: "Сертификат ICF" },
        ],
      },
      {
        id: "4",
        title: "Психология питания",
        institution: "Школа психологии питания",
        specialty: "Психология пищевого поведения",
        year: "2020",
        documents: [
          { type: "course", url: "#", name: "Сертификат о курсе" },
        ],
      },
      {
        id: "5",
        title: "Славянская гимнастика",
        institution: "Центр славянских практик",
        specialty: "Инструктор славянской гимнастики",
        year: "2022",
        documents: [
          { type: "certificate", url: "#", name: "Сертификат инструктора" },
        ],
      },
      {
        id: "6",
        title: "Функциональная медицина",
        institution: "Институт функциональной медицины",
        specialty: "Основы функционального подхода",
        year: "2023",
        documents: [
          { type: "course", url: "#", name: "Сертификат IFM" },
        ],
      },
    ],
  };

  return (
    <section id="education" className="py-24 bg-card">
      <div className="container">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {educationData.title}
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {educationData.subtitle}
          </p>
        </FadeIn>

        <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationData.items?.map((item) => {
            const DocumentIcon = item.documents?.[0]
              ? documentIcons[item.documents[0].type]
              : Award;

            return (
              <StaggerItem key={item.id}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    {/* Заголовок и бейдж */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <DocumentIcon className="h-5 w-5 text-primary" />
                      </div>
                      {item.degree && (
                        <Badge variant="outline">{item.degree}</Badge>
                      )}
                    </div>

                    {/* Основная информация */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-primary font-medium text-sm">
                        {item.institution}
                      </p>
                      <p className="text-sm text-muted">{item.specialty}</p>
                    </div>

                    {/* Год */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm font-semibold text-primary">
                        {item.year}
                      </span>
                      
                      {/* Документы */}
                      {item.documents && item.documents.length > 0 && (
                        <div className="flex gap-2">
                          {item.documents.map((doc, index) => {
                            const DocIcon = documentIcons[doc.type];
                            return (
                              <a
                                key={index}
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted hover:text-primary transition-colors"
                                title={doc.name}
                              >
                                <DocIcon className="h-4 w-4" />
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {/* Примечание */}
        <FadeIn delay={0.6}>
          <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/20 text-center">
            <p className="text-sm text-muted">
              📄 Все документы доступны для проверки. Копии дипломов и сертификатов 
              можно запросить через форму обратной связи.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
