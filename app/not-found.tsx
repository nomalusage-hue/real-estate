"use client";

import dynamic from 'next/dynamic'
 
const NoSSR_Error = dynamic(() => import('@/components/pages/Error'), { ssr: false })

export default function NotFound() {
    
    return (
        <NoSSR_Error></NoSSR_Error>
    );
}