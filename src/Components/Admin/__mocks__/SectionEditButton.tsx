import React from 'react';
import { EditableSection } from '../../../modules/API';

export const toUpdateContext = React.createContext<[
  EditableSection[], React.Dispatch<React.SetStateAction<EditableSection[]>>,
  number, React.Dispatch<React.SetStateAction<number>>
]>([
  [], 0 as any,
  0, 0 as any
]);

export const SectionEditButton = () => {
  return (
    <div data-testid="SectionEditButton"/>
  )
}
