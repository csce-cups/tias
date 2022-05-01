import React, { FC, useEffect, useState } from 'react'

interface Props {
  link?: string
  light?: boolean
  children?: React.ReactNode
}

export const TutorialModal: FC<Props> = ({link: _link, light, children}) => {
	const [active, setActive] = useState(false);
  const [rendered, setRendered] = useState(false);

  const setEditing = (to: boolean) => {
    setActive(to);
    if (!to) {
      setTimeout(() => {
        setRendered(to);
      }, 800);
    } else {
      setRendered(to);
    }
  }
  
  let link = _link;
  if (!_link) {
    switch (window.location.pathname) {
      case '/scheduling': // Scheduling page
        link = 'https://www.youtube.com/embed/UWn3OUdRbYo';
        break;
      case '/profile': // Profile page
        link = 'https://www.youtube.com/embed/zpbWHwiFSZk';
        break;
      case '/labswap': // LabSwap™ page
        link = 'https://www.youtube.com/embed/m72nqyLH288';
        break;
      case '/admin': // Admin page
        link = 'https://www.youtube.com/embed/SVS0C_Fqwd4';
        break;
      default:
        link = undefined; // No tutorial
    }
  }

  return (
    <>
      <div className={`tutorial-icon ${light? 'light' : ''}`} onClick={() => setEditing(true)}>?</div>
      <div className={`full-modal-container ${!active? 'hidden' : ''}`}>
        <div className={`full-modal ${!active? 'hidden' : ''}`}>
          {rendered && <>
            <button className="red button" style={{margin: '5px'}} onClick={() => setEditing(false)}>Close</button>
            { children? children
              :  
              link?
                <iframe src={link} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
                : 
                <div className="loading">No tutorial available for this page.</div> 
            }
          </>}
        </div>
      </div>
    </>
  )
}
