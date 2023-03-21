import { classNames } from 'src/helpers/css'

interface IActionButtonsContainerProps {
  children: React.ReactNode
  location: 'list-card' | 'recipe-header'
}

const ActionButtonsContainer = ({
  children,
  location,
}: IActionButtonsContainerProps) => (
  <>
    {location === 'list-card' && (
      <div className="absolute left-0 top-0 right-0 z-10 flex h-16 rounded-t-lg bg-gradient-to-b from-black to-transparent text-white opacity-50" />
    )}
    <div
      className={classNames(
        location === 'list-card' ? 'absolute top-5 right-4 z-20' : 'mt-2 mr-2',
        'flex gap-2'
      )}
    >
      {children}
    </div>
  </>
)

export default ActionButtonsContainer
