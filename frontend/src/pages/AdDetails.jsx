import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [showNumber, setShowNumber] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/ads/${id}`);
        setAd(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
        if (err.response?.status === 404) {
          setError('This ad has been removed or does not exist.');
        } else if (err.response?.status === 400) {
          setError('Invalid ad ID format. Please check the link and try again.');
        } else {
          setError('Could not connect to the server. Please check your internet and try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAd();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-gold mb-4"></div>
      <p className="text-wedding-brown font-black uppercase tracking-widest text-xs">Fetching Ad details...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto mt-20 p-12 bg-wedding-cream border border-wedding-gold/20 rounded-[3rem] shadow-2xl text-center">
      <div className="text-6xl mb-6">✨</div>
      <h2 className="text-2xl font-black text-wedding-brown uppercase mb-4 tracking-tighter">Something went wrong</h2>
      <p className="text-wedding-brown/60 font-medium mb-10 leading-relaxed px-10">{error}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => navigate(-1)} className="bg-wedding-brown text-wedding-cream px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-wedding-brown/20">Go Back</button>
        <button onClick={() => navigate('/')} className="bg-white text-wedding-gold border-2 border-wedding-gold/20 px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-wedding-gold transition-all">Back to Home</button>
      </div>
    </div>
  );

  if (!ad) return (
    <div className="text-center py-20">
      <p className="mb-4 font-black uppercase tracking-widest text-xs text-wedding-brown/40">Ad not found.</p>
      <button onClick={() => navigate('/')} className="text-wedding-gold font-black uppercase tracking-widest text-xs">Go to Home</button>
    </div>
  );

  const images = ad.images && Array.isArray(ad.images) && ad.images.length > 0 
      ? ad.images.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`)
      : ['https://via.placeholder.com/600x400?text=No+Image'];  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fadeIn space-y-8 md:space-y-12">
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-wedding-gold/10">
        <div className="flex flex-col lg:flex-row">
          
          {/* IMAGE SECTION */}
          <div className="w-full lg:w-2/3 p-4 md:p-12 bg-wedding-cream/30 border-r border-wedding-gold/10">
            <div className="aspect-video w-full bg-black rounded-[1.5rem] md:rounded-[2rem] overflow-hidden flex items-center justify-center shadow-inner group relative border-4 border-white">
              <img 
                src={images[mainImageIndex]} 
                alt={ad.title} 
                className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-wedding-cream px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/10">
                IMAGE {mainImageIndex + 1} OF {images.length}
              </div>
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 mt-6 md:mt-8 overflow-x-auto pb-4 scroll-smooth scrollbar-hide">
                {images.map((img, index) => (
                  <button 
                    key={index} 
                    onClick={() => setMainImageIndex(index)}
                    className={`h-20 w-28 md:h-24 md:w-32 flex-shrink-0 cursor-pointer border-4 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 ${mainImageIndex === index ? 'border-wedding-gold ring-4 md:ring-8 ring-wedding-gold/5' : 'border-white hover:border-wedding-gold/20 opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS SECTION */}
          <div className="w-full lg:w-1/3 p-6 md:p-12 flex flex-col bg-white">
            <div className="mb-8 md:mb-10">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-wedding-gold/10 text-wedding-gold px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-wedding-gold/20">
                  {ad.category}
                </span>
                <span className="text-wedding-brown/60 text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  ✨ {ad.views || 0} VIEWS
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-wedding-brown leading-tight md:leading-[0.9] mb-4 uppercase tracking-tighter">{ad.title}</h1>
              <p className="text-wedding-gold font-black flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-widest">
                <span className="text-base md:text-lg">📍</span> {ad.city}, {ad.district}
              </p>
            </div>

            <div className="bg-wedding-brown rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 text-wedding-cream shadow-2xl shadow-wedding-brown/20 mb-8 md:mb-10 transform hover:scale-[1.02] transition-all relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-wedding-gold/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
               <p className="text-wedding-gold/60 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-3">Estimated Investment</p>
               <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-xl md:text-2xl font-black text-wedding-gold opacity-60 italic">Rs.</span>
                <span className="text-3xl md:text-5xl font-black tabular-nums tracking-tighter">
                  {ad.price ? Number(ad.price).toLocaleString() : 'Negotiable'}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-8 md:mb-10">
              <h3 className="text-[9px] md:text-[10px] font-black text-wedding-brown uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-6 h-[1px] bg-wedding-gold"></span>
                Description
              </h3>
              <p className="text-wedding-brown/70 whitespace-pre-line leading-relaxed text-xs md:text-sm font-medium italic">
                {ad.description || 'No description provided.'}
              </p>
            </div>

            {/* SELLER CARD */}
            <div className="mt-auto bg-wedding-cream/50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-wedding-gold/10 shadow-sm">
              <h3 className="text-[8px] md:text-[9px] font-black text-wedding-brown/60 uppercase tracking-[0.4em] mb-6 border-b border-wedding-gold/10 pb-4">Professional Information</h3>
              <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-wedding-brown rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black text-wedding-gold shadow-lg rotate-3 border-2 border-wedding-gold/20">
                  {ad.user?.name ? ad.user.name.charAt(0) : 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-black text-wedding-brown text-lg md:text-xl uppercase tracking-tighter leading-none mb-1 truncate">{ad.user?.name || 'Verified Partner'}</p>
                  <p className="text-[9px] md:text-[10px] text-wedding-brown/70 font-black tracking-widest truncate">{ad.user?.email || 'Privacy Protected'}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:gap-4">
                {ad.phone && (
                  <button 
                    onClick={() => setShowNumber(!showNumber)}
                    className="w-full flex items-center justify-center gap-3 md:gap-4 bg-wedding-brown hover:bg-black text-wedding-cream font-black py-4 md:py-6 px-6 md:px-8 rounded-[1.5rem] md:rounded-3xl shadow-xl transition-all duration-300 transform active:scale-95 group"
                  >
                    <span className="text-2xl md:text-3xl group-hover:rotate-12 transition-transform">📞</span>
                    <span className="text-sm md:text-lg tracking-tighter uppercase whitespace-nowrap">
                      {showNumber ? ad.phone : 'Click to show Number'}
                    </span>
                  </button>
                )}
                
                <Link 
                  to={`/chat?receiver=${ad.user?._id}`}
                  className="w-full flex items-center justify-center gap-3 md:gap-4 bg-white border-2 border-wedding-brown text-wedding-brown hover:bg-wedding-cream font-black py-4 md:py-6 px-6 md:px-8 rounded-[1.5rem] md:rounded-3xl transition-all duration-300 transform active:scale-95 shadow-lg"
                >
                  <span className="text-2xl md:text-3xl">💬</span>
                  <span className="text-sm md:text-lg tracking-tighter uppercase">Inquire via Chat</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer Navigation */}
      <div className="mt-8 md:mt-12 flex justify-center pb-8 md:pb-0">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all shadow-sm"
        >
          ← Go Back to Listings
        </button>
      </div>
    </div>
  );
};

export default AdDetails;
