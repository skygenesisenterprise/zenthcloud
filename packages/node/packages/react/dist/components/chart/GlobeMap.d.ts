export interface GlobeMapMarker {
    /** Longitude in decimal degrees. */
    longitude: number;
    /** Latitude in decimal degrees. */
    latitude: number;
    /** Primary tooltip label. */
    name: string;
    /** Optional secondary tooltip text. */
    description?: string;
    /** Marker fill. Overrides `markerColor`. */
    color?: string;
    /** Marker radius in view-box pixels. Overrides `markerRadius`. */
    radius?: number;
}
export interface GlobeMapProps {
    /** Stroke color for the hatched land. Defaults to the neutral Kumo map area color. */
    landColor?: string;
    /** Spacing between land hatch lines in view-box pixels. Default: `10`. */
    landHatchSpacing?: number;
    /** Fill behind the land and graticule. Default: the Kumo base surface. */
    oceanColor?: string;
    /** Geographic points drawn above the land. Points fade at the horizon and back-facing points are hidden. */
    markers?: GlobeMapMarker[];
    /** Default marker fill. Defaults to the Kumo chart blue. */
    markerColor?: string;
    /** Default marker radius in view-box pixels. Default: `7`. */
    markerRadius?: number;
    /** Called when a visible marker is clicked. */
    onMarkerClick?: (marker: GlobeMapMarker) => void;
    /** Initial globe rotation as `[longitude, latitude, roll]`. */
    defaultRotation?: [number, number, number];
    /** Allow pointer dragging to rotate the globe. Default: `true`. */
    draggable?: boolean;
    /** Continuously rotate the globe horizontally. Default: `false`. */
    autoRotate?: boolean;
    /** Horizontal auto-rotation speed in degrees per second. Default: `4`. */
    autoRotateSpeed?: number;
    /** Draw latitude and longitude guides. Default: `false`. */
    showGraticule?: boolean;
    /** Show the Kumo-styled marker tooltip. Default: `true`. */
    showTooltip?: boolean;
    /** Called after pointer or keyboard interaction changes the globe rotation. */
    onUserRotationChange?: (rotation: [number, number, number]) => void;
    /** Accessible label for the visualization. Default: `"Interactive globe map"`. */
    "aria-label"?: string;
    /** Fixed component height. Otherwise the globe uses a square aspect ratio. */
    height?: number;
    className?: string;
    isDarkMode?: boolean;
}
/**
 * GlobeMap — an SVG orthographic globe with hatched land and geographic
 * markers. Rendering is SVG-only and does not use WebGL.
 */
export declare const GlobeMap: import("react").ForwardRefExoticComponent<GlobeMapProps & import("react").RefAttributes<HTMLDivElement>>;
