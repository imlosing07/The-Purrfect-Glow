import HeroInteractive from './components/HeroInteractive';
import FeaturedProducts from './components/FeaturedProducts';
import SocialMediaSection from './components/SocialMediaSection';

export default function HomePage() {
  return (
    <div className="max-w-full">
      {/* Interactive Hero Section */}
      <HeroInteractive />

      {/* Rest of the page content */}
      <div className="px-4 lg:px-8 max-w-7xl mx-auto">

        {/* Featured Products Section */}
        <FeaturedProducts />

        {/* Social Media Section */}
        <SocialMediaSection />

      </div>
    </div>
  );
}
