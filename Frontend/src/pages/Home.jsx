import { useState } from 'react'
import Loader from '../components/Home/Loader.jsx'
import PageTransition from '../components/Home/PageTransition.jsx'
import image from "../assets/oar2.jpg";

const Home = () => {
  const [loading, setLoading] = useState(true)
  const [transitionActive, setTransitionActive] = useState(false)
  const [homeVisible, setHomeVisible] = useState(false)

  return (
    <div>
      {loading && (
        <Loader
          onComplete={() => {
            setLoading(false)
            setTransitionActive(true)
          }}
        />
      )}

      <PageTransition
        active={transitionActive}
        onComplete={() => {
          setHomeVisible(true)
          setTransitionActive(false)
        }}
      />

      {homeVisible && (
        <div className="bg-black w-screen h-screen justify-center flex items-center">{<img src={image} alt="Background"  />}
        <h1 className="text-white text-4xl font-bold p-10">Heyy Niggga</h1></div>
      )}
    </div>
  )
}

export default Home