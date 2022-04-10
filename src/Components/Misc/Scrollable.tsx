import React, { FC, ReactNode, useEffect, useState } from 'react'
import uuid from '../../uuid';

interface Props {
	children: ReactNode;
  classes?: string;
}

export const Scrollable: FC<Props> = ({children, classes}) => {
  const [id,] = useState(uuid());

  // https://css-tricks.com/scroll-shadows-with-javascript/
  useEffect(() => {
    let content = document.getElementById(`scrollable-${id}`)!;
    
    let wrapper = document.getElementById(`sw-${id}`)!;
    let shadowTop = document.getElementById(`shadow-top-${id}`)!;
    let shadowBtm = document.getElementById(`shadow-btm-${id}`)!;
    let contentScrollHeight = content.scrollHeight - wrapper.offsetHeight;
    if (contentScrollHeight === 0) {
      shadowTop.style.opacity = "0";
      shadowBtm.style.opacity = "0";
    }
    
    function callback(this: HTMLElement, ev: Event) {
      const currentScroll = this.scrollTop / (contentScrollHeight);  
      shadowTop.style.opacity = `${currentScroll}`;
      shadowBtm.style.opacity = `${1 - currentScroll}`;
    }

    content.addEventListener('scroll', callback);

    return () => content.removeEventListener('scroll', callback);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  return (
    <div id={`sw-${id}`} className="scrollable-wrapper">
      <div id={`shadow-top-${id}`} className="shadow shadow--top"></div>
      <div id={`shadow-btm-${id}`} className="shadow shadow--bottom"></div>
      <div id={`scrollable-${id}`} className={`scrollable ${classes? classes : ''}`}>
        {children}
      </div>
    </div>
  )
}
