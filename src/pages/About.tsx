import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero bg-primary text-primary-content py-20">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">Sobre Nosotros</h1>
            <p className="text-xl">
              Somos una plataforma dedicada a la educación en robótica
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-4">Nuestra Misión</h2>
            <p className="text-lg mb-4">
              Hacer que la robótica sea accesible para todos, desde
              principiantes hasta expertos, a través de recursos educativos de
              alta calidad y una comunidad activa.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Nuestra Visión</h2>
            <p className="text-lg mb-4">
              Convertirnos en la plataforma líder de aprendizaje en robótica,
              formando a la próxima generación de innovadores y creadores.
            </p>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-8">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title justify-center">Innovación</h3>
                <p>
                  Buscamos constantemente nuevas formas de enseñar y aprender
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title justify-center">Comunidad</h3>
                <p>Fomentamos un ambiente de colaboración y apoyo mutuo</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title justify-center">Excelencia</h3>
                <p>Nos comprometemos con la calidad en todo lo que hacemos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-8">Nuestro Equipo</h2>
          <p className="text-lg mb-8 text-base-content/70">
            Conoce a las personas detras de Epic Robotics
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              to="/about/carlosMenacho"
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body items-center text-center">
                <div className="avatar placeholder mb-4">
                  <div className="bg-primary text-primary-content rounded-full w-24">
                    <span className="text-3xl">CM</span>
                  </div>
                </div>
                <h3 className="card-title">Carlos H. Menacho Guerra</h3>
                <p className="text-base-content/70">Fundador y CEO</p>
                <p className="mt-2">
                  Experto en Visión e Inteligencia Artificial aplicado en
                  robots. Investigador académico.
                </p>
                <div className="card-actions mt-4">
                  <button className="btn btn-primary btn-sm">Ver Perfil</button>
                </div>
              </div>
            </Link>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="avatar placeholder mb-4">
                  <div className="bg-secondary text-secondary-content rounded-full w-24">
                    <span className="text-3xl">MG</span>
                  </div>
                </div>
                <h3 className="card-title">Marlon Soza</h3>
                <p className="text-base-content/70">CTO</p>
                <p className="mt-2">
                  Especialista en educacion y desarrollo de cursos
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="avatar placeholder mb-4">
                  <div className="bg-accent text-accent-content rounded-full w-24">
                    <span className="text-3xl">JR</span>
                  </div>
                </div>
                <h3 className="card-title">Giovanni Blanco</h3>
                <p className="text-base-content/70">COO</p>
                <p className="mt-2">
                  Desarrollador de plataformas y sistemas roboticos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
