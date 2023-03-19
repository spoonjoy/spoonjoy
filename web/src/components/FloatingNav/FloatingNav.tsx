import LogoWhite from 'public/logos/sj_white.svg'

import { classNames } from 'src/helpers/css'

const FloatingNav = () => {
  const sideClasses =
    'border border-white bg-black/50 shadow-2xl backdrop-blur flex-1 h-full'
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mb-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="m-auto flex h-12 w-[90%] text-white">
        <div
          style={{
            background:
              'radial-gradient(circle 50px at center right, #0000 98%, red) center right',
          }}
          className="flex-grow-1 h-full w-full"
        ></div>
        <div className="absolute left-1/2 h-14 w-14 rounded-full bg-gray-900/90"></div>
        <div
          style={{
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(circle 50px at center left, #0000 98%, red) center left',
          }}
        ></div>
        {/* <div className="flex h-full items-center justify-center gap-1">
          <div className={classNames(sideClasses, ' radial')}>
            <div
              style={{
                backgroundImage:
                  'radial-gradient(circle 3rem at top left, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%))',
              }}
            />
            starting
          </div>
          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full border border-black bg-gray-900/90 align-middle shadow-2xl">
            <LogoWhite className="h-8 w-8" />
          </div>
          <div className={classNames(sideClasses)}>ending</div>
        </div> */}
      </div>
    </nav>
  )
}

export default FloatingNav
