
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <section className="section-padding bg-white dark:bg-gray-800">
          <div className="container-padded">
            <div className="max-w-4xl mx-auto">
              <h1 className="heading-1 text-mecahub-contrast dark:text-white mb-8">
                Politique de confidentialité – MecaHUB Pro
              </h1>
              
              <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                <section>
                  <h2 className="heading-3 text-mecahub-contrast dark:text-white mb-3">
                    1. Introduction
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Le site www.mecahubpro.fr est opéré par MecaHUB, SARL immatriculée au RCS d'Évry. Cette politique de confidentialité explique comment nous traitons les données personnelles collectées via ce site, conformément au Règlement Général sur la Protection des Données (RGPD).
                  </p>
                </section>

                <section>
                  <h2 className="heading-3 text-mecahub-contrast dark:text-white mb-3">
                    2. Responsable du traitement
                  </h2>
                  <div className="text-gray-600 dark:text-gray-300 space-y-1">
                    <p><strong>MecaHUB – SARL</strong></p>
                    <p>2 allée des Bouleaux, 91420 Morangis – France</p>
                    <p>SIRET : 940 757 677 00015</p>
                    <p>Email : contact@mecahub.fr</p>
                  </div>
                </section>

                <section>
                  <h2 className="heading-3 text-mecahub-contrast dark:text-white mb-3">
                    3. Données collectées
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Les données personnelles collectées proviennent exclusivement des formulaires du site :
                  </p>
                  <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1 mb-4">
                    <li>Formulaire de demande de devis / contact professionnel</li>
                    <li>Formulaire de candidature freelance ou salarié</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Les données collectées peuvent inclure :
                  </p>
                  <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                    <li>Nom et prénom</li>
                    <li>Adresse email professionnelle</li>
                    <li>Numéro de téléphone</li>
                    <li>Nom de l'entreprise</li>
                    <li>Message libre</li>
                    <li>Statut (freelance, salarié…)</li>
                    <li>Compétences / secteur</li>
                    <li>CV ou tout autre fichier joint</li>
                  </ul>
                </section>

                <section>
                  <h2 className="heading-3 text-mecahub-contrast dark:text-white mb-3">
                    4. Finalité du traitement
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Les données sont utilisées uniquement pour :
                  </p>
                  <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1 mb-4">
                    <li>Répondre à une demande de contact ou de devis dans le cadre d'une relation professionnelle ou précontractuelle</li>
                    <li>Étudier une candidature pour une mission ou un futur recrutement</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300">
                    Elles ne sont pas utilisées à des fins publicitaires et ne font l'objet d'aucune revente à des tiers.
                  </p>
                </section>

                <section>
                  <h2 className="heading-3 text-mecahub-contrast dark:text-white mb-3">
                    5. Base légale
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Le traitement repose :
                  </p>
                  <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                    <li>Sur le consentement explicite de l'utilisateur lorsqu'il soumet un formulaire</li>
                    <li>Sur l'intérêt légitime de MecaHUB à gérer ses relations commerciales ou précontractuelles</li>
                  </ul>
                </section>

                <section>
                  <h2 className="heading-3 text-mecahub-contrast dark:text-white mb-3">
                    6. Durée de conservation
                  </h2>
                  <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                    <li>Les données des demandes de devis sont conservées 24 mois maximum</li>
                    <li>Les données des candidatures sont conservées 12 mois maximum</li>
                  </ul>
                </section>

                <section>
                  <h2 className="heading-3 text-mecahub-contrast dark:text-white mb-3">
                    7. Destinataires
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Les données ne sont accessibles qu'à l'équipe de MecaHUB.
                    Aucune donnée n'est transmise à un tiers externe, partenaire ou sous-traitant non nécessaire.
                  </p>
                </section>

                <section>
                  <h2 className="heading-3 text-mecahub-contrast dark:text-white mb-3">
                    8. Vos droits
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Conformément au RGPD, vous disposez à tout moment des droits suivants :
                  </p>
                  <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1 mb-4">
                    <li>Accès à vos données</li>
                    <li>Rectification ou mise à jour</li>
                    <li>Suppression ("droit à l'oubli")</li>
                    <li>Opposition ou limitation du traitement</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Pour exercer vos droits, contactez-nous à :
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    📧 contact@mecahub.fr
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Réponse sous 30 jours maximum.
                  </p>
                </section>

                <section>
                  <h2 className="heading-3 text-mecahub-contrast dark:text-white mb-3">
                    9. Sécurité
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour assurer la confidentialité, l'intégrité et la sécurité de vos données.
                  </p>
                </section>

                <section>
                  <h2 className="heading-3 text-mecahub-contrast dark:text-white mb-3">
                    10. Cookies
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Le site ne dépose aucun cookie publicitaire ou de traçage.
                    Seuls des cookies techniques essentiels au fonctionnement du site peuvent être utilisés (ex. : gestion du mode sombre, préférences d'affichage).
                  </p>
                </section>

                <section>
                  <h2 className="heading-3 text-mecahub-contrast dark:text-white mb-3">
                    11. Mise à jour
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Cette politique peut être modifiée à tout moment pour respecter les évolutions réglementaires.
                    <br />
                    Dernière mise à jour : juin 2025
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
