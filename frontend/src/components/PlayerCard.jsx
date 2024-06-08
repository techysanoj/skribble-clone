import React from 'react'

function PlayerCard({pl, curruser, currentUserDrawing}) {
  return (
    <div className={` flex justify-center items-center h-16 w-full border-b-2 border-black ${curruser && currentUserDrawing?"bg-gray-400":""} `}>
        <p>{`${pl} ${curruser?'(you)':''}`}</p>
    </div>
  )
}

export default PlayerCard