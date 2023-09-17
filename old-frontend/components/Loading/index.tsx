import React from "react";


const Loading: React.FunctionComponent = () => {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      zIndex: 10000
    }}>
      <img style={{
        width: 300,
        height: 300,
        position: "fixed",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }} src="/assets/loading.gif" alt="loading"/>
    </div>
  )
}

export default Loading;