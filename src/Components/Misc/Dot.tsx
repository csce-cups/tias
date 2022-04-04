import React, { FC, useEffect, useRef, useState } from 'react'
import colorFromId from '../../modules/color'

interface Props {
  linkID: number // An id that ties this dot corresponding dots elsewhere on the page
  isScheduled: boolean | null
}

// Adds or removes a class from dots with or without a certain link ID
const modifyDots = (id: number, newClass: string, inverted: boolean = false, remove: boolean = false) => {
  const hats = `div.hat${(inverted? ':not(' : '')}[link-id="${id}"]${(inverted? ')' : '')}`;
  let linkedHats = Array.from(document.querySelectorAll(hats));
  if (remove) linkedHats.forEach(e => e.parentElement?.classList.remove(newClass));
  else linkedHats.forEach(e => e.parentElement?.classList.add(newClass));
  
  const dots = `div.dot${(inverted? ':not(' : '')}[link-id="${id}"]${(inverted? ')' : '')}`;
  let linkedDots = Array.from(document.querySelectorAll(dots));
  if (remove) linkedDots.forEach(e => e.classList.remove(newClass));
  else linkedDots.forEach(e => e.classList.add(newClass));

  if (remove) {
    setTimeout(() => linkedHats.forEach(e => e.classList.remove(newClass)), 200); // Makes sure hat is hidden before unrendering 
  } else {
    linkedHats.forEach(e => e.classList.add(newClass));
  }
}

// Adds or removes a class from blocks containing dots with or without a certain link ID
interface modifyBlocksOptions {
  inverted?: boolean,
  remove?: boolean,
  exclude?: boolean
}

const modifyBlocks = (id: number, newClass: string, options: modifyBlocksOptions) => {
  const { inverted, remove, exclude } = options;
  const candidates = `div.hat${((inverted === true)? ':not(' : '')}[link-id="${id}"]${((inverted === true)? ')' : '')}`;
  const exclusions = `div.hat${((inverted !== true)? ':not(' : '')}[link-id="${id}"]${((inverted !== true)? ')' : '')}`;
  const excluded = Array.from(document.querySelectorAll(exclusions)).map(e => e.parentElement?.parentElement).filter((e, i, s) => s.indexOf(e) === i);

  let linked = Array.from(document.querySelectorAll(candidates))
  if (exclude === true) linked = linked.filter(e => excluded.indexOf(e.parentElement?.parentElement) === -1);

  if (remove) linked.forEach(e => e.parentElement?.parentElement?.classList.remove(newClass));
  else linked.forEach(e => e.parentElement?.parentElement?.classList.add(newClass));
}


export const Dot: FC<Props> = ({linkID, isScheduled}) => {
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
  });

  const emphasizeLinked = () => {
    modifyDots(linkID, 'emphasized'); // Give all dots with the same link ID the selected property
    modifyDots(linkID, 'deemphasized', true); // Give all dots with a different link ID the inactive property
  }
  
  const deemphasizeLinked = () => {
    modifyDots(linkID, 'emphasized', false, true); // Give all dots with the same link ID the selected property
    modifyDots(linkID, 'deemphasized', true, true); // Give all dots with a different link ID the inactive property
  }

  const toggleSelect = (forceState?: boolean) => {
    if (selected) {
      // Restores the page to no longer highlight certain dots
      modifyDots(linkID, 'selected', false, true);
      modifyBlocks(linkID, 'selected', {inverted: false, remove: true});

      modifyDots(linkID, 'deselected', true, true);
      modifyBlocks(linkID, 'deselected', {inverted: true, remove: true, exclude: true});

    } else {
      // Shrinks other dots and blocks to allow focus on a particular set of dots
      modifyDots(linkID, 'selected');
      modifyBlocks(linkID, 'selected', {});

      modifyDots(linkID, 'deselected', true);
      modifyBlocks(linkID, 'deselected', {inverted: true, exclude: true});
    }

    if (forceState === undefined) setSelected(!selected);
  }

  const {r, g, b} = colorFromId(linkID);

  const className = (
      (isScheduled === null)? ''
    : (isScheduled === true)? 'dot'
    : 'dot-failed'
  )

  return (
    <div 
      ref={ref}
      className={className} 
      link-id={linkID} 
      style={{backgroundColor: (isScheduled === true)? `rgb(${r}, ${g}, ${b})` : 'transparent'}} 
      onMouseOver={emphasizeLinked} 
      onMouseOut={deemphasizeLinked}
      onClick={() => toggleSelect()}
      t-id="dot"
    />
  )
}
