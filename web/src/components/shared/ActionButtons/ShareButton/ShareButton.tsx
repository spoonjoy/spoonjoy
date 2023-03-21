import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'

const ShareButton = () => {
  const share = () => {
    navigator
      .share({
        title: 'Shared from my website',
        text: 'Check out this cool content!',
        url: window.location.href,
      })
      .then(() => console.log('Successfully shared'))
      .catch((error) => console.error('Error sharing:', error))
  }

  if (!navigator.share) {
    return null
  }

  return (
    <button onClick={share}>
      <ArrowUpOnSquareIcon className="action-btn mb-[0.4rem] h-[1.4rem] w-[1.4rem]" />
      <span className="sr-only">share</span>
    </button>
  )
}

export default ShareButton
