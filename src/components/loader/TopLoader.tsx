'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Props {
    setIsMounted?: (value: boolean) => void
}

const TopLoader: React.FC<Props> = ({ setIsMounted }) => {
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const handleComplete = () => {
            setLoading(false);
            setIsMounted && setIsMounted(true)
        };

        handleComplete();

        return () => {
        };
    }, [pathname]);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-50">
            <div className="h-full bg-blue-500 animate-horizontal-loader"></div>
        </div>
    );
};

export default TopLoader;
