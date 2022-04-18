import React from 'react'
import { ChangeoverFileUploadButton } from '../Misc/ChangeoverFileUploadButton'
import { ExportFileButton } from '../Misc/ExportFileButton'
import { AdminCourseList } from './AdminCourseList'
import { SectionEditButton } from './SectionEditButton'

export const AdminCoursePanel = () => {
  return (
    <div className="vstack panel">
      < AdminCourseList />
      < ExportFileButton />
      < SectionEditButton />
      < ChangeoverFileUploadButton />
    </div>
  )
}
