import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, ShoppingBag, Users, Zap, Star, ArrowRight, Heart } from 'lucide-react';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: ShoppingBag,
      title: "Smart Inventory",
      description: "Real-time stock management with automated alerts and purchase tracking"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Secure authentication with role-based access for admins and customers"
    },
    {
      icon: Zap,
      title: "Instant Search",
      description: "Lightning-fast search by name, category, and price range"
    }
  ];

  const sweetCategories = [
    { name: "Chocolates", emoji: "🍫", color: "from-amber-400 to-orange-500" },
    { name: "Gummies", emoji: "🍬", color: "from-pink-400 to-rose-500" },
    { name: "Lollipops", emoji: "🍭", color: "from-purple-400 to-violet-500" },
    { name: "Caramels", emoji: "🍯", color: "from-yellow-400 to-amber-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-pink-100' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl rotate-12 transform"></div>
                <Sparkles className="absolute inset-0 w-6 h-6 text-white m-auto rotate-12" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                SweetShop
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Features</a>
              <a href="#about" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="/login"
                className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
              >
                Sign In
              </a>
              <a 
                href="/register"
                className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-200">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700">Premium Sweet Shop Management</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
                  Sweet Dreams
                </span>
                <br />
                <span className="text-gray-800">Made Simple</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Transform your sweet shop with our intelligent management system. Track inventory, 
                manage customers, and boost sales with cutting-edge technology.
              </p>
              
              <div className="flex items-center space-x-4">
                <a 
                  href="/register"
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-4 rounded-2xl hover:from-pink-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold text-lg group"
                >
                  Start Your Journey
                  <ChevronRight className="inline w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
                <button className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors font-medium">
                  <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="w-0 h-0 border-l-4 border-l-pink-500 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                  </div>
                  <span>Watch Demo</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full bg-gradient-to-br ${sweetCategories[i-1]?.color} border-2 border-white shadow-lg`}></div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">500+ Happy Customers</p>
                  <div className="flex items-center space-x-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    {sweetCategories.map((category, idx) => (
                      <div key={idx} className="group cursor-pointer">
                        <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:rotate-2 shadow-lg hover:shadow-xl`}>
                          <div className="text-4xl mb-2">{category.emoji}</div>
                          <p className="text-white font-semibold">{category.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Today's Sales</span>
                      <span className="text-green-300 font-bold">+12%</span>
                    </div>
                    <div className="bg-white/30 rounded-full h-2 mb-3">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full w-3/4"></div>
                    </div>
                    <p className="text-white text-2xl font-bold">$2,847.50</p>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-xl opacity-80"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-pulse shadow-xl opacity-80"></div>
              <div className="absolute top-1/2 -right-12 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-ping shadow-xl opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your sweet shop efficiently and grow your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  className={`group p-8 rounded-3xl transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                    activeFeature === idx 
                      ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-2xl' 
                      : 'bg-white/60 backdrop-blur-sm border border-pink-100 hover:bg-white/80'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                    activeFeature === idx 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br from-pink-500 to-rose-600'
                  }`}>
                    <Icon className={`w-8 h-8 ${activeFeature === idx ? 'text-white' : 'text-white'}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${activeFeature === idx ? 'text-white' : 'text-gray-800'}`}>
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed ${activeFeature === idx ? 'text-white/90' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Sweeten Your Business?</h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of sweet shop owners who've transformed their business with our platform
              </p>
              <div className="flex items-center justify-center space-x-4">
                <a 
                  href="/register"
                  className="bg-white text-pink-600 px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold text-lg group"
                >
                  Start Free Trial
                  <ArrowRight className="inline w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="/login"
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 font-semibold text-lg backdrop-blur-sm"
                >
                  Sign In
                </a>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full"></div>
            <Heart className="absolute top-8 right-8 w-8 h-8 text-white/20" />
            <Sparkles className="absolute bottom-8 left-8 w-6 h-6 text-white/20" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl rotate-12 transform"></div>
                  <Sparkles className="absolute inset-0 w-6 h-6 text-white m-auto rotate-12" />
                </div>
                <span className="text-2xl font-bold">SweetShop</span>
              </div>
              <p className="text-gray-400">
                Transforming sweet shops with intelligent management solutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">API Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SweetShop. All rights reserved. Made with ❤️ for sweet shop owners.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;