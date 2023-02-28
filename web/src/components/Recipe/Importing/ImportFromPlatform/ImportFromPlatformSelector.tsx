import CroutonLogo from 'public/logos/otherPlatforms/crouton_logo.png'

import { classNames } from 'src/helpers/css'

interface IImportFromPlatformSelectorProps {
  setSelectedPlatform: (platform: SupportedPlatforms) => void
}

const ImportFromPlatformSelector = ({
  setSelectedPlatform,
}: IImportFromPlatformSelectorProps) => {
  const actions = [
    {
      title: 'Crouton',
      onClick: () => setSelectedPlatform('crouton'),
      icon: CroutonLogo,
    },
    {
      title: 'Contact',
    },
  ]

  return (
    <>
      {/* <div className="mt-5 text-center text-lg font-bold text-indigo-700 sm:text-xl">
        from
      </div> */}
      <ul className="m-auto mb-5 mt-10 grid max-w-xs grid-cols-2 gap-px overflow-hidden rounded-lg bg-gray-200 p-1 shadow sm:max-w-md">
        {actions.map((action, actionIdx) => (
          <li
            key={action.title}
            className={classNames(
              actionIdx === 0
                ? 'mr-[2px] rounded-l-lg rounded-r-none bg-white '
                : 'rounded-r-lg rounded-l-none border-2 border-dashed border-white',
              'group relative focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-opacity-75'
            )}
          >
            {action.title === 'Contact' ? (
              <a
                href={`mailto:${encodeURI(
                  'spoonjoy team<hi@spoonjoy.app>?subject=I want to import from another platform&body=(what platform do you want to import from?)'
                )}`}
                className="flex h-full w-full flex-col justify-center bg-white text-center text-xs opacity-80 hover:bg-opacity-75 sm:text-sm"
              >
                don&apos;t see what
                <br /> you&apos;re looking for?
                <br />
                let us know!
                <span className="link group-hover:text-indigo-500">
                  hi@spoonjoy.app
                </span>
              </a>
            ) : (
              <button
                className="h-full w-full p-6 outline-none sm:px-12 sm:py-8"
                onClick={action.onClick}
              >
                <img
                  className="m-auto outline-none"
                  src={action.icon}
                  alt={action.title}
                />
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

export default ImportFromPlatformSelector
