import { useState, useEffect } from 'react'

import LogoBlack from 'public/logos/sj_black.svg'

const TAKING_PHOTO = 'taking a photo'
const WHIPPING_UP_MAGIC = 'whipping up some magic'
const BAKING_TO_PERFECTION = 'baking to perfection'
const SEASONING_TO_TASTE = 'seasoning to taste'
const HEATING_THINGS_UP = 'heating things up'
const STIRRING_THE_POT = 'stirring the pot'
const BRINGING_IT_ALL_TOGETHER = 'bringing it all together'
const ALMOST_READY_TO_SERVE = 'almost ready to serve'
const PLATING_IT = 'plating it'

const RecipeSaveLoading = () => {
  const [subText, setSubText] = useState(TAKING_PHOTO)
  const [showSubText, setShowSubText] = useState(false)

  useEffect(() => {
    const subTextIntervalId = setInterval(() => {
      setShowSubText(false)
      setTimeout(() => {
        setSubText((prevSubText) => {
          switch (prevSubText) {
            case TAKING_PHOTO:
              return WHIPPING_UP_MAGIC
            case WHIPPING_UP_MAGIC:
              return BAKING_TO_PERFECTION
            case BAKING_TO_PERFECTION:
              return SEASONING_TO_TASTE
            case SEASONING_TO_TASTE:
              return HEATING_THINGS_UP
            case HEATING_THINGS_UP:
              return STIRRING_THE_POT
            case STIRRING_THE_POT:
              return BRINGING_IT_ALL_TOGETHER
            case BRINGING_IT_ALL_TOGETHER:
              return ALMOST_READY_TO_SERVE
            case ALMOST_READY_TO_SERVE:
              return PLATING_IT
            case PLATING_IT:
              return TAKING_PHOTO
            default:
              return TAKING_PHOTO
          }
        })
        setShowSubText(true)
      }, 1000)
    }, 2000)

    return () => clearInterval(subTextIntervalId)
  }, [])

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-2">
        <LogoBlack className="h-12 w-auto animate-pulse" />
        {/* Loading spinner that we can use instead of the pulsing SJ logo */}
        {/* <svg
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
        </svg> */}
        <div>
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
    </div>
  )
}

export default RecipeSaveLoading
