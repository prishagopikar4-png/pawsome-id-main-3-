import { Dog } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-auto">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Dog className="w-5 h-5" />
              <span className="font-semibold">PetChip Registry</span>
            </div>
            <p className="text-sm opacity-80">
              National Dog Microchip Registration and Tracking System. 
              Ensuring every pet can find their way home.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-1 text-sm opacity-80">
              <li><a href="/lookup" className="hover:opacity-100">Chip Lookup</a></li>
              <li><a href="/auth" className="hover:opacity-100">Register</a></li>
              <li><a href="#" className="hover:opacity-100">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-1 text-sm opacity-80">
              <li>Email: support@petchip.gov</li>
              <li>Phone: 1-800-PET-CHIP</li>
              <li>Hours: Mon-Fri, 9AM-5PM EST</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-6 pt-6 text-center text-sm opacity-70">
          <p>&copy; {new Date().getFullYear()} PetChip Registry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
