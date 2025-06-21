import React from 'react';
import { useRouter } from 'next/router';

const Breadcrumbs = () => {
    const router = useRouter();
    const pathSegments = router.asPath.split('/').filter(segment => segment);

    return (
        <nav className="flex items-center space-x-2">
            {pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                const href = '/' + pathSegments.slice(0, index + 1).join('/');

                return (
                    <div key={href} className="flex items-center">
                        {!isLast ? (
                            <a href={href} className="text-blue-600 hover:underline">
                                {segment.charAt(0).toUpperCase() + segment.slice(1)}
                            </a>
                        ) : (
                            <span className="font-bold">{segment.charAt(0).toUpperCase() + segment.slice(1)}</span>
                        )}
                        {!isLast && <span className="mx-2">/</span>}
                    </div>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;