import { Award, Target, Heart, Zap, BookOpen } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Award-winning library management system trusted by institutions worldwide'
    },
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'Making knowledge accessible to everyone, everywhere, at any time'
    },
    {
      icon: Heart,
      title: 'Community First',
      description: 'Building a passionate community of readers and knowledge seekers'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Constantly evolving with the latest technology and user needs'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                About LibraryHub
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We're revolutionizing how people access and interact with knowledge. Our mission is to create the world's most comprehensive and user-friendly digital library platform.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Founded in 2020</h3>
                  <p className="text-gray-600">Started with a vision to democratize access to knowledge</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <Heart className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">25,000+ Active Users</h3>
                  <p className="text-gray-600">Growing community of passionate readers and learners</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Industry Recognition</h3>
                  <p className="text-gray-600">Winner of multiple awards for innovation in digital libraries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-r from-blue-100 to-teal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;