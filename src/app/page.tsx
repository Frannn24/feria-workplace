'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import ProductModal from '@/components/ProductModal'
import { db, Product, Profile, Category } from '@/lib/supabase'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Por defecto, cargamos el primer usuario registrado o un ID demo
  const [currentUserId, setCurrentUserId] = useState<string>('')

  useEffect(() => {
    loadPublicData()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, searchQuery])

  async function loadPublicData() {
    try {
      setLoading(true)
      setError(null)

      // Para el demo, intentamos cargar cualquier tienda pública
      const allProducts = await db.getProducts()
      
      if (allProducts.length === 0) {
        setError('No hay productos disponibles')
        return
      }

      // Obtener el primer usuario que tenga productos
      const firstUserId = allProducts[0]?.user_id
      if (firstUserId) {
        setCurrentUserId(firstUserId)
        
        // Cargar datos específicos de este usuario
        const [userProducts, userProfile, userCategories] = await Promise.all([
          db.getPublicProducts(firstUserId),
          db.getProfile(firstUserId).catch(() => null),
          db.getCategories(firstUserId).catch(() => [])
        ])

        setProducts(userProducts)
        setProfile(userProfile)
        setCategories(userCategories)
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  function filterProducts() {
    let filtered = [...products]

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.categories?.name === selectedCategory
      )
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.categories?.name.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }

  function handleCategoryFilter(category: string) {
    setSelectedCategory(category)
  }

  function handleProductClick(product: Product) {
    setSelectedProduct(product)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido a Mi Tienda de Arte!</h2>
            <p className="text-gray-600 mb-6">
              Esta es una demo de la plataforma. Para ver productos reales, necesitas:
            </p>
            <div className="space-y-2 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">1.</span>
                <span>Registrarte como artista</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">2.</span>
                <span>Agregar tus productos desde el panel admin</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">3.</span>
                <span>Compartir el enlace de tu tienda</span>
              </div>
            </div>
            <div className="mt-6">
              <a href="/auth" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Comenzar como Artista
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header profile={profile || undefined} />
      
      {/* Información del artista */}
      {profile && (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              {profile.avatar_url && (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.name}
                  className="rounded-full mx-auto mb-4 w-24 h-24 border-4 border-white object-cover"
                />
              )}
              <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
              {profile.specialty && (
                <p className="mb-4 text-purple-100">{profile.specialty}</p>
              )}
              
              {/* Redes sociales */}
              <div className="flex justify-center space-x-4">
                {profile.instagram && (
                  <a 
                    href={profile.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-300 transition-colors"
                  >
                    <span className="text-2xl">📷</span>
                  </a>
                )}
                {profile.tiktok && (
                  <a 
                    href={profile.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-300 transition-colors"
                  >
                    <span className="text-2xl">🎵</span>
                  </a>
                )}
                {profile.facebook && (
                  <a 
                    href={profile.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-300 transition-colors"
                  >
                    <span className="text-2xl">👍</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Métodos de pago */}
      {profile && (
        <section className="bg-white py-4 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">🏦</span>
                <span>Transferencia Bancaria</span>
              </div>
              {profile.mercadopago_link && (
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">💳</span>
                  <span>Mercado Pago</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-green-500">💵</span>
                <span>Efectivo</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtros y búsqueda */}
      <section className="bg-white sticky top-16 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Barra de búsqueda */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filtros de categoría */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleCategoryFilter('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos ({products.length})
            </button>
            
            {categories.map((category) => {
              const count = products.filter(p => p.categories?.name === category.name).length
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.name)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name.charAt(0).toUpperCase() + category.name.slice(1)} ({count})
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Grid de productos */}
      <main className="container mx-auto px-4 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || selectedCategory !== 'all' 
                ? 'No se encontraron productos' 
                : 'No hay productos disponibles'
              }
            </h3>
            <p className="text-gray-600">
              {searchQuery || selectedCategory !== 'all'
                ? 'Intenta con otros términos de búsqueda o categorías'
                : 'El artista aún no ha agregado productos a su tienda'
              }
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Ver todos los productos
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal de producto */}
      <ProductModal
        product={selectedProduct}
        profile={profile}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}