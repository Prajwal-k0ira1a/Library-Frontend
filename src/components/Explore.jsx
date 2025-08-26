import { TrendingUp, Clock, Users, Star } from 'lucide-react';

const Explore = () => {
  const categories = [
    { name: 'Fiction', count: '12,450', image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Science', count: '8,230', image: 'https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'History', count: '5,670', image: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Technology', count: '9,850', image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Biography', count: '4,120', image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Arts', count: '6,890', image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ];

  const popularBooks = [
    { title: 'The Midnight Library', author: 'Matt Haig', rating: 4.8, readers: '15K' },
    { title: 'Atomic Habits', author: 'James Clear', rating: 4.9, readers: '22K' },
    { title: 'Dune', author: 'Frank Herbert', rating: 4.7, readers: '18K' },
    { title: 'Educated', author: 'Tara Westover', rating: 4.6, readers: '12K' }
  ];

  return (
    <section id="explore" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dive into our vast collection of books across various genres and discover your next favorite read
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <div className="aspect-w-16 aspect-h-10">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-xl font-semibold mb-1">{category.name}</h4>
                  <p className="text-gray-200">{category.count} books</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Books */}
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Trending Now</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularBooks.map((book, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{book.title}</h4>
                    <p className="text-gray-600 text-sm">by {book.author}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{book.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{book.readers}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                    Read Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Explore;