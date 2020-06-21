import * as qs from 'qs';
import { API_ENDPOINT } from '../config/contants';

export const fetchData = (url) => fetch(API_ENDPOINT + url)
  .then(data => data.json());

export class UrlHelper {
  baseUrl: string;
  params: { [ key: string ]: any } = {};

  constructor(baseUrl = '') {
    const urlAndParams = baseUrl.split('?');

    this.baseUrl = urlAndParams[ 0 ] || '';

    this.extractParams(urlAndParams[ 1 ]);

    return this;
  }

  extractParams(str = ''): UrlHelper {
    const params: Record<string, any> =
      qs.parse(str, { comma: true, strictNullHandling: true }) || {};

    for (const name in params) {
      this.setParam(name, params[ name ]);
    }

    return this;
  }

  setParam(name: string, value: string | number | boolean | null | undefined, filter?: any): this {
    if (value === filter || value === undefined) {
      return this;
    }

    this.params[ name ] = value;

    return this;
  }

  setParams(params: { [ name: string ]: any }, filter?: any): this {
    const names = Object.keys(params);

    for (const name of names) {
      this.setParam(name, params[ name ], filter);
    }

    return this;
  }

  unSetParam(name: string): this {
    delete this.params[ name ];

    return this;
  }

  getUrl(): string {
    const query = this.getQueryStr();

    return query ? this.baseUrl + '?' + query : this.baseUrl;
  }

  getQueryStr(): string {
    return qs.stringify(this.params, { arrayFormat: 'comma', strictNullHandling: true });
  }
}

export class PageHelper {
  url: UrlHelper;
  state: 'init' | 'loading' | 'loaded' | 'complete' = 'init'
  config = { pageKey: '_page', limitKey: '_limit', limit: 10 };
  pageInfo = { current: 0 };
  isFetching = false;

  _data = [];

  constructor(url: string,
              config?: { onChange: () => any, limitKey: string, pageKey: string, limit: number }
  ) {
    this.url = new UrlHelper(url);
    this.config = {
      ...this.config,
      ...config
    };
  }

  getData() {
    return this._data.slice(0, this.pageInfo.current * this.config.limit);
  }

  // include next elements to data if already fetched, else fetch new
  next() {
    if (this.state === 'complete' || this.state === 'loading') {
      return;
    }

    this._stateChange('loading');

    this.fetchNext().then(() => {
      // go to next page
      this.pageInfo.current += 1;
      this._stateChange('loaded');

      if (this._data.length < this.pageInfo.current * this.config.limit) {
        this._stateChange('complete')
      }

      // fetchNext items, and store
      return this.fetchNext();
    })
  }

  _stateChange(state: string) {
    this.state = state;

    if (this.config.onChange) {
      this.config.onChange(state);
    }
  }

  async fetchNext() {
    // check if still fetch or current count is less than actual data, that case, already fetched
    if (this.state === 'complete' || this.isFetching || this.pageInfo.current * this.config.limit > this._data.length) {
      return;
    }

    this.url.setParams({
      [ this.config.limitKey ]: this.config.limit,
      [ this.config.pageKey ]: this.pageInfo.current + 1,
    });

    this.isFetching = true;

    try {
      const data = await fetchData(this.url.getUrl());
      // const data = await axios.request({ url: this.url.getUrl() });

      this._data.push(...data);
    } catch (e) {
      console.error(e)
    }
    this.isFetching = false;
  }
}


