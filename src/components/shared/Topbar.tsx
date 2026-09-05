import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Topbar = () => {
    return (
        <div className="hidden md:block bg-gray-900 text-gray-200 text-sm">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-10">

                {/* Left Section */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <FaPhoneAlt size={12} />
                        <span>+1 (555) 123-4567</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FaEnvelope size={12} />
                        <span>hello@archibuild.design</span>
                    </div>

                    <span className="text-emerald-400 font-medium">
                        Architecture, engineering, and full building support
                    </span>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">

                    {/* Social Icons */}
                    <div className="flex items-center gap-3">
                        <a href="#" className="hover:text-white">
                            <FaFacebookF size={16} />
                        </a>
                        <a href="#" className="hover:text-white">
                            <FaInstagram size={16} />
                        </a>
                        <a href="#" className="hover:text-white">
                            <FaTwitter size={16} />
                        </a>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Topbar;