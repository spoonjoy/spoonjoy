import LogoWhite from 'public/logos/sj_white.svg'

const FloatingNav = () => {
  /**
   * sizing here is as follows:
   * radial gradients are (circleDiameter + desiredSpacing) / 2
   * negative margins on side things are circleDiameter / 2
   * */
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mb-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="m-auto flex h-12 w-[90%] text-white">
        <div
          style={{
            background: `radial-gradient(circle 2.25rem at center right, #0000 98%, rgb(17 24 39 / 0.7)) center right`,
          }}
          className="flex-grow-1 my-2 -mr-[2rem] h-full w-full rounded-l-full"
        >
          <div className="mr-[2rem] flex justify-center">before</div>
        </div>
        <div className="flex h-[4rem] w-[4rem] flex-shrink-0 flex-col items-center justify-center rounded-full bg-black/70">
          <LogoWhite className="h-8 w-8" />
        </div>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle 2.25rem at center left, #0000 98%, rgb(17 24 39 / 0.7)) center left`,
          }}
          className="flex-grow-1 my-2 -ml-[2rem] h-full w-full rounded-r-full"
        >
          <div className="ml-[2rem] flex justify-center">after</div>
        </div>
        <div className="absolute top-2 -bottom-2 -z-10 w-[90%] rounded-full backdrop-blur" />
      </div>
    </nav>
  )
}

export default FloatingNav
