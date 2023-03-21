import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'

import { classNames } from 'src/helpers/css'

export interface IShareButtonProps {
  title: string
  text: string
  url: string
  onLightBackground?: boolean
  customSize?: number
}

const ShareButton = ({
  title,
  text,
  url,
  onLightBackground,
  customSize,
}: IShareButtonProps) => {
  const share = () => {
    navigator
      .share({
        title,
        text,
        url,
      })
      .then(() => console.log('Successfully shared'))
      .catch((error) => console.error('Error sharing:', error))
  }

  if (!navigator.share) {
    return null
  }

  return (
    <button onClick={share}>
      <ArrowUpOnSquareIcon
        style={
          customSize
            ? {
                height: customSize + 'rem',
                width: customSize + 'rem',
              }
            : undefined
        }
        className={classNames(
          `action-btn mb-[0.4rem]`,
          !!onLightBackground && 'text-gray-900',
          !customSize && 'h-[1.4rem] w-[1.4rem]'
        )}
      />
      <span className="sr-only">share</span>
    </button>
  )
}

export default ShareButton
