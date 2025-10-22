function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Planes de Precio</h2>
          <p className="text-xl text-base-content/70">
            Elige el plan perfecto para ti
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-4">Basico</h3>
              <div className="text-4xl font-bold mb-6">
                $0<span className="text-xl">/mes</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="mr-2"></span>
                  <span>Acceso a cursos basicos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2"></span>
                  <span>Comunidad de estudiantes</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2"></span>
                  <span>Videos tutoriales</span>
                </li>
              </ul>
              <button className="btn btn-outline w-full">Comenzar Gratis</button>
            </div>
          </div>

          <div className="card bg-primary text-primary-content shadow-2xl scale-105">
            <div className="card-body">
              <div className="badge badge-secondary mb-2">Popular</div>
              <h3 className="card-title text-2xl mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-6">
                $29<span className="text-xl">/mes</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="mr-2"></span>
                  <span>Todo lo del plan Basico</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2"></span>
                  <span>Cursos intermedios y avanzados</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2"></span>
                  <span>Proyectos premium</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2"></span>
                  <span>Certificados oficiales</span>
                </li>
              </ul>
              <button className="btn btn-secondary w-full">Elegir Pro</button>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-4">Empresa</h3>
              <div className="text-4xl font-bold mb-6">
                $99<span className="text-xl">/mes</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="mr-2"></span>
                  <span>Todo lo del plan Pro</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2"></span>
                  <span>Hasta 10 usuarios</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2"></span>
                  <span>Soporte prioritario</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2"></span>
                  <span>Mentoria personalizada</span>
                </li>
              </ul>
              <button className="btn btn-outline w-full">Contactar Ventas</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
