import React, { useRef, useState } from 'react';
import './App.css';
import { ProductsGrid } from './components/ProductsGrid';
import { API_ENDPOINT } from './config/contants';

function App() {
  const [sort, setSort] = useState('');

  // prevent homeAd from changing when doing refresh of products
  const { current: homeAd } = useRef(Math.floor(Math.random() * 1000));

  return (
    <div className="App">
      <header>
        <h1>Products Grid</h1>

        <p>Here you're sure to find a bargain on some of the finest ascii available to purchase. Be
          sure to peruse our selection of ascii faces in an exciting range of sizes and prices.</p>

        <p>But first, a word from our sponsors:</p>
        <img className="ad" alt="ads"
             src={API_ENDPOINT + "/ads/?r=" + homeAd}/>
      </header>

      <div className="products-sort">
        <span>Sort Products By: </span>
        <div className="products-sort-btn-block">
          {['id', 'size', 'price'].map((order) =>
            <button onClick={() => setSort(order)}
                    className={`btn ${order === sort ? 'active-sort' : ''}`}
            >
              {order}
            </button>)}
        </div>
      </div>

      <section className="products">
        <ProductsGrid sort={sort}/>
      </section>
    </div>
  );
}

export default App;
