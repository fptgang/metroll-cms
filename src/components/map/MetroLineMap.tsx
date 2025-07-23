import React, { useEffect, useRef } from "react";
import { MetroLineDto, StationDto } from "../../data/interfaces";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon paths for Vite
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MetroLineMapProps {
  metroLine: MetroLineDto;
  className?: string;
}

export const MetroLineMap: React.FC<MetroLineMapProps> = ({
  metroLine,
  className = "",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Get color for the line
  const getLineColor = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      BLUE: "#1890ff",
      RED: "#ff4d4f",
      GREEN: "#52c41a",
      YELLOW: "#faad14",
      PURPLE: "#722ed1",
      ORANGE: "#fa8c16",
      PINK: "#eb2f96",
    };
    return colorMap[color?.toUpperCase()] || color || "#1890ff";
  };

  // Get unique stations from segments
  const getUniqueStations = (): StationDto[] => {
    if (!metroLine?.segments) return [];

    const stationsMap = new Map<string, StationDto>();

    metroLine.segments.forEach((segment) => {
      if (segment.startStation) {
        stationsMap.set(segment.startStation.code, segment.startStation);
      }
      if (segment.endStation) {
        stationsMap.set(segment.endStation.code, segment.endStation);
      }
    });

    return Array.from(stationsMap.values());
  };

  // Get line coordinates
  const getLineCoordinates = (): L.LatLng[] => {
    if (!metroLine?.segments || metroLine.segments.length === 0) return [];

    const sortedSegments = [...metroLine.segments].sort(
      (a, b) => a.sequence - b.sequence
    );
    const coordinates: L.LatLng[] = [];

    sortedSegments.forEach((segment, index) => {
      if (index === 0 && segment.startStation) {
        coordinates.push(
          L.latLng(segment.startStation.lat, segment.startStation.lng)
        );
      }
      if (segment.endStation) {
        coordinates.push(
          L.latLng(segment.endStation.lat, segment.endStation.lng)
        );
      }
    });

    return coordinates;
  };

  useEffect(() => {
    if (!mapRef.current || !metroLine?.segments?.length) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Get stations and coordinates
    const stations = getUniqueStations();
    const lineCoordinates = getLineCoordinates();

    if (stations.length === 0) return;

    // Calculate bounds
    const group = new L.FeatureGroup();
    stations.forEach((station) => {
      if (station.lat && station.lng) {
        group.addLayer(L.marker([station.lat, station.lng]));
      }
    });

    // Initialize map
    const map = L.map(mapRef.current).fitBounds(group.getBounds(), {
      padding: [20, 20],
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add metro line
    if (lineCoordinates.length > 1) {
      L.polyline(lineCoordinates, {
        color: getLineColor(metroLine.color),
        weight: 4,
        opacity: 0.8,
      }).addTo(map);
    }

    // Add station markers
    stations.forEach((station) => {
      if (station.lat && station.lng) {
        const marker =
          station.status !== "OPERATIONAL"
            ? L.circleMarker([station.lat, station.lng], {
                radius: 10,
                color: "red",
                fillColor: "orange",
                fillOpacity: 0.5,
              }).addTo(map)
            : L.marker([station.lat, station.lng]).addTo(map);

        // Create popup content
        const popupContent = `
          <div class="min-w-64">
            <h3 class="font-semibold text-lg mb-2">${station.name}</h3>
            <div class="space-y-1">
              <p><span class="font-medium">Code:</span> ${station.code}</p>
              <p><span class="font-medium">Address:</span> ${
                station.address
              }</p>
              <p><span class="font-medium">Status:</span> 
                <span class="ml-1 px-2 py-1 text-xs rounded ${
                  station.status === "OPERATIONAL"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }">
                  ${station.status}
                </span>
              </p>
              ${
                station.description
                  ? `<p><span class="font-medium">Description:</span> ${station.description}</p>`
                  : ""
              }
              <div class="mt-2">
                <span class="font-medium">Lines:</span>
                <div class="flex flex-wrap gap-1 mt-1">
                  ${
                    station.lineStationInfos
                      ?.map(
                        (lineInfo) =>
                          `<span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      ${lineInfo.lineCode}-${String(lineInfo.sequence).padStart(
                            2,
                            "0"
                          )}
                    </span>`
                      )
                      .join("") || ""
                  }
                </div>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
      }
    });

    mapInstanceRef.current = map;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [metroLine]);

  // Don't render if no data
  if (!metroLine || !metroLine.segments || metroLine.segments.length === 0) {
    return (
      <div
        className={`w-full h-96 ${className} flex items-center justify-center bg-gray-100 rounded-lg`}
      >
        <p className="text-gray-500">No metro line data available</p>
      </div>
    );
  }

  return (
    <div className={`w-full h-96 ${className}`}>
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};
