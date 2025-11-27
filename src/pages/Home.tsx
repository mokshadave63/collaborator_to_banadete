import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, Users, Sparkles, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Palette className="w-8 h-8 text-primary-600" />,
      title: 'Design Studio',
      description: 'Create stunning designs with our intuitive drag-and-drop interface and extensive customization options.',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary-600" />,
      title: 'Fabric Selection',
      description: 'Choose from hundreds of premium fabrics, textures, and patterns to bring your vision to life.',
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Community',
      description: 'Connect with fellow designers, share your creations, and get inspired by the community.',
    },
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: 'Real-time Preview',
      description: 'See your designs come to life instantly with our advanced rendering technology.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Fashion Design
              <span className="block bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create, visualize, and share stunning clothing designs with StyleCraft's powerful design tools. 
              Join thousands of designers bringing their fashion dreams to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/studio"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-lg font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Designing Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 text-lg font-semibold rounded-lg hover:bg-primary-600 hover:text-white transition-all"
              >
                Explore Gallery
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Design Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-bounce" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-primary-300 rounded-full opacity-30 animate-pulse" />
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-primary-400 rounded-full opacity-25 animate-ping" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Design
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade tools and features to help you create exceptional fashion designs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Design with Purpose
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our advanced design studio provides you with professional tools to create, 
                customize, and perfect your fashion designs. From fabric selection to color 
                palettes, every detail is at your fingertips.
              </p>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3" />
                  Extensive fabric and pattern library
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3" />
                  Real-time design visualization
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3" />
                  Professional color management
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3" />
                  Export and sharing capabilities
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?w=500&h=500&fit=crop"
                  alt="Fashion Design Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary-600 rounded-2xl opacity-20" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-400 rounded-full opacity-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join our community of designers and bring your fashion ideas to life with StyleCraft
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-700 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;