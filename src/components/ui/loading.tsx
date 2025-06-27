'use client'

import Lottie from 'lottie-react'

import animationLottie from '../../../public/animations/loading-animation.json'

export function Loading() {
  return (
    <div className="bg-background fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-hidden">
      <Lottie
        animationData={animationLottie}
        style={{
          height: '500px',
          width: '500px',
        }}
        loop={true}
      />
    </div>
  )
}
