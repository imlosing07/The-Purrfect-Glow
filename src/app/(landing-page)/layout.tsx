import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-cream relative">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Desktop: padding top for fixed navbar */}
        <div className="pt-20 lg:pt-24">
          {children}
        </div>

        {/* Mobile: padding bottom for bottom navigation */}
        <div className="h-24 lg:h-0" />
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
