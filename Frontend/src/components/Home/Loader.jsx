import React from 'react'
import loaderVideo from "../../assets/1080x1920.mp4";
import Lodermaking from './Lodermaking.jsx';

const Loader = ({ onComplete }) => {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-black">
        <video autoPlay loop muted className="justify-center items-center h-150 mb-30 sm:h-150 sm:mb-30">
            <source src={loaderVideo} type="video/mp4" />
        </video>
        <div className="justify-baseline">
          <Lodermaking onComplete={onComplete} />
        </div>
    </div>
  )
}
export default Loader