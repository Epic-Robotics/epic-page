import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../api/services';
import type { Product, ApiError } from '../types/api';
import { Navigate } from 'react-router-dom';

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [managingFeatures, setManagingFeatures] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    isPublished: false,
    orderIndex: 0,
  });

  const [featureFormData, setFeatureFormData] = useState({
    subtitle: '',
    subDescription: '',
    orderIndex: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  // Redirect if not admin
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts(true); // Include all products (drafts and published)
      setProducts(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await productService.createProduct(formData);
      setSuccess('Producto creado exitosamente');
      setShowCreateForm(false);
      resetForm();
      loadProducts();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al crear producto');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setError('');
      await productService.updateProduct(editingProduct.id, formData);
      setSuccess('Producto actualizado exitosamente');
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al actualizar producto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estas seguro de eliminar este producto?')) return;

    try {
      setError('');
      await productService.deleteProduct(productId);
      setSuccess('Producto eliminado exitosamente');
      loadProducts();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al eliminar producto');
    }
  };

  const handleAddFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingFeatures) return;

    try {
      setError('');
      await productService.addFeature(managingFeatures.id, featureFormData);
      setSuccess('Caracteristica agregada exitosamente');
      resetFeatureForm();
      await loadProducts();
      // Refresh the managingFeatures with updated product
      const updatedProducts = await productService.getProducts(true);
      const updatedProduct = updatedProducts.find(p => p.id === managingFeatures.id);
      if (updatedProduct) {
        setManagingFeatures(updatedProduct);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al agregar caracteristica');
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm('¿Estas seguro de eliminar esta caracteristica?')) return;
    if (!managingFeatures) return;

    try {
      setError('');
      await productService.deleteFeature(featureId);
      setSuccess('Caracteristica eliminada exitosamente');
      await loadProducts();
      // Refresh the managingFeatures with updated product
      const updatedProducts = await productService.getProducts(true);
      const updatedProduct = updatedProducts.find(p => p.id === managingFeatures.id);
      if (updatedProduct) {
        setManagingFeatures(updatedProduct);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al eliminar caracteristica');
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      imageUrl: product.imageUrl || '',
      isPublished: product.isPublished,
      orderIndex: product.orderIndex,
    });
    setShowCreateForm(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      isPublished: false,
      orderIndex: 0,
    });
  };

  const resetFeatureForm = () => {
    setFeatureFormData({
      subtitle: '',
      subDescription: '',
      orderIndex: 0,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Gestion de Productos</h1>
            <p className="text-base-content/70">Administra los kits de robotica</p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingProduct(null);
              resetForm();
            }}
            className="btn btn-primary w-full sm:w-auto"
          >
            + Nuevo Producto
          </button>
        </div>

        {/* Success/Error Alerts */}
        {success && (
          <div className="alert alert-success mb-6">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="btn btn-sm btn-ghost">✕</button>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
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
            <button onClick={() => setError('')} className="btn btn-sm btn-ghost">✕</button>
          </div>
        )}

        {/* Create/Edit Form */}
        {(showCreateForm || editingProduct) && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title text-2xl">
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h2>
              <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Titulo</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Descripcion</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="textarea textarea-bordered h-24"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">URL de Imagen</span>
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="input input-bordered"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Orden</span>
                    </label>
                    <input
                      type="number"
                      value={formData.orderIndex}
                      onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                      className="input input-bordered"
                      min="0"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Publicado</span>
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        className="checkbox checkbox-primary"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="btn btn-ghost"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold mb-2">No hay productos</h2>
                <p className="text-base-content/70">Crea tu primer producto para comenzar</p>
              </div>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    {product.imageUrl && (
                      <div className="w-full md:w-32 h-32 flex-shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="card-title text-xl">{product.title}</h3>
                        <div className="flex gap-2">
                          {product.isPublished ? (
                            <span className="badge badge-success">Publicado</span>
                          ) : (
                            <span className="badge badge-warning">Borrador</span>
                          )}
                          <span className="badge badge-ghost">Orden: {product.orderIndex}</span>
                        </div>
                      </div>
                      <p className="text-base-content/70 mb-4">{product.description}</p>

                      {/* Features Count */}
                      <p className="text-sm text-base-content/60 mb-4">
                        Caracteristicas: {product.features?.length || 0}
                      </p>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => startEdit(product)}
                          className="btn btn-sm btn-primary"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setManagingFeatures(product)}
                          className="btn btn-sm btn-secondary"
                        >
                          Gestionar Caracteristicas
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="btn btn-sm btn-error"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Feature Management Modal */}
        {managingFeatures && (
          <div className="modal modal-open">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-2xl mb-4">
                Caracteristicas: {managingFeatures.title}
              </h3>

              {/* Add Feature Form */}
              <form onSubmit={handleAddFeature} className="space-y-4 mb-6 p-4 bg-base-200 rounded-lg">
                <h4 className="font-semibold text-lg">Agregar Nueva Caracteristica</h4>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Subtitulo</span>
                  </label>
                  <input
                    type="text"
                    value={featureFormData.subtitle}
                    onChange={(e) => setFeatureFormData({ ...featureFormData, subtitle: e.target.value })}
                    className="input input-bordered input-sm"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Descripcion</span>
                  </label>
                  <textarea
                    value={featureFormData.subDescription}
                    onChange={(e) => setFeatureFormData({ ...featureFormData, subDescription: e.target.value })}
                    className="textarea textarea-bordered textarea-sm h-20"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Orden</span>
                  </label>
                  <input
                    type="number"
                    value={featureFormData.orderIndex}
                    onChange={(e) => setFeatureFormData({ ...featureFormData, orderIndex: parseInt(e.target.value) })}
                    className="input input-bordered input-sm"
                    min="0"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-sm">
                  Agregar Caracteristica
                </button>
              </form>

              {/* Features List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {managingFeatures.features && managingFeatures.features.length > 0 ? (
                  managingFeatures.features
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((feature) => (
                      <div key={feature.id} className="card bg-base-100 border">
                        <div className="card-body p-4">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="badge badge-sm">Orden: {feature.orderIndex}</span>
                                <h5 className="font-semibold">{feature.subtitle}</h5>
                              </div>
                              <p className="text-sm text-base-content/70">{feature.subDescription}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteFeature(feature.id)}
                              className="btn btn-xs btn-error"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-center text-base-content/60 py-8">
                    No hay caracteristicas. Agrega la primera.
                  </p>
                )}
              </div>

              <div className="modal-action">
                <button
                  onClick={() => {
                    setManagingFeatures(null);
                    resetFeatureForm();
                  }}
                  className="btn"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
