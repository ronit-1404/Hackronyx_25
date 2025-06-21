import React from 'react';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Sentiment Dashboard</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/learner/home" className="hover:underline">Home</Link>
                        </li>
                        <li>
                            <Link href="/learner/analytics" className="hover:underline">Advanced Analytics</Link>
                        </li>
                        <li>
                            <Link href="/learner/resources" className="hover:underline">Resources</Link>
                        </li>
                        <li>
                            <Link href="/learner/settings" className="hover:underline">Settings</Link>
                        </li>
                        <li>
                            <Link href="/auth/sign-in" className="hover:underline">Sign Out</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;