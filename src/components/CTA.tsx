function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center text-primary-content">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Comienza Tu Viaje en Robotica Hoy
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Unete a miles de estudiantes que estan aprendiendo las habilidades
            del futuro. Empieza gratis y actualiza cuando estes listo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-lg bg-white text-primary hover:bg-base-200">
              Comenzar Gratis
            </button>
            <button className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-primary">
              Ver Planes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
