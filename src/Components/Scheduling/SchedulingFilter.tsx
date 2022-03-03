import React, {FC} from 'react'

interface Props {
    filter: any//object int:bool
    setFilter: Function
}
const base = {
  121: true,
  221: true,
  312: true,
  314: true,
  313: true,
  315: true
}
export const SchedulingFilter:FC<Props> = ({filter, setFilter}) => {
  let filter_subjects = ['ALL', '121', '221', '312', '313', '314', '315'];
  let filter_elements = [];
  const update = (target: string) => () => {
    if(target=='ALL'){
      setFilter(base); //hardcoded default obj
    }
    else{
      let n: any = parseInt(target);
      setFilter((prev: any) => {
        let temp = {...prev}
        temp[n] = !prev[n];
        return temp;
      });
    }
  }
  let wrap = (content: string, style?: object) => { return <div onClick={update(content)} className="center filter element" style={style}>{content}</div>}
  
  const len = filter_subjects.length
  for (let i = 0; i < len - 1; i++) {
    if (filter[parseInt(filter_subjects[i])]) {
      filter_elements[i] = wrap(filter_subjects[i], {backgroundColor: 'orange'});
    } else {
      filter_elements[i] = wrap(filter_subjects[i]);
    }
  }
  if (filter[parseInt(filter_subjects[len-1])]) {
    filter_elements[len - 1] = wrap(filter_subjects[len - 1], {borderRight: 0, backgroundColor: 'orange'});
  }else{
    filter_elements[len - 1] = wrap(filter_subjects[len - 1], {borderRight: 0});
  }

  return (
	  <div className="hstack filter">
      <div className="static filter element">CSCE:</div>
      {filter_elements}

    </div>
  )
}
