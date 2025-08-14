import React from 'react'
import Header from './Header';
import Hero from './Hero';
import Services from './Services';
import About from './About';
import Explore from './Explore';
import Contact from './Contact';
import Footer from './Footer';
const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Explore />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default Home
