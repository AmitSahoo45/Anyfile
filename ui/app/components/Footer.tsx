import React from 'react'

const Footer = () => {
    return (
        <div>
            <footer className="bg-white/5 text-white/70 mb-3 py-2 px-3 rounded-lg shadow-lg backdrop-blur-md border border-white/60 fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] max-w-7xl z-50">
                <div className="flex justify-between items-center flex-col">
                    <p className="text-sm">© {new Date().getFullYear()} Anyfile. All rights reserved.</p>
                    <p className="text-sm">
                        Made with ❤️ by &nbsp; 
                        <a className="font-bold text-red-500" href="https://www.linkedin.com/in/amit-kumar-sahoo-web/" target="_blank" rel="noopener noreferrer">Amit Kumar Sahoo</a>
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Footer