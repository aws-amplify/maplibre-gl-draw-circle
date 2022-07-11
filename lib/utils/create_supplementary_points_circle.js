/**
 * Note: This file was copied from mapbox-gl-draw@1.1.1 because it is no longer accessible in later versions of mapbox-gl-draw which are required for security benefits.
 *
 * If this PR gets merged https://github.com/mapbox/mapbox-gl-draw/pull/1100 or mapbox-gl-draw is forked to maplibre-gl-draw we should investigate removing these files and getting the dependencies from mapbox-gl-draw
 */

const createVertex = require("./create_vertex");

function createSupplementaryPointsForCircle(geojson) {
  const { properties, geometry } = geojson;

  if (!properties.user_isCircle) return null;

  const supplementaryPoints = [];
  const vertices = geometry.coordinates[0].slice(0, -1);
  for (let index = 0; index < vertices.length; index += Math.round(vertices.length / 4)) {
    supplementaryPoints.push(createVertex(properties.id, vertices[index], `0.${index}`, false));
  }
  return supplementaryPoints;
}

module.exports = createSupplementaryPointsForCircle;
