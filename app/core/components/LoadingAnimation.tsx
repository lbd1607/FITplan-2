import React from "react"

const LoadingAnimation = () => {
  return (
    <div className="w-full rounded-md px-10 py-1">
      <div className="flex animate-pulse space-x-4">
        <div className="flex-1 space-y-8 py-1">
          <div className="h-5 rounded-sm bg-slate-200"></div>
          <div className="h-5 rounded-sm bg-slate-200"></div>
          <div className="h-5 rounded-sm bg-slate-200"></div>
          <div className="h-5 rounded-sm bg-slate-200"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingAnimation
