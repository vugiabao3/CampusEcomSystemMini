import { useEffect, useMemo, useRef } from "react";

import {
  getStatusLabel,
  getStatusClass,
  getTypeLabel,
} from "./lostFoundStatus.js";

// MODULE_3: Backend cung cấp toạ độ, Frontend chỉ hiển thị pin.
// Khoá Google Maps đọc từ biến môi trường của Frontend,
// không đưa khoá vào mã nguồn.
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let googleMapsPromise = null;

// Nạp Google Maps JavaScript API một lần duy nhất.
function loadGoogleMaps(apiKey) {
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;

    script.async = true;

    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error("Google Maps chưa sẵn sàng."));
      }
    };

    script.onerror = () => {
      googleMapsPromise = null;

      reject(new Error("Không tải được Google Maps."));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

function buildInfoWindowContent(pin, isCenter = false) {
  const container = document.createElement("div");

  const title = document.createElement("strong");

  title.textContent = (isCenter ? "📍 Bài đăng gốc: " : "") + (pin.title ?? "");

  const meta = document.createElement("div");

  meta.textContent = [
    getTypeLabel(pin.type),
    getStatusLabel(pin.status),
    pin.location ?? "",
  ]
    .filter(Boolean)
    .join(" · ");

  container.appendChild(title);
  container.appendChild(meta);

  return container;
}

// Campus Map: hiển thị pin Lost / Found.
export default function LostFoundMap({ pins, loading, error, centerPin, isMatches }) {
  const containerRef = useRef(null);

  const hasKey = Boolean(GOOGLE_MAPS_API_KEY);

  const mapPins = useMemo(
    () => (Array.isArray(pins) ? pins : []),
    [pins]
  );

  useEffect(() => {
    if (!hasKey || loading || error || mapPins.length === 0) {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    let isCancelled = false;

    async function renderMap() {
      try {
        const maps = await loadGoogleMaps(GOOGLE_MAPS_API_KEY);

        if (isCancelled || !container) {
          return;
        }

        let center;
        if (centerPin && centerPin.lat && centerPin.lng) {
          center = {
            lat: Number(centerPin.lat),
            lng: Number(centerPin.lng),
          };
        } else {
          center = {
            lat: mapPins.reduce((sum, pin) => sum + Number(pin.lat), 0) /
              mapPins.length,
            lng: mapPins.reduce((sum, pin) => sum + Number(pin.lng), 0) /
              mapPins.length,
          };
        }

        const map = new maps.Map(container, {
          center,
          zoom: 15,
        });

        const infoWindow = new maps.InfoWindow();

        // Add center pin first (if provided)
        if (centerPin && centerPin.lat && centerPin.lng) {
          const position = {
            lat: Number(centerPin.lat),
            lng: Number(centerPin.lng),
          };

          const marker = new maps.Marker({
            map,
            position,
            title: "Bài đăng gốc: " + (centerPin.title ?? "Lost & Found"),
            icon: {
              path: maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
            },
            zIndex: 100,
          });

          marker.addListener("click", () => {
            infoWindow.setContent(buildInfoWindowContent(centerPin, true));

            infoWindow.open({ map, anchor: marker });
          });
        }

        // Add match pins
        mapPins.forEach((pin) => {
          const position = {
            lat: Number(pin.lat),
            lng: Number(pin.lng),
          };

          const isMatch = isMatches && pin.postId !== centerPin?.postId;

          const marker = new maps.Marker({
            map,
            position,
            title: (isMatch ? "✅ Khớp: " : "") + (pin.title ?? "Lost & Found"),
            icon: isMatch
              ? {
                  path: maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: "#34A853",
                  fillOpacity: 1,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                }
              : undefined,
          });

          marker.addListener("click", () => {
            infoWindow.setContent(buildInfoWindowContent(pin, false));

            infoWindow.open({ map, anchor: marker });
          });
        });
      } catch {
        // Không tải được Google Maps: bản danh sách toạ độ bên dưới
        // vẫn hiển thị dữ liệu thật từ Backend.
      }
    }

    renderMap();

    return () => {
      isCancelled = true;
    };
  }, [centerPin, error, hasKey, isMatches, loading, mapPins]);

  if (loading) {
    return (
      <div className="posts-state">
        Đang tải bản đồ campus...
      </div>
    );
  }

  if (error) {
    return (
      <div className="message message-error" role="alert">
        {error}
      </div>
    );
  }

  const allPins = useMemo(() => {
    const result = [...mapPins];
    if (centerPin && centerPin.lat && centerPin.lng) {
      result.unshift({ ...centerPin, isCenter: true });
    }
    return result;
  }, [centerPin, mapPins]);

  return (
    <div className="lost-map">
      {hasKey && (
        <div
          className="lost-map-canvas"
          ref={containerRef}
        />
      )}

      {!hasKey && (
        <div className="lost-map-notice">
          <strong>Campus Map</strong>

          <span>
            Chưa cấu hình khoá Google Maps (VITE_GOOGLE_MAPS_API_KEY).
            Danh sách dưới đây dùng toạ độ thật do Backend cung cấp.
          </span>
        </div>
      )}

      {allPins.length === 0 ? (
        <div className="posts-state posts-state--empty">
          Chưa có đồ thất lạc nào có toạ độ.
        </div>
      ) : (
        <ul className="lost-map-pins">
          {allPins.map((pin) => (
            <li className="lost-map-pin" key={pin.postId}>
              <div className="lost-map-pin-head">
                <strong>
                  {pin.isCenter ? "📍 " : isMatches ? "✅ " : ""}
                  {pin.title}
                </strong>

                <span className={getStatusClass(pin.status)}>
                  {getStatusLabel(pin.status)}
                </span>
              </div>

              <div className="lost-map-pin-meta">
                <span>
                  {getTypeLabel(pin.type)}
                  {pin.location ? ` · ${pin.location}` : ""}
                </span>

                <span>
                  {Number(pin.lat).toFixed(5)}, {Number(pin.lng).toFixed(5)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}