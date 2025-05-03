import React from 'react'

export default function Userslayout({children, farmers, inspectors, suppliers}) {
  return (
    <>
    {children}

    <div>{farmers}</div>
    <div>{suppliers}</div>
    <div>{inspectors}</div>
    
    </>
  )
}
