import { GRID_CONFIG } from "../constants/gridConfig";
import { GridItem } from "../utils/types";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";

interface CircleProps {
  circle: GridItem;
  mousePosition: { x: number; y: number };
  onPress: (circle: GridItem) => void;
  isMobile?: boolean;
}

const Circle = React.memo(
  ({ circle, mousePosition, onPress, isMobile = false }: CircleProps) => {
    const circleCenter = useMemo(
      () => ({
        x: circle.x + GRID_CONFIG.RADIUS / 2,
        y: circle.y + GRID_CONFIG.RADIUS / 2,
      }),
      [circle.x, circle.y],
    );

    const distanceFromMouse = useMemo(
      () =>
        Math.sqrt(
          Math.pow(circleCenter.x - mousePosition.x, 2) +
            Math.pow(circleCenter.y - mousePosition.y, 2),
        ),
      [circleCenter.x, circleCenter.y, mousePosition.x, mousePosition.y],
    );

    const scale = useMemo(() => {
      if (isMobile) {
        // Réduire l'effet de zoom sur mobile
        return distanceFromMouse < GRID_CONFIG.ZOOM_ZONE_SIZE / 3
          ? 1 +
              (GRID_CONFIG.CENTER_ZOOM - 1) *
                0.7 *
                Math.max(
                  1 - distanceFromMouse / (GRID_CONFIG.ZOOM_ZONE_SIZE / 3),
                )
          : 1;
      }
      return distanceFromMouse < GRID_CONFIG.ZOOM_ZONE_SIZE / 2
        ? 1 +
            (GRID_CONFIG.CENTER_ZOOM - 1) *
              Math.max(1 - distanceFromMouse / (GRID_CONFIG.ZOOM_ZONE_SIZE / 2))
        : 1;
    }, [distanceFromMouse, isMobile]);

    const handleClick = useCallback(() => {
      onPress(circle);
    }, [onPress, circle]);

    return (
      <motion.div
        onClick={handleClick}
        style={{
          position: "absolute",
          left: circle.x,
          top: circle.y,
          width: GRID_CONFIG.RADIUS,
          height: GRID_CONFIG.RADIUS,
          borderRadius: "50%",
          overflow: "visible",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
          contain: "layout paint style",
        }}
        whileHover={{
          transition: { duration: isMobile ? 0.1 : 0.2 },
        }}
        initial={false}
        layout={false}
      >
        <div className="w-full h-full cursor-pointer relative">
          {circle.image ? (
            <div className="w-full h-full rounded-full">
              <Image
                src={circle.image}
                alt={circle.name}
                width={GRID_CONFIG.RADIUS}
                height={GRID_CONFIG.RADIUS}
                className="rounded-full"
                loading="lazy"
                unoptimized={false}
              />
            </div>
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: circle.color }}
            />
          )}
        </div>
      </motion.div>
    );
  },
  // Comparateur de props personnalisé pour éviter les re-rendus inutiles
  (prevProps, nextProps) => {
    // Vérifier les modifications importantes uniquement
    const positionChanged =
      prevProps.circle.x !== nextProps.circle.x ||
      prevProps.circle.y !== nextProps.circle.y;

    const mouseSignificantlyMoved =
      Math.abs(prevProps.mousePosition.x - nextProps.mousePosition.x) >
        (prevProps.isMobile ? 10 : 5) ||
      Math.abs(prevProps.mousePosition.y - nextProps.mousePosition.y) >
        (prevProps.isMobile ? 10 : 5);

    // Ne re-rendre que si la position a changé ou si la souris s'est déplacée de façon significative
    return !positionChanged && !mouseSignificantlyMoved;
  },
);

Circle.displayName = "Circle";
export default Circle;
