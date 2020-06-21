import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * Component to display a grid list of items
 *
 * If numColumns passed, it will display items based on that number of columns
 * else it will display a single column
 */
export class GridList extends Component {
  constructor() {
    super();

    this.state = {
      end: 0,
      data: [[]],
    };

    this.footerRef = React.createRef();
  }

  componentDidMount() {
    // prepare data
    this.prepareData();
    // 200px so we start fetching 200px away from footer component
    this.observer = new IntersectionObserver(
      this.onEndReached, { root: null, rootMargin: "200px", threshold: 0 }
    );

    this.observer.observe(this.footerRef.current);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data || this.props.numColumns !== prevProps.numColumns) {
      this.prepareData();
    }
  }

  prepareData = () => {
    const rows = [];
    const { numColumns, data } = this.props;

    if (numColumns > 1) {
      for (let i = 0; i < data.length; i += numColumns) {
        rows.push(data.slice(i, i + numColumns));
      }
    } else {
      rows.push(data);
    }

    this.setState({ data: rows });
  };

  onEndReached = (entities) => {
    const y = entities[ 0 ].boundingClientRect.y;

    if (this.state.end > y && typeof this.props.onEndReached === 'function') {
      this.props.onEndReached();
    }

    this.setState({ end: y });
  };

  selectKey = ({ item, index }) => {
    return (this.props.keySelector && this.props.keySelector(item)) || String(index);
  };

  renderRows = (data) =>
    (<>{data.map((row, rowIndex) =>
      <div style={{ display: 'flex', ...this.props.rowStyle }}
           key={String(rowIndex)}>{row.map((item, index) =>
        this.renderItem({ index: (rowIndex * this.props.numColumns) + index, item }))}
      </div>)}
    </>);

  renderItem = ({ item, index }) =>
    React.cloneElement(
      this.props.renderItem({ item, index }),
      { key: this.selectKey({ item, index }) });

  render() {
    const { data } = this.state;
    const { numColumns, footerComponent, columnStyle, footerStyle } = this.props;

    return (
      <div>
        <div style={{
          display: 'flex',
          flexDirection: 'column', ...columnStyle
        }}>{numColumns && numColumns > 1 ?
          this.renderRows(data) : data[ 0 ].map((item, index) => this.renderItem({ item, index }))
        }</div>


        <div ref={this.footerRef} style={{ ...footerStyle }}>{footerComponent}</div>
      </div>
    );
  }
}

GridList.propTypes = {
  data: PropTypes.array,
  numColumns: PropTypes.number,
  renderItem: PropTypes.func,
  keySelector: PropTypes.func,
  onEndReached: PropTypes.func,
  rowStyle: PropTypes.object,
  columnStyle: PropTypes.object,
  footerStyle: PropTypes.object,
  footerComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};
