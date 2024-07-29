import React, { useState, useContext } from 'react'
import SolanaPayContext from '../contexts/SolanaPayContext'
import SolanaPayStack from '../stacks/SolanaPayStack'

export default (props)=>{

  const [showSolanaPayStack, setShowSolanaPayStack]  = useState()

  const start = ()=>{
    setShowSolanaPayStack(true)
  }

  if(showSolanaPayStack) {

    return(
      <SolanaPayStack
        setShowSolanaPayStack={ setShowSolanaPayStack }
        document={ props.document }
        container={ props.container }
        unmount={ props.unmount }
      />
    )

  } else {

    return(
      <SolanaPayContext.Provider value={{
        start
      }}>
        { props.children }
      </SolanaPayContext.Provider>
    )
  }
}
