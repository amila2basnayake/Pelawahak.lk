import React from 'react';
import { Link } from 'react-router-dom';

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

const AdCard = ({ ad }) => {
  const imageUrl = ad.images && ad.images.length > 0 
    ? `http://localhost:5000${ad.images[0]}` 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <Link to={`/ad/${ad._id}`} className="group block bg-wedding-cream rounded-[2rem] border border-wedding-gold/10 hover:border-wedding-gold/40 hover:shadow-2xl hover:shadow-wedding-gold/10 transition-all duration-500 cursor-pointer flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-56 h-48 md:h-auto bg-gray-100 flex-shrink-0 relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={ad.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
           <span className="bg-wedding-brown text-wedding-cream px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
             {ad.category}
           </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-black text-wedding-brown group-hover:text-black transition-colors uppercase tracking-tight leading-tight">{ad.title}</h3>
            {ad.price ? (
              <span className="font-black text-wedding-gold text-lg">Rs. {ad.price?.toLocaleString()}</span>
            ) : (
              <span className="font-black text-wedding-gold text-sm uppercase tracking-widest">Negotiable</span>
            )}
          </div>
          <p className="text-[10px] font-black text-wedding-brown/70 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-wedding-gold rounded-full"></span>
            {ad.district}, {ad.city}
          </p>
          <p className="text-sm text-wedding-brown/70 line-clamp-2 leading-relaxed font-medium">{ad.description}</p>
        </div>
        <div className="mt-6 pt-4 border-t border-wedding-gold/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-wedding-gold flex items-center justify-center text-[10px] font-black text-wedding-brown">
                {ad.user?.name ? ad.user.name.charAt(0) : 'U'}
             </div>
             <span className="text-[10px] font-black text-wedding-brown/60 uppercase tracking-widest">{ad.user?.name}</span>
          </div>
          <span className="text-[10px] font-bold text-wedding-brown/60 uppercase tracking-widest italic">{formatTimeAgo(ad.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default AdCard;
