import React, { FC } from 'react'

interface Props {
  genState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const GenerateButton: FC<Props> = ({genState}) => {
  return (
    <button data-testid="GenerateButton" id="generate-schedule-button">Generate Schedule</button>
  )
}
