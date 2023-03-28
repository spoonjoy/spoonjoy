import localforage from 'localforage'

import { useWatch, FieldValues } from '@redwoodjs/forms'

type PersistableForms = 'recipe-form'

/** This hook persists all form values to local storage. You should use this as low down the component tree as possible, as it'll cause a rerender on value change */
const usePersistFormValues = <FormType extends FieldValues>(
  formType: PersistableForms = 'recipe-form'
) => {
  const currFormState = useWatch<FormType>()

  React.useEffect(() => {
    // set timeout is to debounce this
    const persistFormData = setTimeout(() => {
      console.log('current form values are', currFormState)
      localforage.setItem<FormType>(formType, currFormState as FormType)
    }, 500)

    return () => clearTimeout(persistFormData)
  }, [currFormState, formType])
}

/** Use this if you want to just set the value in local storage one time */
export const setPersistedFormValues = <FormType extends FieldValues>(
  formType: PersistableForms,
  currFormState: FormType,
  callback?: () => void
) => localforage.setItem<FormType>(formType, currFormState, callback)

/** Use this to clear any persisted form values */
export const clearPersistedFormValues = (formType: PersistableForms) =>
  localforage.setItem(formType, null)

/** Use this if you just need to get the value from local storage */
export const getPersistedFormValues = <FormType extends FieldValues>(
  formType: PersistableForms
) => localforage.getItem<FormType>(formType)

/** set RHF defaultValues to this */
export const getPersistedFormValuesAsDefaultValues = <
  FormType extends FieldValues
>(
  formType: PersistableForms,
  fallbackDefault: FormType
): (() => Promise<FormType>) => {
  return async () =>
    await localforage
      .getItem<FormType>(formType)
      .then((res) => res || fallbackDefault)
}

export default usePersistFormValues
