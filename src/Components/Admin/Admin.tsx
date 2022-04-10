import React from 'react'
import { AdminCoursePanel } from './AdminCoursePanel'
import { AdminEmployeePanel } from './AdminEmployeePanel'

export const Admin = () => {
  return (
    <div className="app-body">
      < AdminEmployeePanel />
      < AdminCoursePanel />
    </div>
  )
}
