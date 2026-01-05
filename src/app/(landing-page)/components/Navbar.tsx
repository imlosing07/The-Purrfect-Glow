"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useWishlist } from "@/src/app/lib/contexts/WishlistContext";
import { useCart } from "@/src/app/lib/contexts/CartContext";

export default function Navbar({ 
  onNavigate, 
  currentPage 
}: { 
  onNavigate: (page: string) => void; 
  currentPage: string 
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false);
        setShowUserMenu(false);
        setShowMobileMenu(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  const navItems = [
    { id: "/", label: "Home" },
    { id: "/hombre", label: "Hombre" },
    { id: "/mujer", label: "Mujer" },
    { id: "/ninos", label: "Niños" },
    { id: "/formal", label: "Formal" }
  ];

  const handleSignOut = async () => {
    setShowUserMenu(false);
    setShowMobileMenu(false);
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleNavigation = (page: string) => {
    setShowMobileMenu(false);
    onNavigate(page);
  };

  return (
    <>
      <nav className={`fixed w-full bg-white shadow-sm transition-transform duration-300 z-50 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button 
              onClick={() => handleNavigation("/")}
              className="text-xl sm:text-2xl font-bold cursor-pointer flex-shrink-0"
            >
              Sneakers<span className="text-gray-400">Hooes</span>
            </button>
            
            {/* Desktop Nav Items */}
            <div className="hidden lg:flex space-x-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`transition text-sm xl:text-base ${
                    currentPage === item.id 
                      ? 'text-black font-medium border-b-2 border-black' 
                      : 'text-gray-700 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Carrito */}
              <button 
                onClick={() => handleNavigation("/carrito")}
                className="relative p-2 text-gray-700 hover:text-black transition"
                aria-label="Carrito de compras"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* Favoritos - usando wishlistCount del contexto */}
              <button 
                onClick={() => handleNavigation("/favoritos")}
                className="relative p-2 text-gray-700 hover:text-black transition"
                aria-label="Lista de favoritos"
              >
                <Heart className={wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </button>

              {/* Auth Section */}
              {status === "loading" ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : session?.user ? (
                // Usuario autenticado
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
                    aria-label="Menú de usuario"
                  >
                    {session.user.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <span className="hidden xl:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {session.user.name?.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user.email}
                        </p>
                      </div>
                      
                      {/* Dashboard link solo para ADMIN */}
                      {session.user.role === 'ADMIN' && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            router.push('/dashboard');
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </button>
                      )}
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Usuario NO autenticado
                <button 
                  onClick={() => router.push('/login')}
                  className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-gray-700 hover:text-black transition"
                aria-label="Menú de navegación"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-16 left-0 right-0 bg-white shadow-lg z-40 lg:hidden transition-transform duration-300 ${
        showMobileMenu ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`text-left px-4 py-3 rounded-lg transition ${
                  currentPage === item.id 
                    ? 'bg-gray-100 text-black font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}