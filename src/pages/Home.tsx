import Hero from '../components/Hero';
import Features from '../components/Features';
import Specs from '../components/Specs';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Specs />
      <Pricing />
      <Testimonials />
      <CTA />
    </div>
  );
}

export default Home;
