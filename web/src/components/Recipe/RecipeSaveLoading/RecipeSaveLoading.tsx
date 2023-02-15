import { useState, useEffect } from 'react'

const RecipeSaveLoading = () => {
  const [subText, setSubText] = useState('Please wait...')
  const [showSubText, setShowSubText] = useState(false)

  useEffect(() => {
    const subTextIntervalId = setInterval(() => {
      setShowSubText(false)
      setTimeout(() => {
        setSubText((prevSubText) => {
          switch (prevSubText) {
            case 'Please wait...':
              return 'This may take a moment.'
            case 'This may take a moment.':
              return 'Thanks for your patience!'
            case 'Thanks for your patience!':
              return 'Almost done...'
            case 'Almost done...':
              return 'Finishing up!'
            case 'Finishing up!':
              return 'Please wait...'
            default:
              return 'Please wait...'
          }
        })
        setShowSubText(true)
      }, 500)
    }, 2500)

    return () => clearInterval(subTextIntervalId)
  }, [])

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-2">
        <svg
          className="mr-3 h-8 w-8 animate-spin text-indigo-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-lg text-gray-600">saving recipe...</p>
      </div>
      <div className="mt-4">
        <span
          className={`text-gray-500 ${
            showSubText ? 'opacity-100' : 'opacity-0'
          } animate-sub-text`}
          key={subText}
          onAnimationEnd={() => {
            if (!showSubText) {
              setShowSubText(true)
            }
          }}
        >
          {subText}
        </span>
      </div>
    </div>
  )
}

export default RecipeSaveLoading
