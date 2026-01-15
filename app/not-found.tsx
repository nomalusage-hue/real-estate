"use client";

// import dynamic from 'next/dynamic'
 
// const NoSSR_Error = dynamic(() => import('@/components/pages/Error'), { ssr: false })

import Error from '@/components/pages/Error';

export default function NotFound() {
    
    return (
        // <NoSSR_Error></NoSSR_Error>
        <Error></Error>
    );
}