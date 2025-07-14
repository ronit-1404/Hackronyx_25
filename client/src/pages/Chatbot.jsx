import React, { useState, useRef, useEffect } from "react";
import { Menu, Send, Paperclip, X, Plus, Home, Bookmark, Bot, PencilRuler, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/headers/Header";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedBotType, setSelectedBotType] = useState("normal");
  const [currentChatId, setCurrentChatId] = useState(null);
  const [responseType, setResponseType] = useState('complete'); // 'hint' or 'complete'

  // Bot configurations
  const botConfig = {
    normal: {
      name: "General Assistant",
      greeting: "Hello, how can I assist you today?",
      color: "#49ABB0",
      icon: <Bot size={24} />,
    },
    career: {
      name: "Career Guide",
      greeting: "Hi there! I'm your career guidance assistant. What career questions do you have?",
      color: "#E195AB",
      icon: <PencilRuler size={24} />,
    },
    math: {
      name: "Math Tutor",
      greeting: "Welcome to math tutoring! Ask me any math problem or concept you'd like help with.",
      color: "#FFA500",
      icon: <Brain size={24} />,
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const generateBotResponse = async (history) => {
    try {
      // IMPORTANT: In production, this API key should be stored in environment variables
      const API_KEY = process.env.GOOGLE_API_KEY;
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

      // Add instruction based on response type
      const instruction = responseType === 'hint' 
        ? "Provide only hints or guiding questions to help the user arrive at the answer themselves. Don't give the complete solution. Break it down into steps if needed."
        : "Provide a complete, detailed answer to the user's question. Include all necessary information and explanations.";

      const requestBody = {
        contents: [
          ...history.map(({ role, parts }) => ({
            role,
            parts: parts || [{ text: "" }]
          })),
          {
            role: "user",
            parts: [{ text: instruction }]
          }
        ]
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response format from API");
      }

      return data.candidates[0].content.parts[0].text
        .replace(/\\(.?)\\*/g, "$1")
        .trim();
        
    } catch (error) {
      console.error("API Error:", error);
      setError(error.message);
      return "Sorry, I encountered an error. Please try again.";
    }
  };

  const ResponseTypeSelector = () => (
    <div className="flex items-center space-x-2 mb-2">
      <span className="text-sm text-gray-600">Response type:</span>
      <button
        onClick={() => setResponseType('hint')}
        className={`px-3 py-1 text-sm rounded-full ${
          responseType === 'hint' 
            ? 'bg-blue-100 text-blue-700 font-medium' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Hint
      </button>
      <button
        onClick={() => setResponseType('complete')}
        className={`px-3 py-1 text-sm rounded-full ${
          responseType === 'complete' 
            ? 'bg-blue-100 text-blue-700 font-medium' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Complete Answer
      </button>
    </div>
  );

  const handleFileSelect = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createNewChat = () => {
    setCurrentChatId(null);
    setChatHistory([{ role: "model", parts: [{ text: botConfig[selectedBotType].greeting }] }]);
    setFile(null);
    setResponseType('complete');
  };

  useEffect(() => {
    // Initialize with a welcome message
    if (chatHistory.length === 0) {
      setChatHistory([{ 
        role: "model", 
        parts: [{ text: botConfig[selectedBotType].greeting }] 
      }]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() && !file) return;

    setError(null);
    
    // Prepare message content with file if present
    let messageContent = inputValue.trim();
    if (file) {
      messageContent = messageContent ? `${messageContent} [Attached file: ${file.name}]` : `[Attached file: ${file.name}]`;
    }
    
    const userMessage = { 
      role: "user", 
      parts: [{ text: messageContent }],
      hasAttachment: !!file
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const botResponse = await generateBotResponse([...chatHistory, userMessage]);
      setChatHistory(prev => [
        ...prev, 
        { 
          role: "model", 
          parts: [{ text: botResponse }],
          responseType // Add the response type to the message
        }
      ]);
      
      // Create new chat if this is the first message
      if (chatHistory.length <= 1 && !currentChatId) {
        const newChatId = `chat_${Date.now()}`;
        setCurrentChatId(newChatId);
      }
      
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error:", error);
      setChatHistory(prev => [
        ...prev, 
        { 
          role: "model", 
          parts: [{ text: error.message || "An error occurred" }],
          isError: true 
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const changeBotType = (type) => {
    if (chatHistory.length > 1 && !currentChatId) {
      if (window.confirm("Changing AI type will start a new conversation. Continue?")) {
        setSelectedBotType(type);
        createNewChat();
      }
    } else {
      setSelectedBotType(type);
      if (!currentChatId) createNewChat();
    }
  };

  const mockChatHistory = [
    {
      id: 'chat_1',
      title: "Help with React hooks",
      timestamp: new Date().toISOString(),
      botType: "normal"
    },
    {
      id: 'chat_2',
      title: "Career advice for software dev",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      botType: "career"
    },
    {
      id: 'chat_3',
      title: "Help solving equations",
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      botType: "math"
    }
  ];

  const loadChat = (chatId) => {
    // Mock function that would normally load a chat from server
    setCurrentChatId(chatId);
    const chat = mockChatHistory.find(c => c.id === chatId);
    if (chat) {
      setSelectedBotType(chat.botType);
      // Would normally load real messages here
      setChatHistory([
        { role: "model", parts: [{ text: botConfig[chat.botType].greeting }] },
        { role: "user", parts: [{ text: "Can you help me with this question?" }] },
        { 
          role: "model", 
          parts: [{ text: "Of course! I'd be happy to help. Please provide more details about your question." }],
          responseType: 'complete'
        }
      ]);
      setResponseType('complete');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <div className="flex flex-1 w-full max-w-7xl mx-auto mt-6 gap-6 px-2 md:px-6">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-72 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-4 pt-6 flex flex-col relative z-10"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-white">Chat History</span>
                <button
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-400 transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={createNewChat}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-4 px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                <span>New Chat</span>
              </motion.button>
              <div className="flex-1 overflow-y-auto space-y-2">
                {isLoading ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                ) : mockChatHistory.length === 0 ? (
                  <div className="text-center text-white py-4">
                    No chat history yet
                  </div>
                ) : (
                  mockChatHistory.map((chat) => (
                    <motion.button
                      key={chat.id}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full text-left px-4 py-3 rounded-lg shadow-sm flex items-start gap-2 ${
                        currentChatId === chat.id
                          ? "bg-white shadow-md text-blue-600 font-semibold"
                          : "bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100 hover:shadow-sm"
                      }`}
                      onClick={() => loadChat(chat.id)}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1"
                        style={{ backgroundColor: botConfig[chat.botType].color }}
                      >
                        {botConfig[chat.botType].icon}
                      </div>
                      <div className="overflow-hidden">
                        <p className="truncate text-sm">{chat.title}</p>
                        <p className="text-xs opacity-60">{formatDate(chat.timestamp)}</p>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
              <div className="mt-6 space-y-2 pt-4 border-t border-white border-opacity-20">
                <button className="w-full bg-white bg-opacity-80 text-gray-700 px-4 py-3 rounded-lg hover:bg-opacity-100 hover:shadow-md transition-all duration-300 flex items-center gap-2">
                  <Home size={18} />
                  <span>Home</span>
                </button>
                <button className="w-full bg-white bg-opacity-80 text-gray-700 px-4 py-3 rounded-lg hover:bg-opacity-100 hover:shadow-md transition-all duration-300 flex items-center gap-2">
                  <Bookmark size={18} />
                  <span>Saved</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        {!isSidebarOpen && (
          <button
            className="bg-white text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition absolute top-24 left-4 z-20"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
        )}

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-white/80 rounded-2xl shadow-lg p-0 md:p-6 relative">
          {/* Bot Type Tabs */}
          <div className="flex mb-2 md:mb-4 space-x-2">
            {Object.entries(botConfig).map(([key, value]) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.04 }}
                className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-all duration-300 ${
                  selectedBotType === key
                    ? `bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md`
                    : "bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100 hover:shadow-sm"
                }`}
                onClick={() => changeBotType(key)}
              >
                {value.icon}
                {value.name}
              </motion.button>
            ))}
          </div>

          {/* Chat Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-t-lg p-4 flex items-center shadow-sm border-b"
          >
            <div
              className="w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white"
              style={{ backgroundColor: botConfig[selectedBotType].color }}
            >
              {botConfig[selectedBotType].icon}
            </div>
            <div>
              <h2 className="font-semibold text-black">{botConfig[selectedBotType].name}</h2>
              <p className="text-xs text-gray-500">
                {currentChatId
                  ? `Chat ID: ${currentChatId}`
                  : "New conversation"
                }
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.93 }}
              className="ml-auto bg-teal-600 hover:bg-teal-500 text-white p-2 rounded-full"
              onClick={createNewChat}
            >
              <Plus size={18} />
            </motion.button>
          </motion.div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto bg-white rounded-b-lg p-4 md:p-6 mb-4 shadow-sm">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
              >
                {error}
              </motion.div>
            )}
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {chatHistory.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "model" && (
                        <div
                          className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white self-end mb-1"
                          style={{ backgroundColor: botConfig[selectedBotType].color }}
                        >
                          {botConfig[selectedBotType].icon}
                        </div>
                      )}
                      <motion.div
                        whileHover={message.role === "user" ? { scale: 1.01 } : {}}
                        className={`px-4 py-3 rounded-lg max-w-md ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-none shadow-md"
                            : message.isError
                              ? "bg-red-100 text-red-800 shadow-sm"
                              : "bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100"
                        }`}
                      >
                        {message.role === "model" && message.responseType && (
                          <div className="text-xs font-medium mb-1 text-gray-500">
                            {message.responseType === 'hint' ? 'Hint' : 'Complete Answer'}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">
                          {message.parts?.[0]?.text === "Thinking..." ? (
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                            </div>
                          ) : (
                            message.parts?.[0]?.text
                          )}
                        </p>
                      </motion.div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full ml-2 bg-blue-700 flex items-center justify-center text-white self-end mb-1">
                          <span className="text-xs">You</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div
                      className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white self-end mb-1"
                      style={{ backgroundColor: botConfig[selectedBotType].color }}
                    >
                      {botConfig[selectedBotType].icon}
                    </div>
                    <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg shadow-sm rounded-tl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* File Attachment */}
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-blue-50 p-2 mb-2 rounded-lg flex items-center"
              >
                <span className="text-sm text-gray-700 truncate flex-1">
                  {file.name}
                </span>
                <button
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white flex flex-col space-y-2 border border-gray-200 rounded-lg shadow-md backdrop-blur-sm bg-opacity-90"
          >
            <ResponseTypeSelector />
            
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={20} />
              </motion.button>
              <textarea
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-gray-800 px-4 py-2 focus:outline-none resize-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isTyping || (inputValue.trim() === "" && !file)}
              >
                <Send size={18} />
              </motion.button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Chatbot;