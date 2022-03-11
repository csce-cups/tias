import React, { FC, useEffect, useRef, useState } from 'react'
import Palette from '../../assets/colors.json'
import uuid from '../../uuid'

interface Props {
  linkID: number // An id that ties this dot corresponding dots elsewhere on the page
  styles?: any
}

// Adds or removes a class from dots with or without a certain link ID
const modifyDots = (id: number, newClass: string, inverted: boolean = false, remove: boolean = false) => {
  const selector = `div.hat${(inverted? ':not(' : '')}[link-id="${id}"]${(inverted? ')' : '')}, div.dot${(inverted? ':not(' : '')}[link-id="${id}"]${(inverted? ')' : '')}`;
  let linked = Array.from(document.querySelectorAll(selector));
  if (remove) linked.forEach(e => e.classList.remove(newClass));
  else linked.forEach(e => e.classList.add(newClass));
}

// Adds or removes a class from blocks containing dots with or without a certain link ID
const modifyBlocks = (id: number, newClass: string, inverted: boolean = false, remove: boolean = false) => {
  const selector = `div.hat${(inverted? ':not(' : '')}[link-id="${id}"]${(inverted? ')' : '')}`;
  let linked = Array.from(document.querySelectorAll(selector));
  if (remove) linked.forEach(e => e.parentElement?.classList.remove(newClass));
  else linked.forEach(e => e.parentElement?.classList.add(newClass));
}


export const Dot: FC<Props> = ({linkID, styles}) => {
  const [selected, setSelected] = useState(false);
  const ref: any = useRef(null);
  
  // https://blog.logrocket.com/detect-click-outside-react-component-how-to/
  useEffect(() => { // Disables focus view on mouse click outside
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target) && selected) {
        toggleSelect(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [ selected, ref ]);

  const emphasizeLinked = () => {
    modifyDots(linkID, 'emphasized'); // Give all dots with the same link ID the selected property
    modifyDots(linkID, 'deemphasized', true); // Give all dots with a different link ID the inactive property
  }
  
  const deemphasizeLinked = () => {
    modifyDots(linkID, 'emphasized', false, true); // Give all dots with the same link ID the selected property
    modifyDots(linkID, 'deemphasized', true, true); // Give all dots with a different link ID the inactive property
  }

  const toggleSelect = (forceState?: boolean) => {
    if (forceState !== undefined) setSelected(forceState);

    if (selected) { // Restores the page to no longer highlight certain dots
      modifyDots(linkID, 'selected', false, true);
      modifyBlocks(linkID, 'selected', false, true);

      modifyDots(linkID, 'deselected', true, true);
      modifyBlocks(linkID, 'deselected', true, true);
    } else { // Shrinks other dots and blocks to allow focus on a particular set of dots
      modifyDots(linkID, 'selected');
      modifyBlocks(linkID, 'selected');

      modifyDots(linkID, 'deselected', true);
      modifyBlocks(linkID, 'deselected', true);
    }

    if (forceState === undefined) setSelected(!selected);
  }

  return (
    <div 
      ref={ref}
      className="dot" 
      link-id={linkID} 
      style={{backgroundColor: Palette.colors[linkID % Palette.colors.length], ...styles}} 
      onMouseOver={emphasizeLinked} 
      onMouseOut={deemphasizeLinked}
      onClick={() => toggleSelect()}
      data-testid="dot"
    />
  )
}
