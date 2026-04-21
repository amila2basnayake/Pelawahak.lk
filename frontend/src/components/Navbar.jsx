import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const NavLinks = () => (
    <>
      <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-sm md:text-[11px] font-black text-wedding-brown hover:text-wedding-gold uppercase tracking-[0.2em] transition-colors">Home</Link>
      <Link to="/partner" onClick={() => setIsMenuOpen(false)} className="text-sm md:text-[11px] font-black text-wedding-brown hover:text-wedding-gold uppercase tracking-[0.2em] transition-colors">Find Partner</Link>
      
      {user ? (
        <>
          {user.role === 'admin' ? (
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-sm md:text-[11px] font-black text-wedding-brown hover:text-wedding-gold uppercase tracking-[0.2em] transition-colors">Admin</Link>
          ) : (
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm md:text-[11px] font-black text-wedding-brown hover:text-wedding-gold uppercase tracking-[0.2em] transition-colors">Dashboard</Link>
          )}
          
          <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="text-sm md:text-[11px] font-black text-wedding-brown hover:text-wedding-gold uppercase tracking-[0.2em] transition-colors flex items-center gap-3">
            Messages
            <span className="w-2 h-2 bg-wedding-gold rounded-full animate-pulse shadow-[0_0_8px_#E6C200]"></span>
          </Link>
          
          <Link to="/post-ad" onClick={() => setIsMenuOpen(false)} className="bg-wedding-brown text-wedding-cream px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg hover:bg-black text-center">
             POST YOUR AD ✨
          </Link>
          
          <button onClick={handleLogout} className="text-sm md:text-[11px] font-black text-red-400 hover:text-red-600 uppercase tracking-[0.2em] transition-colors text-left">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-sm md:text-[11px] font-black text-wedding-brown hover:text-wedding-gold uppercase tracking-[0.2em] transition-colors">Login</Link>
          <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-sm md:text-[11px] font-black text-wedding-brown hover:text-wedding-gold uppercase tracking-[0.2em] transition-colors">Register</Link>
          <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-wedding-gold text-wedding-brown px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg hover:bg-wedding-brown hover:text-white text-center">
             POST YOUR AD
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-wedding-cream/80 backdrop-blur-md sticky top-0 z-[100] border-b border-wedding-gold/20">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20 ">
          <Link to="/" className="text-3xl font-black text-wedding-brown uppercase tracking-tighter z-[110]">
            Pelawahak<span className="text-wedding-gold">.lk</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center ">
            <NavLinks />
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden z-[110] w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
          >
            <span className={`w-6 h-0.5 bg-wedding-brown transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-wedding-brown transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-wedding-brown transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* Mobile Menu Drawer */}
          <div className={`fixed inset-0 bg-wedding-cream/95 backdrop-blur-2xl  z-[105] flex flex-col p-10 pt-32 space-y-8 transition-all duration-500 ease-in-out md:hidden ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
             <div className="flex flex-col space-y-8 border-t border-wedding-gold/10 pt-10">
                <NavLinks />
             </div>
             
             <div className="mt-auto border-t border-wedding-gold/10 pt-8 text-center">
                <p className="text-[10px] font-black text-wedding-brown/60 uppercase tracking-[0.3em]">Sri Lanka's Premium Registry</p>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
