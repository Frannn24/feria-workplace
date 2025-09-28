'use client'

import Image from 'next/image'
import { Product } from '@/lib/supabase'

interface ProductCardProps {
  product: Product
  onClick?: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const categoryName = product.categories?.name || 'Sin categoría'
  
  return (
    <div 
      className="card overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform"
      onClick={onClick}
    >
      {/* Imagen del producto */}
      <div className="relative aspect-square">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDSEIzTHshewHo/HOh2DihPo/l9CPqOwx9q4z8j5SkPHI6tqt1sECJiGPp4+sB/qj1RRh6w6w6gUwdqBEoKwKK2hs5l+CK7Qm2aJz+nCGRGjz5Uag"
        />
        
        {/* Badge de categoría */}
        <div className="absolute top-2 left-2">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
            {categoryName}
          </span>
        </div>
        
        {/* Badge de poco stock */}
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Poco stock
            </span>
          </div>
        )}
        
        {/* Badge de sin stock */}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Sin stock
            </span>
          </div>
        )}
      </div>
      
      {/* Información del producto */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 truncate mb-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-primary">
            ${product.price.toLocaleString()}
          </span>
          
          <span className="text-xs text-gray-500">
            {product.stock} {product.stock === 1 ? 'disponible' : 'disponibles'}
          </span>
        </div>
      </div>
    </div>
  )
}