'use client'

import Link from "next/link";
import NestedDropdown from "./Dropdown";

const Navbar: React.FC = () => {
    return (
        <div className="fixed top-7 left-1/2 transform -translate-x-1/2 w-[90%] max-w-7xl bg-white/5 rounded-2xl shadow-lg backdrop-blur-md border border-white/60 sm:px-8 py-3 px-4 z-40 flex justify-between items-center">
            <Link href="/">
                <p className="text-white font-semibold text-lg">Home</p>
            </Link>

            <div className="flex space-x-6">
                <NestedDropdown />
            </div>
        </div>
    );
}

export default Navbar