import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../api/services';
import type { Product, ApiError } from '../types/api';
import { useAuth } from '../contexts/AuthContext';

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadProducts();
  }, [isAdmin]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Only include draft products if user is an admin
      const data = await productService.getProducts(isAdmin);
      setProducts(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero bg-primary text-primary-content py-16 md:py-20">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Kits de Robotica
            </h1>
            <p className="text-lg md:text-xl">
              Explora nuestra seleccion de kits de robotica especialmente
              disenados para cada nivel de aprendizaje
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 pt-6">
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2">
              No hay productos disponibles
            </h2>
            <p className="text-base-content/70">
              Pronto tendremos kits de robotica disponibles para ti
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
              >
                {/* Product Image */}
                {product.imageUrl && (
                  <figure className="h-48 md:h-56 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                )}

                {/* Product Content */}
                <div className="card-body p-4 md:p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="card-title text-xl md:text-2xl">
                      {product.title}
                    </h2>
                    {!product.isPublished && (
                      <span className="badge badge-warning badge-sm">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base text-base-content/70 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {product.features.slice(0, 3).map((feature) => (
                        <div
                          key={feature.id}
                          className="border-l-2 border-primary pl-3"
                        >
                          <h3 className="font-semibold text-sm md:text-base">
                            {feature.subtitle}
                          </h3>
                          <p className="text-xs md:text-sm text-base-content/60 line-clamp-2">
                            {feature.subDescription}
                          </p>
                        </div>
                      ))}
                      {product.features.length > 3 && (
                        <p className="text-xs md:text-sm text-primary font-medium">
                          +{product.features.length - 3} caracteristicas mas
                        </p>
                      )}
                    </div>
                  )}

                  <div className="card-actions justify-end mt-4">
                    <Link
                      to={`/productos/${product.id}`}
                      className="btn btn-primary w-full sm:w-auto"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      {products.length > 0 && (
        <div className="bg-base-100 py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Necesitas ayuda para elegir?
            </h2>
            <p className="text-base md:text-lg text-base-content/70 mb-6 max-w-2xl mx-auto">
              Nuestro equipo esta listo para ayudarte a encontrar el kit
              perfecto para tus necesidades
            </p>
            <button className="btn btn-primary btn-lg">Contactar Asesor</button>
          </div>
        </div>
      )}
    </div>
  );
}
