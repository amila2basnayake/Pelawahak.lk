import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdCard from '../components/AdCard';
import PartnerCard from '../components/PartnerCard';
import { locations } from '../data/locations';
import { Link } from 'react-router-dom';

const Home = () => {
  const [ads, setAds] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [search, setSearch] = useState('');

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ads', {
        params: { category, district, search }
      });
      setAds(res.data);
    } catch (error) {
      console.error('Error fetching ads', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    setPartnersLoading(true);
    try {
      const res = await api.get('/partners');
      setPartners(res.data.slice(0, 4)); // Get latest 4 partners
    } catch (error) {
      console.error('Error fetching partners', error);
    } finally {
      setPartnersLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
    fetchPartners();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAds();
  };

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[550px] md:h-[600px] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-wedding-brown flex items-center shadow-2xl shadow-wedding-brown/20 group mx-2 md:mx-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" 
          alt="Wedding Hero" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
        />
        <div className="relative z-20 px-6 sm:px-12 md:px-24 max-w-4xl text-white">
          <div className="flex items-center gap-3 mb-6 animate-fadeIn">
            <span className="w-8 md:w-12 h-[2px] bg-wedding-gold"></span>
            <span className="text-wedding-gold text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.5em]">Premium Wedding Marketplace</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
            Where Love <br className="hidden sm:block" /> Meets <span className="text-wedding-gold">Elegance.</span>
          </h1>
          <p className="text-sm md:text-xl text-wedding-cream max-w-2xl mb-12 leading-relaxed font-medium">
            Sri Lanka's most trusted platform for finding the perfect wedding vendors and your ideal life partner. All in one exquisite location.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link to="/post-ad" className="bg-wedding-gold text-wedding-brown hover:bg-white transition-all px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-center shadow-lg shadow-wedding-gold/20">
              Post Your Ad
            </Link>
            <Link to="/partner" className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-center">
              Find a Partner
            </Link>
          </div>
        </div>
        
        {/* Floating Stat */}
        <div className="absolute bottom-12 right-12 z-20 hidden lg:block animate-bounce-slow">
           <div className="bg-wedding-cream/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl transform rotate-3">
              <p className="text-4xl font-black text-wedding-gold">5000+</p>
              <p className="text-[10px] font-black text-wedding-cream uppercase tracking-widest opacity-60">Verified Vendors</p>
           </div>
        </div>
      </section>

      {/* FILTER SEARCH BAR */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 md:-mt-16 relative z-30">
        <form onSubmit={handleFilter} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-wedding-gold/10 flex flex-col lg:flex-row gap-6 items-end">

          <div className="flex-1 w-full">
            <label className="block text-[10px] font-black text-wedding-brown/70 uppercase tracking-[0.2em] mb-4 ml-2">What are you looking for?</label>
            <input 
              type="text" 
              placeholder="Photography, Catering, Banquets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-wedding-cream/50 border-none rounded-2xl p-4 text-xs font-bold text-wedding-brown focus:ring-2 focus:ring-wedding-gold transition-all"
            />
          </div>
          <div className="w-full lg:w-64">
            <label className="block text-[10px] font-black text-wedding-brown/70 uppercase tracking-[0.2em] mb-4 ml-2">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-wedding-cream/50 border-none rounded-2xl p-4 text-xs font-bold text-wedding-brown"
            >
              <option value="">All Categories</option>
              <option value="Photography">Photography</option>
              <option value="Catering">Catering</option>
              <option value="Decoration">Decoration</option>
              <option value="Bridal Dressing">Bridal Dressing</option>
              <option value="Salons">Salons</option>
              <option value="Music and DJ">Music and DJ</option>
              <option value="Rent a Car">Rent a Car</option>
              <option value="Banquet Halls">Banquet Halls</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Wedding Clothing">Wedding Clothing</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Ashtaka">Ashtaka</option>
              <option value="Wedding Cake">Wedding Cake</option>
              <option value="Wedding Planning">Wedding Planning</option>
              <option value="Honeymoon">Honeymoon</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="w-full lg:w-64">
            <label className="block text-[10px] font-black text-wedding-brown/70 uppercase tracking-[0.2em] mb-4 ml-2">District</label>
            <select 
              value={district} 
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-wedding-cream/50 border-none rounded-2xl p-4 text-xs font-bold text-wedding-brown"
            >
              <option value="">All Districts</option>
              {Object.keys(locations).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full lg:w-48 bg-wedding-brown hover:bg-black text-wedding-cream p-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-wedding-brown/20">
            Search
          </button>
        </form>
      </div>

      {/* FEATURED PARTNERS SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-black text-wedding-brown uppercase tracking-tighter leading-none mb-3">Seeking <span className="text-wedding-gold">Partners</span></h2>
            <p className="text-wedding-brown/70 font-black uppercase tracking-widest text-[10px]">Find your soulmate in our premium matrimonial hub</p>
          </div>
          <Link to="/partner" className="text-wedding-gold font-black uppercase text-xs tracking-widest hover:text-wedding-brown transition-colors">View All Profiles →</Link>
        </div>

        {partnersLoading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-wedding-gold"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {partners.map(partner => (
              <PartnerCard key={partner._id} partner={partner} />
            ))}
          </div>
        )}
      </section>

      {/* RECENT ADS SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-black text-wedding-brown uppercase tracking-tighter leading-none mb-3">Latest <span className="text-wedding-gold">Marketplace</span> Ads</h2>
            <p className="text-wedding-brown/70 font-black uppercase tracking-widest text-[10px]">Discover premier wedding services from across Sri Lanka</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-wedding-gold"></div>
          </div>
        ) : ads.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center border border-wedding-gold/10">
             <p className="text-wedding-brown/70 font-black tracking-widest uppercase text-xs">No services found for the current filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {ads.map(ad => (
              <AdCard key={ad._id} ad={ad} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
