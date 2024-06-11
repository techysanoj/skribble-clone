import React from 'react'

function PlayerCard({pl, curruser, playerDrawing}) {
  console.log(pl.avatar)
  return (
    <div className={` flex gap-4 items-center h-16 w-full px-2 border-b-2 border-black ${playerDrawing && playerDrawing.id===pl.id?"bg-gray-400":""} `}>
        <div className='flex justify-center items-center h-16 w-16 contain-size'>
        < img  src={pl.avatar} alt="Avatar" className='avatar-img'/>

        </div>
        <div className=' flex flex-col justify-center items-center mx-auto '>
        <p>{`${pl.name} ${curruser?'(you)':''}`}</p>
        <p>{`${pl.points} points`}</p>
        </div>
    </div>
  )
}

export default PlayerCard