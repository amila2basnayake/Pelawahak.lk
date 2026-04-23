import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useSearchParams } from 'react-router-dom';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get('receiver');
  
  const [conversations, setConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Initialize Socket
  useEffect(() => {
    if (user) {
  // NEW:
      const socketHost = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const newSocket = io(socketHost);
      setSocket(newSocket);
      newSocket.emit('join', user._id);
      
      newSocket.on('receiveMessage', (message) => {
        const senderId = message.sender._id || message.sender;
        if (selectedPartner && senderId.toString() === selectedPartner._id.toString()) {
          setMessages(prev => [...prev, message]);
        }
        fetchConversations();
      });

      return () => newSocket.close();
    }
  }, [user, selectedPartner]);

  useEffect(() => {
    fetchConversations();
    if (receiverId) {
       handleSelectByReceiverId(receiverId);
    }
  }, [receiverId]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data);
    } catch (err) {
      console.error('Error fetching conversations', err);
    }
  };

  const handleSelectByReceiverId = async (id) => {
    try {
      const res = await api.get(`/messages/${id}`);
      setSelectedPartner(res.data.partner);
      setMessages(res.data.messages);
      fetchConversations();
    } catch (err) {
      console.error('Error starting conversation', err);
    }
  };

  const selectConversation = async (partner) => {
    setSelectedPartner(partner);
    try {
      const res = await api.get(`/messages/${partner._id}`);
      setMessages(res.data.messages);
      fetchConversations();
    } catch (err) {
      console.error('Error loading history', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner) return;

    try {
      const res = await api.post('/messages', {
        receiver: selectedPartner._id,
        content: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
      fetchConversations();
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-7xl mx-auto h-[85vh] bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-wedding-gold/10 flex relative">
      
      {/* Sidebar: Conversations */}
      <div className={`w-full md:w-1/3 border-r border-wedding-gold/10 flex flex-col bg-wedding-cream/30 ${selectedPartner ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 md:p-10 border-b border-wedding-gold/10 bg-white">
          <h2 className="text-2xl md:text-3xl font-black text-wedding-brown uppercase tracking-tighter leading-none mb-6">Concierge <br /><span className="text-wedding-gold">Registry</span></h2>
          <div className="bg-wedding-cream p-4 rounded-2xl flex items-center gap-4 border border-wedding-gold/5 shadow-inner">
             <span className="text-wedding-gold opacity-50">🔍</span>
             <input type="text" placeholder="Search interactions..." className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest w-full focus:ring-0 placeholder:text-wedding-brown/20" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {conversations.length === 0 ? (
            <div className="text-center py-20 px-10">
               <p className="text-wedding-brown/50 italic text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">Your message history is currently pristine. Initiate a dialogue from any listing.</p>
            </div>
          ) : conversations.map((conv) => (
            <button 
              key={conv.partner._id}
              onClick={() => selectConversation(conv.partner)}
              className={`w-full p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] flex items-center gap-5 transition-all duration-500 transform active:scale-95 ${selectedPartner?._id === conv.partner._id ? 'bg-wedding-brown text-wedding-cream shadow-2xl shadow-wedding-brown/20' : 'bg-white hover:bg-wedding-gold/5 border border-wedding-gold/5'}`}
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg rotate-3 z-10 border-2 ${selectedPartner?._id === conv.partner._id ? 'bg-wedding-gold text-wedding-brown border-white/20' : 'bg-wedding-cream text-wedding-brown border-wedding-gold/10'}`}>
                {conv.partner.name.charAt(0)}
              </div>
              <div className="text-left flex-1 overflow-hidden relative z-10">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-black uppercase tracking-tight truncate leading-none text-sm md:text-base">{conv.partner.name}</p>
                  {conv.unread && <span className="w-2.5 h-2.5 bg-wedding-gold rounded-full border-2 border-white shadow-sm"></span>}
                </div>
                <p className={`text-[8px] md:text-[9px] font-black truncate opacity-50 uppercase tracking-widest`}>
                  {conv.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className={`flex-1 flex flex-col bg-white overflow-hidden ${selectedPartner ? 'flex' : 'hidden md:flex'}`}>
        {selectedPartner ? (
          <>
            {/* Header */}
            <div className="p-4 md:p-8 border-b border-wedding-gold/10 flex items-center justify-between bg-white relative z-20">
              <div className="flex items-center gap-4 md:gap-5">
                <button 
                  onClick={() => setSelectedPartner(null)}
                  className="md:hidden w-10 h-10 flex items-center justify-center text-wedding-gold text-xl"
                >
                  ←
                </button>
                <div className="w-10 h-10 md:w-14 md:h-14 bg-wedding-cream rounded-[1rem] md:rounded-[1.5rem] flex items-center justify-center text-wedding-brown border border-wedding-gold/10 font-black text-lg shadow-sm">
                  {selectedPartner.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-wedding-brown text-sm md:text-lg uppercase tracking-tight leading-none mb-1">{selectedPartner.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-wedding-gold rounded-full animate-pulse"></span>
                    <span className="text-[8px] md:text-[9px] font-black text-wedding-brown/60 uppercase tracking-[0.2em]">Live Connection</span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex gap-4">
                 <button className="w-10 h-10 rounded-full border border-wedding-gold/10 hover:bg-wedding-cream transition-all text-sm">📞</button>
                 <button className="w-10 h-10 rounded-full border border-wedding-gold/10 hover:bg-wedding-cream transition-all text-wedding-brown/60 italic font-black text-xs">i</button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6 md:y-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
              {messages.map((msg, index) => {
                const senderId = msg.sender._id || msg.sender;
                const isMine = senderId.toString() === user._id.toString();
                return (
                  <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[75%] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-lg ${isMine ? 'bg-wedding-brown text-wedding-cream rounded-tr-none shadow-wedding-brown/10' : 'bg-wedding-cream text-wedding-brown rounded-tl-none border border-wedding-gold/10 shadow-wedding-gold/5'}`}>
                      <p className="text-xs md:text-sm font-medium leading-relaxed tracking-tight">{msg.content}</p>
                      <div className={`flex items-center gap-2 mt-4 pt-3 border-t ${isMine ? 'border-white/10' : 'border-wedding-gold/10'}`}>
                        <p className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-40 ${isMine ? 'text-wedding-cream' : 'text-wedding-brown'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • SENT
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-6 md:p-10 border-t border-wedding-gold/10 bg-white relative z-20">
               <div className="flex bg-wedding-cream p-3 md:p-5 rounded-[2rem] md:rounded-[2.5rem] border border-wedding-gold/10 shadow-2xl items-center gap-4 md:gap-6">
                  <button type="button" className="hidden sm:block w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white text-wedding-gold hover:text-wedding-brown shadow-sm border border-wedding-gold/5 text-xl font-black">＋</button>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Compose response..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs md:text-sm font-bold text-wedding-brown placeholder:text-wedding-brown/20 italic" 
                  />
                  <button 
                    type="submit"
                    className="bg-wedding-brown text-wedding-cream font-black px-6 md:px-10 py-3 md:py-4 rounded-[1.2rem] md:rounded-[1.5rem] text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-xl hover:bg-black transition-all active:scale-95"
                  >
                    SEND <span className="hidden sm:inline text-wedding-gold opacity-50 ml-1">✦</span>
                  </button>
               </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 md:p-20 text-center bg-wedding-cream/10">
            <div className="relative mb-8 md:mb-12">
               <div className="absolute inset-0 bg-wedding-gold blur-3xl opacity-10 animate-pulse"></div>
               <div className="w-24 h-24 md:w-40 md:h-40 bg-white rounded-[2.5rem] md:rounded-[4rem] border border-wedding-gold/10 shadow-2xl flex items-center justify-center text-4xl md:text-6xl relative z-10 rotate-3 transition-transform">💬</div>
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-wedding-brown uppercase tracking-tighter mb-4 leading-none">Your Private <br /><span className="text-wedding-gold">Chamber</span></h3>
            <p className="text-wedding-brown/60 font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] max-w-xs leading-loose">Select a conversation from the registry to engage with wedding providers.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Chat;
