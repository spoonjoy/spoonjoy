import { useState, useEffect } from 'react'

import LogoBlack from 'public/logos/sj_black.svg'

interface LoadingProps {
  subText?: string[]
}

const Loading = ({ subText }: LoadingProps) => {
  const [currentSubTextIndex, setCurrentSubTextIndex] = useState(0)
  const [showSubText, setShowSubText] = useState(false)

  useEffect(() => {
    if (subText) {
      const subTextIntervalId = setInterval(() => {
        setShowSubText(false)
        setTimeout(() => {
          setCurrentSubTextIndex(
            (prevIndex) => (prevIndex + 1) % subText.length
          )
          setShowSubText(true)
        }, 1000)
      }, 2000)
      return () => clearInterval(subTextIntervalId)
    }
  }, [subText])

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-2">
        <LogoBlack className="h-12 w-auto animate-pulse" />
        <div>
          <span
            className={`text-gray-500 ${
              showSubText ? 'opacity-100' : 'opacity-0'
            } animate-sub-text`}
            onAnimationEnd={() => {
              if (!showSubText) {
                setShowSubText(true)
              }
            }}
          >
            {subText && subText[currentSubTextIndex]}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Loading
