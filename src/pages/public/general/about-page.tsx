export default function AboutPage() {
  return (
    <div className="min-h-screen  p-4 flex flex-col gap-8">
      <img
        src="/images/vapo-lab.jpg"
        alt="Vapestore laboratoire"
        className="w-full max-h-80 object-cover rounded-2xl mb-8"
      />
      <h1 className="text-vapo-purple-primary text-3xl font-bold mb-2">Vapestore X Uber Direct</h1>
      <p className="text-white text-lg mb-12 max-w-2xl">
        Vapestore X Uber Direct révolutionne la livraison de produits de vapotage avec un service express, un suivi en temps réel et des preuves de livraison fiables. Profitez d'une expérience fluide, rapide et sécurisée pour recevoir vos commandes où que vous soyez.
      </p>

      <h2 className="text-vapo-purple-primary text-2xl font-bold mb-6">Fonctionnalités clés</h2>
      <div className="flex flex-col gap-8 mb-12">
        <div>
          <span className="text-vapo-purple-primary text-xl font-semibold">Livraison Express</span>
        </div>
        <div>
          <span className="text-vapo-purple-primary text-xl font-semibold">Suivi en Temps Réel</span>
        </div>
        <div>
          <span className="text-vapo-purple-primary text-xl font-semibold">Preuve de Livraison</span>
        </div>
      </div>

      <h2 className="text-vapo-purple-primary text-2xl font-bold mb-6">Vos avantages avec Vapestore</h2>
      <div className="flex flex-col gap-8">
        <div className="border-2 border-vapo-purple-primary rounded-2xl p-6 flex items-center gap-4 bg-black shadow-[0_4px_24px_0_rgba(120,0,120,0.10)]">
          <span className="text-vapo-purple-primary text-2xl mr-2">⏱️</span>
          <span className="text-white text-lg font-semibold">Rapidité</span>
        </div>
        <div className="border-2 border-vapo-purple-primary rounded-2xl p-6 flex items-center gap-4 bg-black shadow-[0_4px_24px_0_rgba(120,0,120,0.10)]">
          <span className="text-vapo-purple-primary text-2xl mr-2">🛡️</span>
          <span className="text-white text-lg font-semibold">Fiabilité</span>
        </div>
        <div className="border-2 border-vapo-purple-primary rounded-2xl p-6 flex items-center gap-4 bg-black shadow-[0_4px_24px_0_rgba(120,0,120,0.10)]">
          <span className="text-vapo-purple-primary text-2xl mr-2">🛡️</span>
          <span className="text-white text-lg font-semibold">Sécurité</span>
        </div>
      </div>
    </div>
  );
}
