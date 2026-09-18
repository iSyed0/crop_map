# Vegetation-index API

Small Express server that holds the Google Earth Engine service-account
credentials and exposes live MODIS NDVI/EVI as plain JSON/tile endpoints —
so the Earth Engine private key never has to leave the server or reach the
browser.

## One-time Google Cloud / Earth Engine setup

You need to do this yourself (it requires your own Google login):

1. **Create or pick a Google Cloud project.** https://console.cloud.google.com/projectcreate
2. **Enable the Earth Engine API** for that project:
   https://console.cloud.google.com/apis/library/earthengine.googleapis.com
3. **Register the project for Earth Engine** (one-time, free for
   noncommercial use): https://code.earthengine.google.com/register — pick
   "Use with an existing Cloud project" and select the project from step 1.
4. **Create a service account** in that project:
   https://console.cloud.google.com/iam-admin/serviceaccounts → *Create
   Service Account* (any name, e.g. `crop-dashboard-ee`).
5. **Grant it Earth Engine access.** Either:
   - Add the service account's email as a *Reader* under the registered
     Earth Engine project at https://code.earthengine.google.com/register/, or
   - Grant it the `Earth Engine Resource Viewer` IAM role on the Cloud project.
6. **Create a JSON key** for the service account: on its detail page →
   *Keys* → *Add Key* → *Create new key* → JSON. This downloads a `.json`
   file — treat it like a password.

## Local setup

```bash
cd server
npm install
cp .env.example .env
```

Put the downloaded JSON key file at `server/service-account-key.json`
(already gitignored), or paste its contents into `GEE_SERVICE_ACCOUNT_KEY_JSON`
in `.env` instead — see the comments in `.env.example`.

```bash
npm run dev
```

Then check it actually authenticated:

```bash
curl http://localhost:4310/api/health
# {"ok":true,"earthEngine":"initialized"}
```

If that returns an error instead, it's almost always steps 3 or 5 above —
the Cloud project isn't registered for Earth Engine yet, or the service
account hasn't been granted access to it.

## Endpoints

- `GET /api/vegetation/tile?index=ndvi|evi&date=YYYY-MM-DD` (date optional,
  defaults to now) → `{ index, date, tileUrlTemplate, min, max, palette }`.
  `tileUrlTemplate` is an XYZ URL (`{z}/{x}/{y}`) for the latest MODIS
  composite on/before `date`, ready to drop into a Mapbox GL raster source.
- `GET /api/vegetation/timeseries?lat=&lon=&index=ndvi|evi&start=&end=`
  (start/end optional, default to the last 6 months) →
  `{ index, lat, lon, points: [{ date, value }] }`, one point per MODIS
  16-day composite covering that location.

## Running alongside the frontend

This is a separate process from the Vite dev server — run both:

```bash
# terminal 1
cd server && npm run dev

# terminal 2 (repo root)
npm run dev
```

The frontend calls this API at `VITE_VEGETATION_API_URL` (root `.env`,
defaults to `http://localhost:4310`).
