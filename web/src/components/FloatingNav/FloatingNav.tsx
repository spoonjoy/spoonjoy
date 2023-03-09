import LogoWhite from 'public/logos/sj_white.svg'

const FloatingNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mb-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="m-auto h-12 w-[90%] rounded-full border border-white bg-black/50 text-white shadow-2xl backdrop-blur">
        <div className="flex h-full items-center justify-center gap-1">
          <div className="flex-1 text-center">starting</div>
          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full border border-black bg-gray-900/90 align-middle shadow-2xl">
            <LogoWhite className="h-8 w-8" />
          </div>
          <div className="flex-1 text-center">ending</div>
        </div>
      </div>
    </nav>
  )
}

export default FloatingNav
