import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../api/services';
import type { Product, ApiError } from '../types/api';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al cargar el producto');
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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="card-title justify-center text-2xl">Producto no encontrado</h2>
            <p className="text-base-content/70">{error || 'El producto que buscas no existe'}</p>
            <div className="card-actions justify-center mt-4">
              <Link to="/productos" className="btn btn-primary">
                Volver a Productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Breadcrumb */}
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="text-sm breadcrumbs">
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li>{product.title}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image */}
          <div className="order-1">
            {product.imageUrl ? (
              <figure className="rounded-lg overflow-hidden bg-base-100 shadow-xl">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-auto object-cover"
                />
              </figure>
            ) : (
              <div className="bg-base-100 rounded-lg shadow-xl aspect-square flex items-center justify-center">
                <div className="text-center text-base-content/40">
                  <div className="text-8xl mb-4">📦</div>
                  <p className="text-lg">Sin imagen</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="order-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{product.title}</h1>
            
            <div className="prose max-w-none mb-6">
              <p className="text-base md:text-lg text-base-content/80">{product.description}</p>
            </div>

            {/* Features Section */}
            {product.features && product.features.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Caracteristicas</h2>
                <div className="space-y-6">
                  {product.features
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((feature) => (
                      <div key={feature.id} className="card bg-base-100 shadow-md">
                        <div className="card-body p-4 md:p-6">
                          <h3 className="card-title text-lg md:text-xl">{feature.subtitle}</h3>
                          <p className="text-sm md:text-base text-base-content/70">
                            {feature.subDescription}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="card bg-primary text-primary-content shadow-xl mt-8">
              <div className="card-body">
                <h3 className="card-title text-xl">¿Interesado en este producto?</h3>
                <p>Contacta con nuestro equipo para obtener mas informacion y disponibilidad</p>
                <div className="card-actions justify-end mt-4">
                  <Link to="/contact" className="btn btn-secondary">
                    Contactar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 md:mt-16">
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-bold">Nota importante</h3>
              <div className="text-sm">
                Los kits incluyen todos los componentes necesarios y material de apoyo para tu aprendizaje.
              </div>
            </div>
          </div>
        </div>

        {/* Related Products CTA */}
        <div className="text-center mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Explora mas productos</h2>
          <p className="text-base-content/70 mb-6">
            Descubre otros kits de robotica disponibles
          </p>
          <Link to="/productos" className="btn btn-primary btn-lg">
            Ver Todos los Productos
          </Link>
        </div>
      </div>
    </div>
  );
}
