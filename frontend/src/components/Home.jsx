import React from 'react'
import Hero from '../Home/Hero'
import Trending from '../Home/Trending'
import Devotional from '../Home/Devotional'
import Creator from '../Home/Creator'

function Home() {
  return (
    <div className="pt-16">
      <Hero />
      <Trending />
      <Devotional />
      <Creator />
    </div>
  )
}

export default Home