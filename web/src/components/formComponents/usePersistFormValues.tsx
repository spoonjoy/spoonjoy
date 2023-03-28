import localforage from 'localforage'
import { debounce } from 'lodash'

import { FieldValues, useFormContext } from '@redwoodjs/forms'

type PersistableForms = 'recipe-form'

/** Returns an onChange function to be used by every field that we want to refresh the persisted values on change */
export const usePersistValuesOnChange = <FormType extends FieldValues>(
  formType: PersistableForms = 'recipe-form'
) => {
  const { getValues } = useFormContext<FormType>()

  const persistFormState = () => {
    const values = getValues()
    console.log('current form values are', values)
    localforage.setItem<FormType>(formType, getValues() as FormType)
  }

  return React.useCallback(debounce(persistFormState, 500), [])
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
