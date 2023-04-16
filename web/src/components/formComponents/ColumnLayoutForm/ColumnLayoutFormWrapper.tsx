export interface IColumnLayoutFormWrapperProps {
  children: JSX.Element | JSX.Element[]
}

export const ColumnLayoutFormWrapper = ({
  children,
}: IColumnLayoutFormWrapperProps) => {
  return (
    <div className="space-y-10 divide-y divide-gray-900/10">{children}</div>
  )
}
