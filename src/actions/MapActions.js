import * as types from '../constants/actionTypes';

export function initializeMap(mapType, container) {
	return { type: types.INITIALIZE_MAP, mapType, container };
}

export function toggle2D3D() {
	return { type: types.TOGGLE_2D_3D };
}

export function resetOrientation() {
	return { type: types.RESET_ORIENTATION };
}

export function setMapView(viewInfo) {
	return { type: types.SET_MAP_VIEW, viewInfo };
}

export function setMapViewInfo(viewInfo) {
	return { type: types.SET_MAP_VIEW_INFO, viewInfo };
}

export function toggleDisplayPoliticalBoundaries() {
    return { type: types.TOGGLE_POLITICAL_BOUNDARIES };
}

export function toggleDisplayPlaceLabels() {
    return { type: types.TOGGLE_PLACE_LABELS };
}

export function toggleEnableTerrain() {
    return { type: types.TOGGLE_ENABLE_TERRAIN };
}

export function setScaleUnits(units) {
	return { type: types.SET_SCALE_UNITS, units };
}

export function zoomIn() {
	return { type: types.ZOOM_IN };
}

export function zoomOut() {
	return { type: types.ZOOM_OUT };
}

export function setBasemap(layer) {
	return { type: types.SET_BASEMAP, layer };
}

export function hideBasemap() {
	return { type: types.HIDE_BASEMAP };
}

export function setDate(date) {
	return { type: types.SET_MAP_DATE, date };
}

export function pixelHover(pixel) {
	return { type: types.PIXEL_HOVER, pixel };
}