import React from 'react'
import { ChangeoverFileUploadButton } from '../Misc/ChangeoverFileUploadButton'
import { ExportFileButton } from '../Misc/ExportFileButton'
import { AdminCourseList } from './AdminCourseList'

export const AdminCoursePanel = () => {
  return (
    <div className="vstack panel">
      < AdminCourseList />
      < ChangeoverFileUploadButton />
      < ExportFileButton />
    </div>
  )
}
