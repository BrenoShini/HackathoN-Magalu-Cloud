import React, { useState, useEffect } from 'react';
import { MessageCircle, Loader2, Trash2, XCircle, Plus, Settings } from 'lucide-react';

const CHARACTER_AVATARS = [
  {
    url: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=100&h=100&fit=crop',
    character: 'AI Assistant'
  },
  {
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    character: 'Tech Helper'
  },
  {
    url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=100&h=100&fit=crop',
    character: 'Creative AI'
  }
];

const getRandomAvatar = () => {
  return CHARACTER_AVATARS[Math.floor(Math.random() * CHARACTER_AVATARS.length)].url;
};

const INITIAL_CHAT = {
  id: 1,
  title: 'Nova Conversa',
  status: 'online',
  description: 'Comece uma nova conversa',
  avatar: getRandomAvatar(),
  timestamp: new Date().toISOString()
};

const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatTitle, setChatTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [chats, setChats] = useState([INITIAL_CHAT]);
  const [selectedChat, setSelectedChat] = useState(INITIAL_CHAT);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'Nova Conversa',
      status: 'online',
      description: 'Comece uma nova conversa',
      avatar: getRandomAvatar(),
      timestamp: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setSelectedChat(newChat);
    setChatTitle('');
    setIsEditingTitle(true);
  };

  const updateChatTitle = () => {
    if (!chatTitle.trim()) return;
    
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, title: chatTitle }
        : chat
    ));
    setSelectedChat(prev => ({ ...prev, title: chatTitle }));
    setIsEditingTitle(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      updateChatTitle();
    }
  };

  const clearCurrentChat = () => {
    setConversations(prev => {
      const newConversations = {};
      Object.keys(prev).forEach(key => {
        if (key !== selectedChat.id) {
          newConversations[key] = prev[key];
        }
      });
      return newConversations;
    });
    setChats(prev => prev.filter(chat => chat.id !== selectedChat.id));
    setSelectedChat(INITIAL_CHAT);
    setShowClearConfirm(false);
  };

  const clearAllChats = () => {
    setConversations({});
    setChats([INITIAL_CHAT]);
    setSelectedChat(INITIAL_CHAT);
    setShowClearAllConfirm(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedChat) return;

    // Se for a primeira mensagem e o título ainda for "Nova Conversa",
    // use o início da mensagem como título
    if (selectedChat.title === 'Nova Conversa' && !conversations[selectedChat.id]) {
      const newTitle = inputMessage.slice(0, 30) + (inputMessage.length > 30 ? '...' : '');
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, title: newTitle }
          : chat
      ));
      setSelectedChat(prev => ({ ...prev, title: newTitle }));
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: inputMessage,
      time: new Date().toLocaleTimeString()
    };

    setConversations(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), userMessage]
    }));
    
    setInputMessage('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        message: `Esta é uma resposta simulada para: "${inputMessage}". Em uma implementação real, isso seria conectado à sua API de IA.`,
        time: new Date().toLocaleTimeString()
      };
      
      setConversations(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), botResponse]
      }));
      
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, description: botResponse.message.slice(0, 50) + (botResponse.message.length > 50 ? '...' : '') }
          : chat
      ));
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentMessages = conversations[selectedChat?.id] || [];

  return (
    <div className="bg-gradient-container">
      <div className="glassmorphism rounded-lg shadow-2xl flex relative">
        {/* Modais de confirmação permanecem os mesmos */}
        {showClearConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-gray-800 p-6 rounded-lg max-w-sm text-center">
              <h3 className="text-white text-lg mb-4">
                Deseja limpar esta conversa?
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={clearCurrentChat}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {showClearAllConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-gray-800 p-6 rounded-lg max-w-sm text-center">
              <h3 className="text-white text-lg mb-4">
                Deseja limpar todas as conversas?
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={clearAllChats}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowClearAllConfirm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div className="w-80 border-r border-gray-800/50 flex flex-col">
          <div className="p-4 border-b border-gray-800/50">
            <button
              onClick={createNewChat}
              className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 flex items-center justify-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Nova Conversa</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-2 text-sm text-gray-300 flex items-center justify-between">
              <span>CONVERSAS RECENTES</span>
              <button 
                onClick={() => setShowClearAllConfirm(true)}
                className="text-gray-300 hover:text-red-400 transition-colors"
                title="Limpar todas as conversas"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {chats.map((chat) => (
  <div
    key={chat.id}
    onClick={() => setSelectedChat(chat)}
    className={`px-4 py-2 hover:bg-white/10 cursor-pointer transition-all duration-150 ${
      selectedChat?.id === chat.id ? 'bg-white/10' : ''
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className="relative">
        <img 
          src={chat.avatar}
          alt={chat.title}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900/50 bg-green-500"></div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="text-white text-sm font-medium">{chat.title}</span>
        </div>
        <p className="text-gray-300 text-sm truncate">
          {chat.description}
        </p>
      </div>
    </div>
  </div>
))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          <div className="p-4 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {selectedChat && (
                  <img 
                    src={selectedChat.avatar}
                    alt={selectedChat.title}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={chatTitle}
                    onChange={(e) => setChatTitle(e.target.value)}
                    onBlur={updateChatTitle}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite o tema da conversa..."
                    className="bg-transparent text-white border-b border-gray-600 focus:border-blue-500 outline-none px-2 py-1"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{selectedChat?.title}</span>
                    <button
                      onClick={() => {
                        setChatTitle(selectedChat.title);
                        setIsEditingTitle(true);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-gray-300 hover:text-red-400 transition-colors"
                title="Limpar conversa atual"
              >
                <XCircle size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-end space-x-2">
                  {message.sender === 'bot' && (
                    <img 
                      src={selectedChat.avatar}
                      alt={selectedChat.title}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600/90 text-white'
                          : 'bg-gray-800/75 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">{message.time}</p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-gray-700/50 rounded-full flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-800/50">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-gray-800/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400"
                disabled={isLoading}
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700/90 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isLoading}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;