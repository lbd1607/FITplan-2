import React from "react"

const NavLoadingAnimation = () => {
  return (
    <div className="navbar grid grid-flow-col grid-cols-10 mb-10 -mt-2">
      <div className="flex col-span-4 items-center">
        <div className="my-4 ml-7 mr-2 h-6 flex items-center">
          <div className="rounded-full bg-slate-300 h-10 w-10"></div>
        </div>

        <div className="h-2 bg-slate-300 rounded w-24"></div>
      </div>

      <div className="col-span-6 flex flex-auto px-6 py-5 items-center justify-end">
        <div className="p-4 max-w-lg w-full mr-3">
          <div className="animate-pulse flex space-x-4 items-center">
            <div className="flex-1 space-y-6 py-1">
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4">
                  <div className="h-2 bg-slate-300 rounded col-span-1"></div>
                  <div className="h-2 bg-slate-300 rounded col-span-1"></div>
                  <div className="h-2 bg-slate-300 rounded col-span-1"></div>
                  <div className="h-2 bg-slate-300 rounded col-span-1"></div>
                </div>
              </div>
            </div>
            <div className="rounded-full bg-slate-300 h-10 w-10"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavLoadingAnimation
