import React, {FC} from 'react'

interface Props {
    filter: any//() => {},
    setFilter: any//() => {},
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
  let filterCp = {...filter}
  let filter_subjects = ['ALL', '121', '221', '312', '313', '314', '315'];
  let filter_elements = [];
  const update = (target: string) => () => {
    if(target=='ALL'){
      setFilter(base); //hardcoded default obj
    }
    else{
      let n: any = parseInt(target);
      if(n===121){
        filterCp[121]=!filter[121];

      } else if (n===221){
        filterCp[221]=!filter[221];
      } else if (n===312){
        filterCp[312]=!filter[312];
      } else if(n===313){
        filterCp[313]=!filter[313];
      } else if(n===314){
        filterCp[314]=!filter[314];
      } else if(n===315){
        filterCp[315]=!filter[315];
      }
      setFilter(filterCp);
    }
  }
  let wrap = (content: string, style?: object) => { return <div onClick={update(content)} className="center filter element" style={style}>{content}</div>}
  
  const len = filter_subjects.length
  for (let i = 0; i < len - 1; i++) {
    if (filterCp[parseInt(filter_subjects[i])]) {
      filter_elements[i] = wrap(filter_subjects[i], {backgroundColor: 'orange'});
    } else {
      filter_elements[i] = wrap(filter_subjects[i]);
    }
  }
  if (filterCp[parseInt(filter_subjects[len-1])]) {
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
