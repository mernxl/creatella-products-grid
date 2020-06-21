export const formatCurrency = (valueInCents: number) => {
  return `$${(valueInCents / 100).toFixed(2)}`;
};

/**
 * AdsFactory
 *
 * Form of a cache ads creator, for the same instance, we get same
 * order of ads, this solve issues when rendering next elements of
 * page content
 */
export class AdsFactory {
  ads = [];
  index = 0;

  generateAd() {
    return Math.floor(Math.random() * 1000);
  }

  reset() {
    this.index = 0;
  }

  getNext() {
    let ad = this.ads[ this.index ];
    if (ad === undefined) {
      let newAd = this.generateAd();
      // no consecutive, rare so check once
      if (ad === newAd) {
        newAd = this.generateAd();
      }
      ad = newAd;
      this.index += 1;
      this.ads.push(newAd);
    }

    this.index += 1;
    return ad;
  }
}

export * from './date.utils';
export * from './fetch.utils';
