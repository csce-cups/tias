import React from 'react'
import { WatchDirectoryFlags } from 'typescript';

interface Props<context> {
  what: React.Context<[context, React.Dispatch<React.SetStateAction<context>>]>
  value?: context
  spy: jest.Mock<any, any>
  children: React.ReactNode;
}

export const ContextSetterSpy = <context,>(props: React.PropsWithChildren<Props<context>>) => {
  return (
    < props.what.Consumer >
      {([value,]) => (
        < props.what.Provider value={[props.value || value, props.spy]}>
          { props.children }
        </ props.what.Provider >
      )}
    </props.what.Consumer>
  )
}
