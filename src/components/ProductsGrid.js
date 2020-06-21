import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AdsFactory, formatCurrency, formatDate, PageHelper } from '../utils';
import AdsContent from './AdsContent';
import { GridList } from './GridList';
import './ProductsGrid.css';

const ProductCard = ({ data }) => {
  return (
    <div className="product">
      <div className="product-face"
           style={{ fontSize: data.size, overflow: 'hidden' }}>{data.face}</div>
      <div>
        <span className="product-price">{formatCurrency(data.price)}</span>{' • '}
        <span className="product-size">{data.size}px</span>
      </div>
      <div className="product-date">{formatDate(new Date(data.date))}</div>
    </div>);
};

const ProductGridFooter = ({ state }) => {
  switch (state) {
    case 'complete':
      return '~ end of catalogue ~';

    case 'loading':
      return 'loading ...';

    default:
      return '';
  }
};

// 150 product card width + marginX + borderX
const getNumColumns = () => Math.floor(window.screen.availWidth / (150 + 10 + 4));

export const ProductsGrid = ({ sort }) => {
  const [state, setState] = useState();
  const [rowWidth, setRowWidth] = useState();
  const [data, setData] = useState([]);
  const [numColumns, setNumColumns] = useState(getNumColumns());

  const { current: adsFactory } = useRef(new AdsFactory());

  const pageHelper = useMemo(() => {
    let url = '/products';

    if (sort) {
      url += `?_sort=${sort}`;
    }

    return new PageHelper(url, {
      limit: 100,
      onChange: st => setState(st)
    })
  }, [setState, sort]);

  useEffect(() => {
    const resizeListener = () => {
      setNumColumns(getNumColumns());
    };

    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, [numColumns, setNumColumns]);

  useEffect(() => {
    pageHelper.next();
  }, [pageHelper]);

  useEffect(() => {
    setRowWidth(numColumns * (150 + 15));
  }, [numColumns, setRowWidth]);

  useEffect(() => {
    const d = Array.of(...pageHelper.getData());
    adsFactory.reset();

    if (state === 'loaded') {
      for (let i = 20; i < d.length; i += 20) {
        const ad = adsFactory.getNext();
        d.splice(i, 0, { id: `_ads_${ad}`, ad: adsFactory.getNext() });
      }

      setData(d);
    }
  }, [adsFactory, pageHelper, state, setData]);


  return <GridList data={data}
                   numColumns={numColumns}
                   keySelector={item => item.id}
                   renderItem={({ item }) =>
                     (item.ad ? <AdsContent ad={item.ad}/> :
                       <ProductCard data={item}/>)
                   }
                   onEndReached={() => pageHelper.next()}
                   rowStyle={{ width: rowWidth }}
                   columnStyle={{ alignItems: 'center' }}
                   footerStyle={{ margin: '15px 0' }}
                   footerComponent={<ProductGridFooter state={state}/>}
  />;
};

ProductsGrid.propTypes = {
  sort: PropTypes.oneOf(['', 'id', 'size', 'price'])
};
