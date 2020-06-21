// import PropTypes  from 'p'
import PropTypes from 'prop-types';
import React from 'react';
import { API_ENDPOINT } from '../config/contants';
import './ProductsGrid.css';

const AdsContent = ({ ad }) =>
  <img className="ad ad-in-product product" alt="ads" src={API_ENDPOINT + "/ads/?r=" + ad}/>;

AdsContent.propTypes = {
  ad: PropTypes.number.isRequired,
};

export default AdsContent;
