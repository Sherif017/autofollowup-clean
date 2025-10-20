'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-700/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            AutoFollowUp
          </div>
          <Link
            href="/login"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Se connecter
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <p className="text-blue-400 text-sm font-semibold">La solution n°1 pour les relances intelligentes</p>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-8 leading-tight">
            Retrouvez vos clients oubliés avec l'IA
          </h1>
          
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Automatisez vos relances, organisez vos contacts et convertissez 30-40% de prospects perdus. Tout ça avec des emails personnalisés générés par l'IA.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/login"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Commencer gratuitement →
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border border-slate-600 text-white rounded-lg hover:bg-slate-800/50 font-semibold transition-all duration-200"
            >
              En savoir plus
            </Link>
          </div>

          <p className="text-slate-400 text-sm">✓ Sans carte de crédit • ✓ Résultat en 2 minutes • ✓ Gratuit pour 30 jours</p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-800/50 py-12 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-400 mb-2">40%</p>
              <p className="text-slate-400">de prospects retrouvés</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-400 mb-2">8h</p>
              <p className="text-slate-400">économisées par mois</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-400 mb-2">2x</p>
              <p className="text-slate-400">plus de conversions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Le problème */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">Le vrai problème</h2>
          <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">Vous êtes en train de perdre des milliers d'euros chaque mois</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/30 p-8 rounded-xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="text-5xl mb-4">📉</div>
              <h3 className="text-xl font-semibold text-white mb-3">30-40% de vos prospects disparaissent</h3>
              <p className="text-slate-400">Sans suivi régulier, ils oublient votre proposition et contactent vos concurrents</p>
            </div>

            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500/50 p-8 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-white mb-3">Vous perdez 10+ heures par mois</h3>
              <p className="text-slate-400">Écrire manuellement 50 relances génériques, c'est épuisant et peu efficace</p>
            </div>

            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500/50 p-8 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="text-5xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold text-white mb-3">Vous n'avez pas de vue d'ensemble</h3>
              <p className="text-slate-400">Qui relancer ? Quand ? Quel suivi ? Tout est dans votre tête et vous oubliez</p>
            </div>
          </div>
        </div>
      </section>

      {/* La solution */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">La solution : AutoFollowUp</h2>
          <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">L'IA qui travaille pour vous, 24/7</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 border border-blue-500/50 rounded-xl mb-6">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Organisez vos contacts</h3>
              <p className="text-slate-400">Base de contacts intelligente avec notes, statuts et historique complet. Retrouvez facilement qui relancer</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 border border-blue-500/50 rounded-xl mb-6">
                <span className="text-2xl font-bold text-blue-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Générez des relances IA</h3>
              <p className="text-slate-400">L'IA crée des emails 100% personnalisés en 2 secondes. Jamais deux fois le même message</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 border border-blue-500/50 rounded-xl mb-6">
                <span className="text-2xl font-bold text-blue-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Envoyez et analysez</h3>
              <p className="text-slate-400">Suivi complet de chaque relance. Savez exactement qui vous avez contacté et quand</p>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Pourquoi AutoFollowUp gagne</h2>

          <div className="space-y-4">
            <div className="group flex gap-6 p-6 bg-slate-800/50 border border-slate-700/30 rounded-xl hover:border-blue-500/50 transition-all duration-300 hover:bg-slate-800">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 font-bold">✓</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Retrouvez 30-40% de prospects perdus</h3>
                <p className="text-slate-400 text-sm">Les relances systématiques = plus de conversions. C'est mathématique et prouvé</p>
              </div>
            </div>

            <div className="group flex gap-6 p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-blue-500/50 transition-all duration-300 hover:bg-slate-800">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 font-bold">✓</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Économisez 8+ heures par mois</h3>
                <p className="text-slate-400 text-sm">L'IA génère les relances, vous validez. Pas d'écriture manuelle</p>
              </div>
            </div>

            <div className="group flex gap-6 p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-blue-500/50 transition-all duration-300 hover:bg-slate-800">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 font-bold">✓</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Emails 100% personnalisés</h3>
                <p className="text-slate-400 text-sm">Chaque message est adapté au statut et contexte du contact. Pas de templates génériques</p>
              </div>
            </div>

            <div className="group flex gap-6 p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-blue-500/50 transition-all duration-300 hover:bg-slate-800">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 font-bold">✓</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Vous gardez le contrôle total</h3>
                <p className="text-slate-400 text-sm">Vous validez chaque email avant envoi. Pas d'automatisation "boîte noire"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qui */}
      <section className="py-24 px-6 bg-slate-900/50 border-y border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Pour qui ?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-slate-700/30 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-white mb-2">Freelances & Consultants</h3>
              <p className="text-slate-400">Développeurs, designers, coachs, consultants... Quiconque doit suivre des prospects et convertir</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-slate-700 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-white mb-2">Petites Agences (1-10 personnes)</h3>
              <p className="text-slate-400">Pas besoin d'un CRM complexe. AutoFollowUp est simple, efficace et vraiment abordable</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à retrouver vos prospects perdus ?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Rejoignez la bêta gratuitement. Aucun engagement, pas de carte de crédit
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 font-semibold text-lg transition-all duration-200 transform hover:scale-105"
          >
            Commencer maintenant →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-6 bg-slate-950/50">
        <div className="max-w-6xl mx-auto text-center text-slate-500 text-sm">
          <p>© 2025 AutoFollowUp — Relances IA pour freelances et petites agences</p>
        </div>
      </footer>
    </div>
  );
}