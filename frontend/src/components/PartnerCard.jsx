import React from 'react';
import { Link } from 'react-router-dom';

const PartnerCard = ({ partner }) => {
  const imageUrl = partner.images && partner.images.length > 0 
    ? `http://localhost:5000${partner.images[0]}` 
    : 'https://via.placeholder.com/400x500?text=Partner+Image';

  return (
    <Link to={`/partner/${partner._id}`} className="group bg-wedding-cream rounded-[2.5rem] overflow-hidden border border-wedding-gold/10 hover:border-wedding-gold/40 hover:shadow-2xl hover:shadow-wedding-gold/10 transition-all duration-500 hover:-translate-y-2 flex flex-col md:flex-row h-full">
      {/* Image Container */}
      <div className="w-full md:w-56 h-72 md:h-auto overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={partner.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
           <span className="bg-wedding-brown/90 backdrop-blur-sm text-wedding-cream px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
             {partner.gender}
           </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-black text-wedding-brown leading-tight group-hover:text-black transition-colors uppercase tracking-tight">
              {partner.title}
            </h3>
            <p className="text-wedding-gold font-bold text-[10px] uppercase tracking-widest mt-1">
              {partner.religion} • {partner.district}
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-wedding-brown leading-none">{partner.age}</span>
            <p className="text-[10px] font-black text-wedding-gold uppercase tracking-widest">Years Old</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4">
             <span className="w-8 h-8 rounded-xl bg-wedding-gold/10 flex items-center justify-center text-wedding-gold text-sm shadow-sm">💼</span>
             <span className="text-sm font-bold text-wedding-brown/70 uppercase tracking-tight">{partner.profession}</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="w-8 h-8 rounded-xl bg-wedding-gold/10 flex items-center justify-center text-wedding-gold text-sm shadow-sm">🎓</span>
             <span className="text-sm font-bold text-wedding-brown/70 uppercase tracking-tight">{partner.education || 'Private Information'}</span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-wedding-gold/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-wedding-brown flex items-center justify-center text-[10px] font-black text-wedding-cream">
                 {partner.user?.name ? partner.user.name.charAt(0) : 'U'}
               </div>
               <span className="text-[10px] font-black text-wedding-brown/70 uppercase tracking-widest">Profile ID: {partner._id.slice(-6)}</span>
            </div>
            <span className="bg-wedding-gold text-wedding-brown px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-wedding-brown group-hover:text-wedding-cream transition-all shadow-lg shadow-wedding-gold/10 group-hover:shadow-wedding-brown/20">
              Open Profile
            </span>
        </div>
      </div>
    </Link>
  );
};

export default PartnerCard;
