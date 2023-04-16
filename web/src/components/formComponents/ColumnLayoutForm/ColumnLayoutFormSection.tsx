export interface IColumnLayoutFormSectionProps {
  children: JSX.Element
  sectionTitle: string
  sectionDescription?: string
}

export const ColumnLayoutFormSection = ({
  children,
  sectionTitle,
  sectionDescription,
}: IColumnLayoutFormSectionProps) => {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
      {/* if first, need to add pt-10 */}
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          {sectionTitle}
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          {sectionDescription}
        </p>
      </div>

      <div className="overflow-clip bg-white p-5 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 md:p-8">
        {children}
      </div>
    </div>
  )
}
