import React, { FC, useEffect, useRef, useState } from 'react'
import { Hat } from '../../Misc/__mocks__/Hat';

import RenderBlockProps, { calcFlex, blockColors } from '../../Scheduling/BlockBase';
import { formatDate } from '../../../modules/BlockFunctions';
import { CourseBlock, Person } from '../../../modules/API';

type shortday = 'M' | 'T' | 'W' | 'R' | 'F';
interface DisplayBlock extends CourseBlock {
  days: (shortday)[]
}

interface Props extends RenderBlockProps {
  data: {
    course_instance: CourseBlock | null | undefined
    person: Person | null | undefined
    shift: boolean
  }
}

export const DisplayBlock: FC<Props> = ({visible, size, inline, data}) => {
 

  return (
    <div data-testid={JSON.stringify(data.course_instance)}/>
  )
}
