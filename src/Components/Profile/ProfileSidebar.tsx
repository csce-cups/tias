import React from 'react'
import { getJSDocTypeParameterTags } from 'typescript'
import contexts from '../APIContext'

export const ProfileSidebar = () => {
  const img = (googleData: any) => {
    try {
      return <img src={(googleData !== {})? googleData.getImageUrl() : undefined} className="profile-picture"/>
    } catch (TypeError) {
      return <div>No Image</div>
    }
  }

  const name = (googleData: any) => {
    try {
      return <span>{googleData.getGivenName()} {googleData.getFamilyName()}</span>
    } catch (TypeError) {
      return <span>Loading...</span>
    }
  }

  return (
    <div className="profile-sidebar">
      <div style={{height: '100px'}}/>
      <span>Peer Teacher</span>
      < contexts.googleData.Consumer >
        {([googleData, _]) => (
          <>
            <div className="hstack">
              {img(googleData)}
            </div>
            <span>{name(googleData)}</span>
          </>
        )}
      </contexts.googleData.Consumer>
    </div>
  )
}
