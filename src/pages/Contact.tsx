function Contact() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero bg-primary text-primary-content py-20">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">Contáctanos</h1>
            <p className="text-xl">
              Estamos aquí para ayudarte. Envíanos un mensaje
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Envíanos un Mensaje</h2>
            <form className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre</span>
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Asunto</span>
                </label>
                <input
                  type="text"
                  placeholder="¿En qué podemos ayudarte?"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mensaje</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  placeholder="Tu mensaje"
                ></textarea>
              </div>
              <button className="btn btn-primary w-full">Enviar Mensaje</button>
            </form>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">Información de Contacto</h2>
            <div className="space-y-6">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Email</h3>
                  <p>epic.robotics.bo@gmail.com</p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Teléfono</h3>
                  <p>+591 79151039</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Atención Virtual</h3>
                  <p>
                    Lunes - Viernes: 9:00 AM - 6:00 PM
                    <br />
                    Sábado - Domingo: Cerrado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
