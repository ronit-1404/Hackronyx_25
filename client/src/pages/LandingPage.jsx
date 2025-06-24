import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  BarChart3,
  Users,
  Activity,
  Search,
  Calendar,
  Waves,
  Settings,
  Star,
  CheckCircle,
  PlayCircle,
  Award,
  TrendingUp,
  Globe,
  Shield,
  Zap,
  BookOpen,
  Linkedin,
  Github
} from "lucide-react";

function OptikkaLanding ({onSelectPortal}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // Handle form submission here
  };

  const handlePortalSelection = (portalType) => {
    setSelectedCard(portalType);
    console.log(`${portalType} portal selected`);
    
    // Call the parent component's function to handle the portal selection
    if (onSelectPortal) {
      onSelectPortal(portalType);
    }
  };

  // Function to scroll to portal section
  const scrollToPortal = () => {
    const portalSection = document.getElementById('portal');
    if (portalSection) {
      portalSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFeatures = () => {
    const feat = document.getElementById('features');
    if(feat){
      feat.scrollIntoView({behavior: 'smooth'})
    }
  }
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor student engagement and performance with live data visualization and comprehensive reporting tools."
    },
    {
      icon: Activity,
      title: "Progress Tracking",
      description: "Track individual and group progress with detailed insights into learning patterns and achievements."
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Foster collaboration with interactive group projects, discussions, and peer-to-peer learning experiences."
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Motivate learners with badges, certificates, and milestone rewards that recognize their accomplishments."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Access your learning platform from anywhere with multi-language support and mobile optimization."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security ensures your data is protected with advanced encryption and privacy controls."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Students", icon: Users },
    { number: "95%", label: "Completion Rate", icon: TrendingUp },
    { number: "500+", label: "Courses Available", icon: PlayCircle },
    { number: "24/7", label: "Support Available", icon: Shield }
  ];

  const teamMembers = [
    {
      name: "Siya Dadpe",
      role: "Lead Developer",
      bio: "Siya is a dynamic and driven leader whose strategic thinking and guidance have been instrumental in our growth and success.",
      skills: ["React", "Node.js", "Python", "AWS", "Machine Learning"],
      image: "👨‍💻",
      linkedin: "https://www.linkedin.com/in/siyadadpe/",
      github: "https://github.com/SiyaDadpe"
    },
    {
      name: "Animesh Yadav",
      role: "Frontend Developer",
      bio: "Animesh is a passionate and innovative contributor whose technical expertise and dedication consistently elevate the team's performance.",
      skills: ["React", "User Research", "Prototyping", "Design Systems"],
      image: "👩‍🎨",
      linkedin: "https://www.linkedin.com/in/animesh-yadav-111947256/",
      github: "https://github.com/animesh-94"
    },
    {
      name: "Ronit Dhase",
      role: "Backend Developer & Integration Specialist",
      bio: "Ronit is a focused and reliable team member who brings creative problem-solving and strong execution to every project.",
      skills: ["Node.js", "PostgreSQL", "Docker", "Kubernetes"],
      image: "👨‍🔧",
      linkedin: "https://www.linkedin.com/in/ronit-rahul-dhase-396190297/",
      github: "https://github.com/ronit-1404"
    },
    {
      name: "Ayan Farooque",
      role: "ML Developer",
      bio: "Ayan is an enthusiastic and versatile contributor, consistently bringing fresh ideas and positive energy to the team.",
      skills: ["Machine Learning", "Agile", "User Analytics", "Product Strategy"],
      image: "👩‍💼",
      linkedin: "https://www.linkedin.com/in/ayfarooque/",
      github: "https://github.com/ayanfarooque"
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
    })
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: (i = 0) => ({
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-pink-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div 
          className="absolute top-96 right-20 w-96 h-96 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          initial={{ scale: 0.7, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-orange-200/25 to-yellow-200/25 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        />
      </div>

      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-xl shadow-lg shadow-orange-100/30 sticky top-0 z-50 border-b border-orange-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200/50 group-hover:shadow-orange-300/60 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-80 animate-bounce"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-700 via-pink-700 to-purple-700 bg-clip-text text-transparent">
                Learning Lane
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Features', 'Portal', 'Team'].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    if(item === 'Features') {
                      e.preventDefault();
                      scrollToFeatures();
                    }
                  }}
                  className={`relative font-semibold group transition-all duration-200 hover:scale-105 ${
                    item === 'Home' 
                      ? 'text-orange-600' 
                      : 'text-slate-600 hover:text-orange-600'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="group-hover:text-orange-700 transition-colors duration-200">
                    {item}
                  </span>
                  {item === 'Home' && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-pink-400 transform scale-x-100 group-hover:scale-x-110 transition-transform duration-200"></div>
                  )}
                </a>
              ))}
              <button 
                onClick={scrollToPortal} 
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-orange-200/50 hover:shadow-orange-300/60 hover:scale-105 hover:-translate-y-1 animate-pulse"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-orange-600 hover:text-orange-700 transition-all duration-200 hover:scale-110"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/70 backdrop-blur-xl border-t border-orange-100/50 shadow-xl animate-fadeIn">
            <div className="px-6 py-6 space-y-4">
              {['Home', 'Features', 'Portal', 'Team'].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    if(item === 'Features') {
                      e.preventDefault();
                      scrollToFeatures();
                      setIsMenuOpen(false); // Close mobile menu after clicking
                    }
                  }}
                  className={`block font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 ${
                    item === 'Home'
                      ? 'text-orange-600 bg-orange-50/50 border-l-4 border-orange-400'
                      : 'text-slate-600 hover:bg-orange-50/50 hover:text-orange-600'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.h1
              className="text-5xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight"
              variants={fadeInUp}
              custom={0}
            >
              Transform{" "}
              <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Online Learning
              </span>{" "}
              with Data
            </motion.h1>
            <motion.p
              className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
              variants={fadeInUp}
              custom={1}
            >
              Unlock the power of student analytics with our comprehensive
              dashboard. Track engagement, monitor progress, and optimize learning
              outcomes with real-time insights.
            </motion.p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-orange-100/50 hover:shadow-xl hover:shadow-orange-200/30 transition-all duration-300 group hover:scale-105 hover:-translate-y-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={index + 2}
                whileHover={{ scale: 1.08, y: -8, boxShadow: "0 8px 32px 0 rgba(255, 186, 120, 0.15)" }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-orange-500 group-hover:text-orange-600 transition-colors duration-300 group-hover:scale-110 group-hover:rotate-6" />
                <div className="text-3xl font-bold text-gray-800 mb-1 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6"
              variants={fadeInUp}
              custom={0}
            >
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Modern Learning
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={fadeInUp}
              custom={1}
            >
              Discover the tools and insights that make learning more effective, engaging, and measurable.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-orange-100/50 hover:shadow-xl hover:shadow-orange-200/30 transition-all duration-300 group hover:scale-105 hover:-translate-y-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={index}
                whileHover={{ scale: 1.07, y: -8, boxShadow: "0 8px 32px 0 rgba(255, 186, 120, 0.15)" }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg shadow-orange-200/50"
                  whileHover={{ rotate: 8, scale: 1.12 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Selection Section */}
      <section id="portal" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6"
              variants={fadeInUp}
              custom={0}
            >
              Choose Your{" "}
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Portal
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={fadeInUp}
              custom={1}
            >
              Access tailored experiences designed for your specific role and needs.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Student Card */}
            <motion.div
              className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100/50 p-10 cursor-pointer transition-all duration-300 group hover:shadow-2xl hover:shadow-orange-200/40 ${
                selectedCard === 'student' ? 'ring-4 ring-orange-300 scale-105' : 'hover:scale-105 hover:-translate-y-2'
              }`}
              onClick={() => handlePortalSelection("student")}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              custom={0}
              whileHover={{ scale: 1.06, y: -8, boxShadow: "0 8px 32px 0 rgba(255, 186, 120, 0.18)" }}
            >
              <div className="text-center">
                <motion.div
                  className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 shadow-xl shadow-orange-200/50"
                  whileHover={{ rotate: 8, scale: 1.12 }}
                >
                  <Users className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-orange-600 transition-colors duration-300">
                  Student Portal
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Access your courses, track your learning progress, and engage
                  with interactive content designed to enhance your educational
                  experience.
                </p>
                <motion.div
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xl shadow-orange-200/50 hover:shadow-orange-300/60"
                  whileHover={{ scale: 1.08, x: 6 }}
                >
                  Access Student Portal
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.div>
              </div>
            </motion.div>

            {/* Admin Card */}
            <motion.div
              className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-10 cursor-pointer transition-all duration-300 group hover:shadow-2xl hover:shadow-gray-200/40 ${
                selectedCard === 'admin' ? 'ring-4 ring-gray-300 scale-105' : 'hover:scale-105 hover:-translate-y-2'
              }`}
              onClick={() => handlePortalSelection("admin")}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              custom={1}
              whileHover={{ scale: 1.06, y: -8, boxShadow: "0 8px 32px 0 rgba(120, 120, 120, 0.18)" }}
            >
              <div className="text-center">
                <motion.div
                  className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xl shadow-gray-200/50"
                  whileHover={{ rotate: 8, scale: 1.12 }}
                >
                  <Settings className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  Administrator Portal
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Manage system settings, monitor student engagement, view
                  analytics, and oversee the entire learning platform ecosystem.
                </p>
                <motion.div
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-semibold text-lg transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 shadow-xl shadow-gray-200/50 hover:shadow-gray-300/60"
                  whileHover={{ scale: 1.08, x: 6 }}
                >
                  Access Admin Portal
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6"
              variants={fadeInUp}
              custom={0}
            >
              Meet Our{" "}
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Amazing Team
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={fadeInUp}
              custom={1}
            >
              The passionate individuals behind Learning Lane, dedicated to revolutionizing online education.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100/50 hover:shadow-xl hover:shadow-orange-200/30 transition-all duration-300 group hover:scale-105 hover:-translate-y-2 text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={index}
                whileHover={{ scale: 1.07, y: -8, boxShadow: "0 8px 32px 0 rgba(255, 186, 120, 0.15)" }}
              >
                {/* Profile Image/Avatar */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 text-4xl bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg"
                  whileHover={{ rotate: 8, scale: 1.12 }}
                >
                  {member.image}
                </motion.div>
                
                {/* Name and Role */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-orange-600 font-semibold mb-3 text-sm">
                  {member.role}
                </p>
                
                {/* Bio */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {member.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-200 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                {/* Social Links */}
                <div className="flex justify-center space-x-3">
                  <a
                    href={member.linkedin}
                    target="_blank"
                rel="noopener noreferrer"
                    className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white text-sm transition-all duration-300 hover:scale-110"
                    title={`${member.name} LinkedIn`}
                  >
                    <Linkedin />
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-800 hover:bg-gray-900 rounded-full flex items-center justify-center text-white text-sm transition-all duration-300 hover:scale-110"
                    title={`${member.name} GitHub`}
                  >
                    <Github/>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      
      {/* Footer */}
      <footer className="py-16 px-6 bg-white/50 backdrop-blur-sm border-t border-orange-100/50 relative">
          <div className="border-t border-orange-100/50 pt-8 text-center">
            <motion.p
              className="text-gray-600 flex items-center justify-center gap-2 text-lg font-semibold"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <span className="inline-block animate-bounce text-orange-500 text-2xl">🎓</span>
              <span>
                © 2025 <span className="font-bold text-orange-600">Learning Lane</span>. All rights reserved.
              </span>
              <span className="inline-block animate-pulse text-pink-500 text-xl">❤️</span>
              <span className="hidden sm:inline">for better education.</span>
            </motion.p>
            <motion.div
              className="flex justify-center gap-4 mt-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg"
                title="LinkedIn"
              >
                <Linkedin size={10} />
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-900 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg"
                title="GitHub"
              >
                <Github size={20} />
              </a>
            </motion.div>
          </div>
      </footer>
    </div>
  );
};

export default OptikkaLanding;