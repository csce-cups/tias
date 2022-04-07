import React from 'react'
import { ChangeoverFileUploadButton } from '../Misc/ChangeoverFileUploadButton'
import { AdminCourseList } from './AdminCourseList'

export const AdminCoursePanel = () => {
  return (
    <div className="vstack panel">
      < AdminCourseList />
      < ChangeoverFileUploadButton />
    </div>
  )
}
