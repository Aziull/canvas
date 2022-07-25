import React, { useCallback } from 'react';
import { Coordinate } from '../models/Coordinate';
const useMousePosition = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    const [
        mousePosition,
        setMousePosition
    ] = React.useState<Coordinate | undefined>(undefined);

    const getCoordinates = useCallback((event: MouseEvent): Coordinate | undefined => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop };
    }, [canvasRef]);

    React.useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {

            const coordinates = getCoordinates(ev);
            setMousePosition(coordinates)
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, [getCoordinates]);


    return mousePosition;
};
export default useMousePosition;