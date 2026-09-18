"""
Regenerates pakistan-boundary.geojson from the government's
Pakistan_National.geojson (mainland + Jammu & Kashmir + minor islands).

The source file is ~82k vertices combined -- too large to embed inline in
every Earth Engine request. This unions all its features into one geometry
and simplifies it to a tolerance well under MODIS's 250m pixel size, so the
clip mask loses no visible accuracy but shrinks to a few thousand vertices.

Usage (from server/data/):
    python build-boundary.py path/to/Pakistan_National.geojson

Requires: shapely
"""
import json
import os
import sys

from shapely.geometry import mapping, shape
from shapely.ops import unary_union
from shapely.validation import make_valid

# ~110m -- comfortably under MODIS/061/MOD13Q1's 250m pixel size.
TOLERANCE_DEG = 0.001

OUT_PATH = os.path.join(os.path.dirname(__file__), "pakistan-boundary.geojson")


def main():
    if len(sys.argv) != 2:
        print(f"Usage: python {sys.argv[0]} path/to/Pakistan_National.geojson")
        sys.exit(1)
    src_path = sys.argv[1]

    with open(src_path, encoding="utf-8") as fh:
        data = json.load(fh)

    geoms = []
    for feat in data["features"]:
        g = shape(feat["geometry"])
        if not g.is_valid:
            g = make_valid(g)
        geoms.append(g)

    merged = unary_union(geoms)
    simplified = merged.simplify(TOLERANCE_DEG, preserve_topology=True)
    if not simplified.is_valid:
        simplified = make_valid(simplified)

    geom = mapping(simplified)
    if geom["type"] == "Polygon":
        geom = {"type": "MultiPolygon", "coordinates": [geom["coordinates"]]}
    elif geom["type"] != "MultiPolygon":
        raise SystemExit(f"Unexpected geometry type after union/simplify: {geom['type']}")

    out = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Pakistan (national boundary, incl. Jammu & Kashmir)",
                    "source": os.path.basename(src_path),
                    "simplify_tolerance_deg": TOLERANCE_DEG,
                },
                "geometry": geom,
            }
        ],
    }

    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(out, fh)

    n_vertices = sum(len(ring) for poly in geom["coordinates"] for ring in poly)
    print(f"Wrote {OUT_PATH} ({os.path.getsize(OUT_PATH):,} bytes, {n_vertices:,} vertices)")


if __name__ == "__main__":
    main()
