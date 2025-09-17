import React from 'react';

const Footer = () => (
    // The class 'backdrop-blur-md' creates the blurry "frosted glass" effect.
    <footer className="bg-[#b08d57]/50 backdrop-blur-md shadow-lg mt-12 border-t border-white/20">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-white">
            <h3 className="text-lg font-semibold">Find us here:</h3>
            <div className="flex justify-center items-center space-x-4 mt-4">
              <a href="https://www.facebook.com/share/19k89ojnky/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                <img src="https://firebasestorage.googleapis.com/v0/b/ukiyo-store.firebasestorage.app/o/Facebook_Logo_Picture_Panel_1200x1200.webp?alt=media&token=bac3e965-c54a-4803-a251-59e34d85c6a6" alt="Facebook" className="w-8 h-8 object-contain transition-transform duration-300 hover:scale-110"/>
              </a>
              <a href="https://www.instagram.com/ukiyo_homes?igsh=dHhkZzkxZGxrajNk" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                <img src="https://firebasestorage.googleapis.com/v0/b/ukiyo-store.firebasestorage.app/o/instagram%20logo.png?alt=media&token=466a7697-4a1e-4e06-840b-7b605eb038a8" alt="Instagram" className="w-8 h-8 object-contain transition-transform duration-300 hover:scale-110"/>
              </a>
            </div>
            <p className="mt-8 text-sm">📍 26 Farid Bek st. Kafr Abdo, Alexandria.</p>
            
            <p className="text-sm">
                <a href="mailto:support@ukiyo.com" className="hover:underline">
                    support@ukiyo.com
                </a>
            </p>
           {/* --- MODIFIED: Changed text-gray-300 to a lighter, more readable color --- */}
           <p className="mt-8 text-xs text-gray-200">&copy; {new Date().getFullYear()} Ukiyo. All rights reserved.</p>
        </div>
    </footer>
);

export default Footer;

