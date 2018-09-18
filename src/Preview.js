import PropTypes from 'prop-types';
import React from 'react';

export default function GeoPreview({ value }) {
  return <div>{ value }</div>;
}

GeoPreview.propTypes = {
  value: PropTypes.node,
};
