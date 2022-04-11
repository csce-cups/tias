import React, { FC, ReactNode } from 'react'
import { CourseBlock } from '../../modules/API'
import { DisplayBlock } from './DisplayBlock'

interface Props {
  children?: ReactNode
  selected: [CourseBlock | null, CourseBlock | null]
}

export const SwapSet: FC<Props> = ({children, selected}) => {
  return (
    <div className="hstack reqoff-col">
      <div className='interact-blocks standalone new-trade-col fill'>
        <div className="new-trade-col-content trade-left">
          < DisplayBlock visible={true} data={{course_instance: selected[0], shift: false}}/>
        </div>
      </div>
      
      <div className="new-trade-col-content arrow-container">
        <div className="arrow"/>
      </div>

      <div className='interact-blocks standalone new-trade-col fill'>
        <div className="new-trade-col-content trade-right">
          < DisplayBlock visible={true} data={{course_instance: selected[1], shift: true}}/>
        </div>
      </div>

      { children? 
        <div className="vstack dotstack">
          { children }
        </div>
        : <></>
      }
    </div>
  )
}
