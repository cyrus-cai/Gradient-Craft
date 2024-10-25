'use client'

import Image from "next/image"
import { useEffect } from "react"
import { useRouter } from 'next/navigation'

const Color = () => {
    const router = useRouter()

    useEffect(() => {
        router.push('/gradients')
    }, [router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-50 to-yellow-600/5">
            <Image
                src='/BrandIconText.png'
                width={144}
                height={24}
                alt='brandiconimage'
            />
            <div className="m-12">redirecting...</div>
            {/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div> */}
        </div>
    )
}

export default Color