/**
 * Note: This file was copied from mapbox-gl-draw@1.1.1 because it is no longer accessible in later versions of mapbox-gl-draw which are required for security benefits.
 *
 * If this PR gets merged https://github.com/mapbox/mapbox-gl-draw/pull/1100 or mapbox-gl-draw is forked to maplibre-gl-draw we should investigate removing these files and getting the dependencies from mapbox-gl-draw
 */

const Constants = require("./constants");

/**
 * Returns GeoJSON for a Point representing the
 * vertex of another feature.
 *
 * @param {string} parentId
 * @param {Array<number>} coordinates
 * @param {string} path - Dot-separated numbers indicating exactly
 *   where the point exists within its parent feature's coordinates.
 * @param {boolean} selected
 * @return {GeoJSON} Point
 */
module.exports = function (parentId, coordinates, path, selected) {
  return {
    type: Constants.geojsonTypes.FEATURE,
    properties: {
      meta: Constants.meta.VERTEX,
      parent: parentId,
      coord_path: path,
      active: selected ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE,
    },
    geometry: {
      type: Constants.geojsonTypes.POINT,
      coordinates: coordinates,
    },
  };
};
