import { BookOpen, Download, Headphones, Calendar, Star, Shield } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: BookOpen,
      title: 'Digital Library',
      description: 'Access thousands of e-books and digital resources from anywhere',
      color: 'blue'
    },
    {
      icon: Download,
      title: 'Download & Read Offline',
      description: 'Download books to read offline on any device',
      color: 'teal'
    },
    {
      icon: Headphones,
      title: 'Audiobooks',
      description: 'Listen to your favorite books with our audiobook collection',
      color: 'purple'
    },
    {
      icon: Calendar,
      title: 'Book Reservations',
      description: 'Reserve physical books and get notified when available',
      color: 'green'
    },
    {
      icon: Star,
      title: 'Personalized Recommendations',
      description: 'Get book suggestions based on your reading preferences',
      color: 'orange'
    },
    {
      icon: Shield,
      title: 'Secure Access',
      description: 'Your reading data and preferences are always protected',
      color: 'red'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    teal: 'bg-teal-100 text-teal-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the amazing features and services we offer to enhance your reading experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 ${colorClasses[service.color]} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;