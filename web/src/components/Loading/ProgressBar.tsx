interface IProgressBarProps {
  successAmount: number
  failureAmount: number
  totalAmount: number
}

const ProgressBar = ({
  successAmount,
  failureAmount,
  totalAmount,
}: IProgressBarProps) => {
  const successPercentage = (successAmount / totalAmount) * 100
  const failurePercentage = (failureAmount / totalAmount) * 100
  return (
    <div className="relative mt-1 mb-2 h-3 w-48 overflow-hidden rounded-full">
      <div className="absolute flex h-full w-full justify-start bg-gray-200">
        <div
          id="success-bar"
          style={{
            width: `${successPercentage}%`,
          }}
          className={`h-full bg-indigo-700 transition-all duration-1000 ease-out`}
        />
        <div
          id="failure-bar"
          style={{
            width: `${failurePercentage}%`,
          }}
          className={`h-full w-[${failurePercentage}%] bg-red-600 transition-all duration-1000 ease-out`}
        />
      </div>
    </div>
  )
}

export default ProgressBar
