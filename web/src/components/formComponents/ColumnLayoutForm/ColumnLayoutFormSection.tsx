import { classNames } from 'src/helpers/css'

export interface IColumnLayoutFormSectionProps {
  children: JSX.Element
  sectionTitle: string
  sectionDescription?: string
  /** Use this if your child component isn't handling padding itself */
  withPadding?: boolean
}

export const ColumnLayoutFormSection = ({
  children,
  sectionTitle,
  sectionDescription,
  withPadding,
}: IColumnLayoutFormSectionProps) => {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          {sectionTitle}
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          {sectionDescription}
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className={classNames(withPadding ? 'form-section-padding' : '')}>
          {children}
        </div>
      </div>
    </div>
  )
}
