import React from 'react';
import './App.css';
import { API_ENDPOINT } from './config/contants';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Products Grid</h1>

        <p>Here you're sure to find a bargain on some of the finest ascii available to purchase. Be
          sure to peruse our selection of ascii faces in an exciting range of sizes and prices.</p>

        <p>But first, a word from our sponsors:</p>
        <img className="ad" alt="ads" src={API_ENDPOINT + "/ads/?r=" + Math.floor(Math.random()*1000)}/>
      </header>

      <section className="products">
        ... products go here ...
      </section>
    </div>
  );
}

export default App;
