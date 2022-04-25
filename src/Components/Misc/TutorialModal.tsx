import React, { useState } from 'react'

export const TutorialModal = () => {
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

  return (
    <>
	    <div className="tutorial-icon" onClick={() => setEditing(true)}>?</div>
        <div className={`full-modal-container ${!active? 'hidden' : ''}`}>
          <div className={`full-modal ${!active? 'hidden' : ''}`}>
            {rendered && <>
              <button className="red button" onClick={() => setEditing(false)}>Close</button>
              <iframe src="https://www.youtube.com/embed.dQw4w9WgXcQ"/>
            </>}
          </div>
        </div>
    </>
  )
}
