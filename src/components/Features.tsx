function Features() {
  return (
    <section id="features" className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Caracteristicas Principales</h2>
          <p className="text-xl text-base-content/70">
            Todo lo que necesitas para dominar la robotica
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Cursos Estructurados</h3>
              <p>
                Aprende paso a paso desde lo basico hasta conceptos avanzados con
                nuestros cursos disenados por expertos.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Proyectos Practicos</h3>
              <p>
                Construye robots reales mientras aprendes. Cada leccion incluye
                proyectos hands-on.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Comunidad Activa</h3>
              <p>
                Unete a miles de estudiantes. Comparte ideas, resuelve dudas y
                colabora en proyectos.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Videos HD</h3>
              <p>
                Tutoriales en video de alta calidad con explicaciones claras y
                demostraciones detalladas.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Certificaciones</h3>
              <p>
                Obten certificados reconocidos al completar cada nivel de
                aprendizaje.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Soporte 24/7</h3>
              <p>
                Nuestro equipo y comunidad estan disponibles para ayudarte en
                cualquier momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
