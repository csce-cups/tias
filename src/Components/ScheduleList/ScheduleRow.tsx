import React, { FC } from 'react'
import popcorn1 from '../../assets/Popcorn_1.png'
import popcorn2 from '../../assets/Popcorn_2.png'
import popcorn3 from '../../assets/Popcorn_3.png'
import popcorn4 from '../../assets/Popcorn_4.png'
import popcorn5 from '../../assets/Popcorn_5.png'
import popcorn6 from '../../assets/Popcorn_6.png'

interface Props {
	element: string // The body of the list element
}

export const ScheduleRow: FC<Props> = ({element}) => {
	return (
		<>
      <div className="hstack">
        <div className="element left">
          <img src={popcorn1} alt="FIXME"/>
        </div>
        <div className="element right">
         {element}
        </div>
      </div>
      <div className="hr-container">
        <hr/>
      </div>
    </>
	)
}
