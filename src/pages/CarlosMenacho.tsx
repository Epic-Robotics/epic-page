import { Link } from 'react-router-dom';

function CarlosMenacho() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero bg-primary text-primary-content py-20">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">Carlos Menacho</h1>
            <p className="text-xl">Fundador y Director de Epic Robotics</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link to="/about" className="btn btn-ghost">
            ← Volver a Sobre Nosotros
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="avatar placeholder mb-4">
                  <div className="bg-primary text-primary-content rounded-full w-32">
                    <span className="text-4xl">CM</span>
                  </div>
                </div>
                <h2 className="card-title">Carlos H. Menacho Guerra</h2>
                <p className="text-base-content/70">Fundador y CEO</p>
                <div className="divider"></div>
                <div className="w-full text-left space-y-2">
                  <p className="flex items-center">
                    <span className="font-semibold mr-2">Email:</span>
                    menachocarlos5@gmail.com
                  </p>
                  <p className="flex items-center">
                    <span className="font-semibold mr-2">LinkedIn:</span>
                    <a
                      href="https://www.linkedin.com/in/carlos-helsner-menacho-guerra-b933a4119/"
                      className="link link-primary"
                    >
                      Ver perfil
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Biografia</h2>
                <p className="mb-4">
                  Carlos Menacho es el fundador y director de Epic Robotics, una
                  plataforma educativa dedicada a la ensenanza de robotica y
                  programacion. Con mas de 10 anos de experiencia en el campo de
                  la robotica educativa, Carlos ha ayudado a miles de
                  estudiantes a descubrir su pasion por la tecnologia.
                </p>
                <p className="mb-4">
                  Antes de fundar Epic Robotics en 2020, Carlos trabajo como
                  ingeniero de robotica en diversas empresas tecnologicas, donde
                  desarrollo su experiencia en automatizacion, inteligencia
                  artificial y sistemas embebidos.
                </p>
                <p>
                  Su vision es hacer que la educacion en robotica sea accesible
                  para todos, sin importar su nivel de experiencia o ubicacion
                  geografica.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Educacion</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold">Maestria en Robotica</h3>
                    <p className="text-base-content/70">
                      Universidad Tecnologica - 2015
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold">Ingenieria en Sistemas</h3>
                    <p className="text-base-content/70">
                      Universidad Nacional - 2013
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Experiencia</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold">
                      Fundador y CEO - Epic Robotics
                    </h3>
                    <p className="text-base-content/70 mb-2">2020 - Presente</p>
                    <p>
                      Liderando la vision y estrategia de la plataforma
                      educativa, desarrollando contenido de alta calidad y
                      construyendo una comunidad de aprendizaje activa.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold">Ingeniero Senior de Robotica</h3>
                    <p className="text-base-content/70 mb-2">2016 - 2020</p>
                    <p>
                      Desarrollo de sistemas roboticos autonomos y soluciones de
                      automatizacion industrial.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold">Ingeniero de Software</h3>
                    <p className="text-base-content/70 mb-2">2013 - 2016</p>
                    <p>
                      Desarrollo de aplicaciones y sistemas embebidos para
                      dispositivos IoT.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarlosMenacho;
