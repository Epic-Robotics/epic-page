function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Lo Que Dicen Nuestros Estudiantes</h2>
          <p className="text-xl text-base-content/70">
            Miles de estudiantes han transformado sus habilidades
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="avatar placeholder mr-4">
                  <div className="bg-primary text-primary-content rounded-full w-12">
                    <span>MC</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold">Maria Gomez</h3>
                  <p className="text-sm">Estudiante de Ingenieria</p>
                </div>
              </div>
              <p className="text-base-content/80">
                Los cursos son increibles. Aprendi desde cero y ahora puedo construir
                mis propios robots. El contenido es muy claro y practico.
              </p>
              <div className="rating rating-sm mt-4">
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="avatar placeholder mr-4">
                  <div className="bg-secondary text-secondary-content rounded-full w-12">
                    <span>JR</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold">Juan Rodriguez</h3>
                  <p className="text-sm">Desarrollador</p>
                </div>
              </div>
              <p className="text-base-content/80">
                La comunidad es fantastica. Siempre hay alguien dispuesto a ayudar.
                He aprendido mucho mas de lo que esperaba.
              </p>
              <div className="rating rating-sm mt-4">
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="avatar placeholder mr-4">
                  <div className="bg-accent text-accent-content rounded-full w-12">
                    <span>AL</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold">Ana Lopez</h3>
                  <p className="text-sm">Profesora</p>
                </div>
              </div>
              <p className="text-base-content/80">
                Excelente plataforma para aprender robotica. Los proyectos practicos
                son muy utiles y los videos estan muy bien explicados.
              </p>
              <div className="rating rating-sm mt-4">
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
                <input type="radio" className="mask mask-star-2 bg-warning" checked readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
