import Image from "next/image";
import Header from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[48px] row-start-2 items-center sm:items-start max-w-3xl text-center sm:text-left">
          {/* Logo */}
          {/* <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          /> */}

          {/* Hero Section */}
          <section className="flex flex-col gap-4" id="hero">
            <h1 className="text-3xl sm:text-5xl font-bold text-black dark:text-white">
              Transforme ton réseau en business.
            </h1>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
              Accède à des contacts exclusifs de fournisseurs (produits éléctroniques, textile...) et à un guide pas à pas pour lancer ton business en ligne. Testé, concret, et surtout… efficace.
            </p>
            <p className="text-sm sm:text-base font-semibold text-[#ff6600] dark:text-orange-300">
              Accès privé. Réservé aux motivés.
            </p>
            <a
              href="/login"
              className="mt-4 inline-block bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full hover:opacity-80 transition"
            >
              Accéder à la plateforme
            </a>
          </section>

          {/* Pourquoi ce guide ? */}
          <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Ce que tu vas apprendre ici n’est pas dans les écoles.</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>Comment lancer un business simple avec peu de moyens</li>
              <li>Les fournisseurs fiables déjà sélectionnés pour toi</li>
              <li>Des conseils concrets pour vendre, livrer, communiquer</li>
            </ul>
          </section>

          {/* Pour qui ? */}
          <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Tu veux te lancer mais tu sais pas par où commencer ?</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Ce site est fait pour toi. Si tu es motivé, même sans expérience, on t’aide à poser les bonnes bases, éviter les erreurs, et surtout à passer à l’action.
            </p>
          </section>

          {/* Contenu privé */}
          <section className="flex flex-col gap-2" id="contenu">
            <h2 className="text-2xl font-bold">Un accès privé pour débloquer tout le contenu.</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>📖 E-book complet étape par étape</li>
              <li>📞 Fournisseurs testés et fiables</li>
              <li>🎨 Modèles de flyers, conseils visuels</li>
              <li>💬 Accès à des contacts marketing & design</li>
            </ul>
            <a
              href="/signup"
              className="mt-4 inline-block border border-black dark:border-white px-6 py-3 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            >
              Je m’inscris
            </a>
          </section>

          {/* Témoignage */}
          <blockquote className="mt-8 italic text-gray-600 dark:text-gray-400 border-l-4 border-[#ff6600] pl-4">
            “J’ai commencé avec zéro stock, juste le guide et un compte Snap. Aujourd’hui je fais 300€ par semaine en vendant des puffs.”<br />
            — Amine, 20 ans
          </blockquote>
        </main>

        {/* Footer */}
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          <p>Made by Lionel PINAU</p>
        </footer>
      </div>
    </>
  );
}
