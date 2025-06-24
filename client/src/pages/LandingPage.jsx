import React, { useState, useEffect } from "react";
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
  BookOpen
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
      bio: "Full-stack developer with 8+ years of experience in EdTech. Passionate about creating scalable learning platforms.",
      skills: ["React", "Node.js", "Python", "AWS", "Machine Learning"],
      image: "👨‍💻",
      linkedin: "#",
      github: "#"
    },
    {
      name: "Animesh Yadav",
      role: "Frontend Developer",
      bio: "Design specialist focused on creating intuitive and accessible learning experiences for students of all ages.",
      skills: ["React", "User Research", "Prototyping", "Design Systems"],
      image: "👩‍🎨",
      linkedin: "#",
      github: "#"
    },
    {
      name: "Ronit Dhase",
      role: "Backend Developer & Integration Specialist",
      bio: "Data engineer specializing in analytics and real-time processing systems for educational platforms.",
      skills: ["Node.js", "PostgreSQL", "Docker", "Kubernetes"],
      image: "👨‍🔧",
      linkedin: "#",
      github: "#"
    },
    {
      name: "Ayan Farooque",
      role: "ML Developer",
      bio: "Former educator turned product manager, bridging the gap between technology and educational needs.",
      skills: ["Machine Learning", "Agile", "User Analytics", "Product Strategy"],
      image: "👩‍💼",
      linkedin: "#",
      github: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-pink-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute top-96 right-20 w-96 h-96 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * -0.05}px)`, animationDelay: '1s' }}
        ></div>
        <div 
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-orange-200/25 to-yellow-200/25 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.08}px)`, animationDelay: '2s' }}
        ></div>
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
              {['Home', 'Features', 'About', 'Contact'].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
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
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-orange-200/50 hover:shadow-orange-300/60 hover:scale-105 hover:-translate-y-1 animate-pulse">
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
              {['Home', 'Features', 'About', 'Contact'].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
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
      <section id="home" className="pt-20 pb-16 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight animate-fadeInUp">
              Transform{" "}
              <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Online Learning
              </span>{" "}
              with Data
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Unlock the power of student analytics with our comprehensive
              dashboard. Track engagement, monitor progress, and optimize learning
              outcomes with real-time insights.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-orange-100/50 hover:shadow-xl hover:shadow-orange-200/30 transition-all duration-300 group hover:scale-105 hover:-translate-y-2 animate-fadeInUp"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-orange-500 group-hover:text-orange-600 transition-colors duration-300 group-hover:scale-110 group-hover:rotate-6" />
                <div className="text-3xl font-bold text-gray-800 mb-1 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 animate-fadeInUp">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Modern Learning
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Discover the tools and insights that make learning more effective, engaging, and measurable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-orange-100/50 hover:shadow-xl hover:shadow-orange-200/30 transition-all duration-300 group hover:scale-105 hover:-translate-y-2 animate-fadeInUp"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-orange-200/50">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Selection Section */}
      <section id="portal" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 animate-fadeInUp">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Portal
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Access tailored experiences designed for your specific role and needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Student Card */}
            <div
              className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100/50 p-10 cursor-pointer transition-all duration-300 group hover:shadow-2xl hover:shadow-orange-200/40 animate-fadeInUp ${
                selectedCard === 'student' ? 'ring-4 ring-orange-300 scale-105' : 'hover:scale-105 hover:-translate-y-2'
              }`}
              onClick={() => handlePortalSelection("student")}
              style={{ animationDelay: '0.4s' }}
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 shadow-xl shadow-orange-200/50">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-orange-600 transition-colors duration-300">
                  Student Portal
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Access your courses, track your learning progress, and engage
                  with interactive content designed to enhance your educational
                  experience.
                </p>
                <div className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xl shadow-orange-200/50 hover:shadow-orange-300/60">
                  Access Student Portal
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Admin Card */}
            <div
              className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-10 cursor-pointer transition-all duration-300 group hover:shadow-2xl hover:shadow-gray-200/40 animate-fadeInUp ${
                selectedCard === 'admin' ? 'ring-4 ring-gray-300 scale-105' : 'hover:scale-105 hover:-translate-y-2'
              }`}
              onClick={() => handlePortalSelection("admin")}
              style={{ animationDelay: '0.6s' }}
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xl shadow-gray-200/50">
                  <Settings className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  Administrator Portal
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Manage system settings, monitor student engagement, view
                  analytics, and oversee the entire learning platform ecosystem.
                </p>
                <div className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-semibold text-lg transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 shadow-xl shadow-gray-200/50 hover:shadow-gray-300/60">
                  Access Admin Portal
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 animate-fadeInUp">
              Meet Our{" "}
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Amazing Team
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              The passionate individuals behind Learning Lane, dedicated to revolutionizing online education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100/50 hover:shadow-xl hover:shadow-orange-200/30 transition-all duration-300 group hover:scale-105 hover:-translate-y-2 animate-fadeInUp text-center"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                {/* Profile Image/Avatar */}
                <div className="w-20 h-20 mx-auto mb-4 text-4xl bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                  {member.image}
                </div>
                
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
                    className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white text-sm transition-all duration-300 hover:scale-110"
                    title={`${member.name} LinkedIn`}
                  >
                    in
                  </a>
                  <a
                    href={member.github}
                    className="w-8 h-8 bg-gray-800 hover:bg-gray-900 rounded-full flex items-center justify-center text-white text-sm transition-all duration-300 hover:scale-110"
                    title={`${member.name} GitHub`}
                  >
                    git
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      
      {/* Footer */}
      <footer className="py-16 px-6 bg-white/50 backdrop-blur-sm border-t border-orange-100/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6 group">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Waves className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-700 via-pink-700 to-purple-700 bg-clip-text text-transparent">
                  Learning Lane
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed max-w-md">
                Transforming education through innovative analytics and data-driven insights. 
                Empowering educators and students to achieve their full potential.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-orange-600 transition-all duration-200 hover:translate-x-1">Features</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-all duration-200 hover:translate-x-1">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-all duration-200 hover:translate-x-1">Security</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-all duration-200 hover:translate-x-1">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-orange-600 transition-all duration-200 hover:translate-x-1">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-all duration-200 hover:translate-x-1">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-all duration-200 hover:translate-x-1">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-all duration-200 hover:translate-x-1">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-orange-100/50 pt-8 text-center">
            <p className="text-gray-600">
              © 2025 Learning Lane. All rights reserved. Made with ❤️ for better education.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OptikkaLanding;