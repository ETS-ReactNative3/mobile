/* eslint-disable react/forbid-prop-types */
/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2018
 */

import React from 'react';
import PropTypes from 'prop-types';

import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel } from 'victory-native';

import { APP_FONT_FAMILY, GREY, LIGHT_GREY, DARK_GREY, SUSSOL_ORANGE } from '../globalStyles';

export const BarChart = ({ data, width, height }) => {
  const renderYAxis = () => <VictoryAxis dependentAxis style={victoryStyles.axisY} />;
  const renderXAxis = () => {
    const tickTruncate = label => (label.length > 11 ? `${label.slice(0, 11)}...` : label);
    return <VictoryAxis tickFormat={tickTruncate} style={victoryStyles.axisX} />;
  };

  const { padTop, padBottom, padLeft, padRight, padDomain, style } = victoryStyles.barChart;

  const padding = {
    top: height * padTop,
    bottom: height * padBottom,
    left: width * padLeft,
    right: width * padRight,
  };

  const chartDimensions = width * (1 - (padLeft + padRight));
  const domainPadding = chartDimensions * padDomain;

  return (
    <VictoryChart width={width} height={height} padding={padding} domainPadding={domainPadding}>
      {data.map(({ values }) => (
        <VictoryBar
          style={style}
          data={values}
          labels={({ datum }) => datum.y}
          labelComponent={<VictoryLabel style={victoryStyles.labelStyle} />}
        />
      ))}
      {renderYAxis()}
      {renderXAxis()}
    </VictoryChart>
  );
};

BarChart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
};

const victoryStyles = {
  axisX: {
    axis: { stroke: LIGHT_GREY },
    ticks: { stroke: DARK_GREY },
    tickLabels: { fontFamily: APP_FONT_FAMILY, fill: GREY, textAnchor: 'end', angle: -45 },
  },
  axisY: {
    axis: { stroke: LIGHT_GREY },
    ticks: { stroke: DARK_GREY },
    tickLabels: { fontFamily: APP_FONT_FAMILY, fill: GREY },
  },
  barChart: {
    padTop: 0.1,
    padBottom: 0.15,
    padLeft: 0.1,
    padRight: 0.05,
    padDomain: 0.05,
    style: { data: { fill: SUSSOL_ORANGE } },
  },
  labelStyle: { fontFamily: APP_FONT_FAMILY, fill: GREY },
};
