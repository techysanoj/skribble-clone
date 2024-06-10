import React from 'react'

function PlayerCard({pl, curruser, playerDrawing}) {
  return (
    <div className={` flex flex-col justify-center items-center h-16 w-full border-b-2 border-black ${playerDrawing && playerDrawing.id===pl.id?"bg-gray-400":""} `}>
        <p>{`${pl.name} ${curruser?'(you)':''}`}</p>
        <p>{`${pl.points} points`}</p>
    </div>
  )
}

export default PlayerCard