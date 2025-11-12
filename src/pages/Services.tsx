import { Link } from 'react-router-dom';

function Services() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero bg-primary text-primary-content py-20">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">Nuestros Servicios</h1>
            <p className="text-xl">
              Todo lo que necesitas para comenzar tu viaje en robótica
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Cursos Online</h2>
              <p>
                Accede a nuestros cursos estructurados desde básico hasta avanzado,
                con videos, ejercicios prácticos y proyectos.
              </p>
              <div className="card-actions justify-end">
                <Link to="/cursos" className="btn btn-primary">
                  Ver Cursos
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Talleres Presenciales</h2>
              <p>
                Participa en talleres prácticos donde podrás trabajar con robots
                reales y aprender de expertos.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Inscríbete</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Mentoría Personalizada</h2>
              <p>
                Recibe orientación uno a uno de profesionales experimentados en
                robótica para alcanzar tus objetivos.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Reservar</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Kits de Robótica</h2>
              <p>
                Compra kits de robótica especialmente seleccionados para cada
                nivel de aprendizaje.
              </p>
              <div className="card-actions justify-end">
                <Link to="/productos" className="btn btn-primary">
                  Explorar
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Certificaciones</h2>
              <p>
                Obtén certificaciones reconocidas que validan tus habilidades en
                robótica y programación.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Certificarse</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Comunidad</h2>
              <p>
                Únete a nuestra comunidad activa, comparte proyectos, haz
                preguntas y colabora con otros entusiastas.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Unirse</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-4xl font-bold mb-8">
            ¿Por qué Elegir Nuestros Servicios?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="stat place-items-center">
              <div className="stat-value text-primary">100+</div>
              <div className="stat-title">Cursos Disponibles</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-value text-secondary">500+</div>
              <div className="stat-title">Estudiantes Activos</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-value text-accent">4.9/5</div>
              <div className="stat-title">Calificación Promedio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
