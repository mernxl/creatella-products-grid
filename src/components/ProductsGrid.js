import React, { useEffect, useMemo, useState } from 'react';
import { formatCurrency, formatDate, PageHelper } from '../utils';
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

export const ProductsGrid = () => {
  const [state, setState] = useState();
  const [rowWidth, setRowWidth] = useState();
  const [numColumns, setNumColumns] = useState(getNumColumns());

  const pageHelper = useMemo(() => new PageHelper('/products', {
    limit: 100,
    onChange: st => setState(st)
  }), [setState]);

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

  return <GridList data={pageHelper.getData()}
                   numColumns={numColumns}
                   keySelector={item => item.id}
                   renderItem={({ item }) => <ProductCard data={item}/>}
                   onEndReached={() => pageHelper.next()}
                   rowStyle={{ width: rowWidth }}
                   columnStyle={{ alignItems: 'center' }}
                   footerStyle={{ margin: '15px 0' }}
                   footerComponent={<ProductGridFooter state={state}/>}
  />;
};
