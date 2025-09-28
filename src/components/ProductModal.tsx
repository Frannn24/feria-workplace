'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ExternalLink } from 'lucide-react'
import { Product, Profile } from '@/lib/supabase'

interface ProductModalProps {
  product: Product | null
  profile: Profile | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductModal({ product, profile, isOpen, onClose }: ProductModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => setIsVisible(false), 150)
      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isVisible || !product) return null

  const categoryName = product.categories?.name || 'Sin categoría'
  
  // URLs de compra
  const mercadopagoUrl = profile?.mercadopago_link 
    ? `${profile.mercadopago_link}?name=${encodeURIComponent(product.name)}&price=${product.price}`
    : '#'
  
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678'
  const whatsappText = `Hola! Me interesa el producto: ${product.name} - $${product.price.toLocaleString()}. ¿Tienen stock disponible?`
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-transform duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="p-6">
          {/* Imagen del producto */}
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
            
            {/* Badge de categoría */}
            <div className="absolute top-3 left-3">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                {categoryName}
              </span>
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Precio y stock */}
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-blue-600">
                ${product.price.toLocaleString()}
              </span>
              <div className="text-right">
                <span className={`text-sm font-medium ${
                  product.stock > 10 ? 'text-green-600' :
                  product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                </span>
              </div>
            </div>

            {/* Información adicional */}
            {product.additional_info && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Información adicional
                </h3>
                <p className="text-sm text-gray-600">
                  {product.additional_info}
                </p>
              </div>
            )}

            {/* Botones de compra */}
            <div className="border-t pt-4 space-y-3">
              {product.stock > 0 ? (
                <>
                  {/* Mercado Pago */}
                  {profile?.mercadopago_link && (
                    <a
                      href={mercadopagoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <span className="text-lg">💰</span>
                      <span>Comprar con Mercado Pago</span>
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <span className="text-lg">💬</span>
                    <span>Consultar por WhatsApp</span>
                    <ExternalLink size={16} />
                  </a>
                </>
              ) : (
                <div className="w-full bg-gray-300 text-gray-600 px-4 py-3 rounded-lg font-medium text-center">
                  Producto sin stock
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}