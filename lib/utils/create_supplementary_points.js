/**
 * Note: This file was copied from mapbox-gl-draw@1.1.1 because it is no longer accessible in later versions of mapbox-gl-draw which are required for security benefits.
 *
 * If this PR gets merged https://github.com/mapbox/mapbox-gl-draw/pull/1100 or mapbox-gl-draw is forked to maplibre-gl-draw we should investigate removing these files and getting the dependencies from mapbox-gl-draw
 */

const createVertex = require("./create_vertex");
const createMidpoint = require("./create_midpoint");
const Constants = require("./constants");

function createSupplementaryPoints(geojson, options = {}, basePath = null) {
  const { type, coordinates } = geojson.geometry;
  const featureId = geojson.properties && geojson.properties.id;

  let supplementaryPoints = [];

  if (type === Constants.geojsonTypes.POINT) {
    // For points, just create a vertex
    supplementaryPoints.push(createVertex(featureId, coordinates, basePath, isSelectedPath(basePath)));
  } else if (type === Constants.geojsonTypes.POLYGON) {
    // Cycle through a Polygon's rings and
    // process each line
    coordinates.forEach((line, lineIndex) => {
      processLine(line, basePath !== null ? `${basePath}.${lineIndex}` : String(lineIndex));
    });
  } else if (type === Constants.geojsonTypes.LINE_STRING) {
    processLine(coordinates, basePath);
  } else if (type.indexOf(Constants.geojsonTypes.MULTI_PREFIX) === 0) {
    processMultiGeometry();
  }

  function processLine(line, lineBasePath) {
    let firstPointString = "";
    let lastVertex = null;
    line.forEach((point, pointIndex) => {
      const pointPath = lineBasePath !== undefined && lineBasePath !== null ? `${lineBasePath}.${pointIndex}` : String(pointIndex);
      const vertex = createVertex(featureId, point, pointPath, isSelectedPath(pointPath));

      // If we're creating midpoints, check if there was a
      // vertex before this one. If so, add a midpoint
      // between that vertex and this one.
      if (options.midpoints && lastVertex) {
        const midpoint = createMidpoint(featureId, lastVertex, vertex, options.map);
        if (midpoint) {
          supplementaryPoints.push(midpoint);
        }
      }
      lastVertex = vertex;

      // A Polygon line's last point is the same as the first point. If we're on the last
      // point, we want to draw a midpoint before it but not another vertex on it
      // (since we already a vertex there, from the first point).
      const stringifiedPoint = JSON.stringify(point);
      if (firstPointString !== stringifiedPoint) {
        supplementaryPoints.push(vertex);
      }
      if (pointIndex === 0) {
        firstPointString = stringifiedPoint;
      }
    });
  }

  function isSelectedPath(path) {
    if (!options.selectedPaths) return false;
    return options.selectedPaths.indexOf(path) !== -1;
  }

  // Split a multi-geometry into constituent
  // geometries, and accumulate the supplementary points
  // for each of those constituents
  function processMultiGeometry() {
    const subType = type.replace(Constants.geojsonTypes.MULTI_PREFIX, "");
    coordinates.forEach((subCoordinates, index) => {
      const subFeature = {
        type: Constants.geojsonTypes.FEATURE,
        properties: geojson.properties,
        geometry: {
          type: subType,
          coordinates: subCoordinates,
        },
      };
      supplementaryPoints = supplementaryPoints.concat(createSupplementaryPoints(subFeature, options, index));
    });
  }

  return supplementaryPoints;
}

module.exports = createSupplementaryPoints;
