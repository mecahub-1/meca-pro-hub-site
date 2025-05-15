
import { Link } from "react-router-dom";

export function RecruitmentCard() {
  return (
    <section className="section-padding bg-white dark:bg-gray-800">
      <div className="container-padded">
        <div className="max-w-4xl mx-auto bg-mecahub-secondary dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div className="p-8 md:p-10">
            <h2 className="heading-3 text-mecahub-contrast dark:text-white mb-6">
              MecaHUB Pro recrute des freelances, mais aussi des ingénieurs et dessinateurs projeteurs salariés pour missions longues.
            </h2>
            <div className="flex justify-center">
              <Link to="/join" className="btn-primary">
                Je souhaite rejoindre l'équipe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
