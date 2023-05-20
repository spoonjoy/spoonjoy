import { useCallback, useRef, useState, SetStateAction, Dispatch } from 'react'

const isFunction = <S>(
  setStateAction: SetStateAction<S>
): setStateAction is (prevState: S) => S => typeof setStateAction === 'function'

type ReadOnlyRefObject<T> = {
  readonly current: T
}

type UseStateRef = {
  <S>(initialState: S | (() => S)): [
    S,
    Dispatch<SetStateAction<S>>,
    ReadOnlyRefObject<S>
  ]
  <S = undefined>(): [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>,
    ReadOnlyRefObject<S | undefined>
  ]
}

/**
 * Use this instead of React.useState or React.useRef when you need:
 * - a ref that triggers rerenders
 * - a state that can always have the most up to date value accessed (for example, if you're trying to access state in a setTimeout, etc.)
 */
const useStateRef: UseStateRef = <S>(initialState?: S | (() => S)) => {
  const [state, setState] = useState(initialState)
  const ref = useRef(state)

  const dispatch: typeof setState = useCallback((setStateAction: any) => {
    ref.current = isFunction(setStateAction)
      ? setStateAction(ref.current)
      : setStateAction

    setState(ref.current)
  }, [])

  return [state, dispatch, ref]
}

export default useStateRef
