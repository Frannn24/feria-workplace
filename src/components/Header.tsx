'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Palette, Settings, Store, LogOut } from 'lucide-react'
import { Profile } from '@/lib/supabase'

interface HeaderProps {
  profile?: Profile
  showAdminToggle?: boolean
  isAdmin?: boolean
}

export default function Header({ profile, showAdminToggle = true, isAdmin = false }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    // Obtener usuario actual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setShowUserMenu(false)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo y título */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Palette className="text-blue-600 text-xl" />
            <h1 className="text-xl font-bold">
              {profile?.name || 'Mi Tienda de Arte'}
            </h1>
          </Link>

          {/* Información del artista (solo en vista pública) */}
          {profile && !isAdmin && (
            <div className="hidden md:block text-center">
              <h2 className="font-semibold">{profile.name}</h2>
              {profile.specialty && (
                <p className="text-sm text-gray-600">{profile.specialty}</p>
              )}
            </div>
          )}

          {/* Controles del usuario */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">
                    {user.email}
                  </span>
                </button>

                {/* Menú desplegable */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
                    <div className="p-2">
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={16} />
                        <span>Panel Admin</span>
                      </Link>
                      
                      {user && (
                        <Link
                          href={`/${user.id}`}
                          className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Store size={16} />
                          <span>Mi Tienda</span>
                        </Link>
                      )}
                      
                      <hr className="my-2" />
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded text-red-600"
                      >
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              showAdminToggle && (
                <Link
                  href="/auth"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  <Settings className="inline mr-1" size={16} />
                  Ingresar
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* Cerrar menú al hacer clic fuera */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}