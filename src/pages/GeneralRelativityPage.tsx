import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import { GravitationalTimeDilationExperiment } from '../components/GravitationalTimeDilationExperiment';

export const GeneralRelativityPage: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden pt-24 sm:pt-28">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-indigo-900/20"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(147,51,234,0.05)_50%,transparent_75%)] bg-[length:60px_60px] animate-pulse"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
        <header className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Link
              to="/relativite-classique"
              className="group flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-gray-500/25"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Relativité Classique
            </Link>
          </div>

          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mr-4" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-300 via-indigo-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent bg-[length:400%_400%] animate-gradient-x drop-shadow-[0_0_30px_rgba(147,51,234,0.8)]">
              Relativité Générale
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-purple-200 max-w-4xl mx-auto px-4 leading-relaxed">
            Explorez comment la masse-énergie courbe l'espace-temps et ralentit les horloges
          </p>
        </header>

        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-4">
              Introduction : La Gravité comme Géométrie
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-gray-200 leading-relaxed">
              <p>
                En 1915, Einstein publie la <strong className="text-white">Relativité Générale</strong>,
                une théorie révolutionnaire qui explique la gravité non pas comme une force mystérieuse,
                mais comme une conséquence de la <strong className="text-purple-300">courbure de l'espace-temps</strong>.
              </p>

              <p>
                Selon cette théorie, la présence de masse et d'énergie déforme la géométrie de l'espace-temps
                autour d'elle. Les objets suivent alors des trajectoires naturelles (géodésiques) dans cet
                espace-temps courbé, ce qui nous apparaît comme l'effet de la gravité.
              </p>

              <div className="bg-purple-900/30 p-4 sm:p-6 rounded-lg border-l-4 border-purple-400">
                <p className="text-purple-100">
                  <strong>Les équations d'Einstein</strong> relient directement la géométrie de l'espace-temps
                  (décrite par le tenseur métrique) au contenu en énergie-matière (décrit par le tenseur
                  énergie-impulsion) : <span className="font-mono">G<sub>μν</sub> = 8πT<sub>μν</sub></span>
                </p>
              </div>

              <p>
                Une des conséquences les plus fascinantes est la <strong className="text-white">dilatation
                temporelle gravitationnelle</strong> : les horloges battent différemment selon leur position
                dans un champ gravitationnel. Plus on est proche d'une masse importante, plus le temps
                s'écoule lentement.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 backdrop-blur-sm rounded-xl lg:rounded-2xl p-6 sm:p-8 border border-indigo-400/30 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-300 mb-4">
              La Métrique de Schwarzschild
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-gray-200 leading-relaxed">
              <p>
                Pour un objet sphérique non-rotatif, la solution des équations d'Einstein est donnée
                par la <strong className="text-white">métrique de Schwarzschild</strong>. Cette solution
                décrit précisément comment l'espace-temps est déformé autour d\'un astre.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-400/30">
                  <h3 className="text-lg font-semibold text-indigo-200 mb-2">Solution Extérieure</h3>
                  <p className="text-sm text-gray-300">
                    Pour un observateur à l'extérieur de l'astre (r &gt; R), le facteur de dilatation
                    temporelle est :
                  </p>
                  <div className="text-center font-mono text-indigo-200 my-2 text-sm">
                    dτ/dt = √(1 - 2GM/rc²)
                  </div>
                  <p className="text-xs text-gray-400">
                    où r est la distance au centre, M la masse, G la constante gravitationnelle,
                    et c la vitesse de la lumière.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-400/30">
                  <h3 className="text-lg font-semibold text-purple-200 mb-2">Solution Intérieure</h3>
                  <p className="text-sm text-gray-300">
                    Pour un observateur au centre d'une sphère de densité uniforme :
                  </p>
                  <div className="text-center font-mono text-purple-200 my-2 text-sm">
                    dτ/dt = (3/2)√(1 - 2GM/R) - 1/2
                  </div>
                  <p className="text-xs text-gray-400">
                    où R est le rayon de l'astre. Le temps s'écoule encore plus lentement au centre
                    qu'à la surface.
                  </p>
                </div>
              </div>

              <div className="bg-cyan-900/30 p-4 rounded-lg border-l-4 border-cyan-400">
                <p className="text-cyan-100">
                  Le <strong className="text-white">rayon de Schwarzschild</strong> (R<sub>s</sub> = 2GM/c²)
                  représente la taille critique : si un astre est comprimé en dessous de ce rayon,
                  il devient un <strong>trou noir</strong> et un horizon des événements se forme.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-4">
              Expérience Interactive : Dilatation Temporelle Gravitationnelle
            </h2>

            <p className="text-base sm:text-lg text-gray-200 leading-relaxed mb-6">
              Créez un astre en définissant sa masse et son rayon, puis observez comment le temps
              s'écoule différemment pour trois observateurs : un observateur lointain (référence),
              un observateur à la surface, et un observateur au centre de l'astre.
            </p>

            <GravitationalTimeDilationExperiment />
          </div>

          <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/30 backdrop-blur-sm rounded-xl lg:rounded-2xl p-6 sm:p-8 border border-yellow-400/30 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-4">
              Applications et Vérifications Expérimentales
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-gray-200 leading-relaxed">
              <p>
                La dilatation temporelle gravitationnelle n'est pas qu'une curiosité théorique.
                Elle a été vérifiée expérimentalement et a des applications concrètes :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-400/30">
                  <h3 className="text-lg font-semibold text-yellow-200 mb-2">GPS et Navigation</h3>
                  <p className="text-sm text-gray-300">
                    Les satellites GPS orbitent à environ 20 000 km d'altitude. À cette distance,
                    le champ gravitationnel est plus faible qu'à la surface. Les horloges des satellites
                    avancent donc plus vite (environ 45 microsecondes par jour). Sans correction
                    relativiste, le GPS aurait des erreurs de plusieurs kilomètres.
                  </p>
                </div>

                <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-400/30">
                  <h3 className="text-lg font-semibold text-orange-200 mb-2">Pulsars et Étoiles à Neutrons</h3>
                  <p className="text-sm text-gray-300">
                    Les étoiles à neutrons sont si denses que leur rayon est seulement quelques fois
                    supérieur à leur rayon de Schwarzschild. Les effets de dilatation temporelle y sont
                    extrêmes : le temps s'écoule significativement plus lentement à leur surface qu'ici.
                  </p>
                </div>

                <div className="bg-red-900/30 p-4 rounded-lg border border-red-400/30">
                  <h3 className="text-lg font-semibold text-red-200 mb-2">Trous Noirs</h3>
                  <p className="text-sm text-gray-300">
                    À l'horizon des événements d'un trou noir, le temps semble s'arrêter complètement
                    du point de vue d'un observateur extérieur. C'est la manifestation ultime de la
                    dilatation temporelle gravitationnelle.
                  </p>
                </div>

                <div className="bg-pink-900/30 p-4 rounded-lg border border-pink-400/30">
                  <h3 className="text-lg font-semibold text-pink-200 mb-2">Expérience de Pound-Rebka</h3>
                  <p className="text-sm text-gray-300">
                    En 1959, cette expérience a mesuré le décalage vers le rouge gravitationnel sur
                    seulement 22 mètres de hauteur, confirmant la théorie avec une précision de 1%.
                    C'était la première vérification directe de la dilatation temporelle gravitationnelle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};