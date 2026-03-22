import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section Placeholder */}
        <section className="min-h-screen flex items-center justify-center gradient-bg">
          <div className="container text-center">
            <h1 className="mb-6">
              Нутрициолог / Health-коуч
            </h1>
            <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-8">
              Индивидуальный подход к вашему здоровью. Персональные планы питания, 
              сопровождение и поддержка на пути к лучшей версии себя.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#services">
                <button className="btn btn-primary">
                  Выбрать программу
                </button>
              </a>
              <a href="#about">
                <button className="btn btn-outline">
                  Узнать больше
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Placeholder для будущих секций */}
        <section id="about" className="py-24">
          <div className="container">
            <h2 className="text-center mb-8">Обо мне</h2>
            <p className="text-center text-muted max-w-2xl mx-auto">
              Секция "Обо мне" будет здесь. Расскажите о своем пути, философии и подходе.
            </p>
          </div>
        </section>

        <section id="services" className="py-24 bg-card">
          <div className="container">
            <h2 className="text-center mb-8">Услуги и тарифы</h2>
            <p className="text-center text-muted max-w-2xl mx-auto">
              Секция с услугами и тарифами будет здесь.
            </p>
          </div>
        </section>

        <section id="cases" className="py-24">
          <div className="container">
            <h2 className="text-center mb-8">Кейсы и результаты</h2>
            <p className="text-center text-muted max-w-2xl mx-auto">
              Истории успеха и результаты клиентов будут здесь.
            </p>
          </div>
        </section>

        <section id="materials" className="py-24 bg-card">
          <div className="container">
            <h2 className="text-center mb-8">Полезные материалы</h2>
            <p className="text-center text-muted max-w-2xl mx-auto">
              Статьи, видео и вебинары будут здесь.
            </p>
          </div>
        </section>

        <section id="reviews" className="py-24">
          <div className="container">
            <h2 className="text-center mb-8">Отзывы</h2>
            <p className="text-center text-muted max-w-2xl mx-auto">
              Отзывы клиентов будут здесь.
            </p>
          </div>
        </section>

        <section id="faq" className="py-24 bg-card">
          <div className="container">
            <h2 className="text-center mb-8">Частые вопросы</h2>
            <p className="text-center text-muted max-w-2xl mx-auto">
              FAQ секция будет здесь.
            </p>
          </div>
        </section>

        <section id="contact" className="py-24">
          <div className="container">
            <h2 className="text-center mb-8">Связаться со мной</h2>
            <p className="text-center text-muted max-w-2xl mx-auto">
              Форма обратной связи будет здесь.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
