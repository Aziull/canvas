import { FC, useCallback, useEffect, useRef, useState } from 'react'
import useMousePosition from '../hooks/useMousePosintion'
import { Field } from '../models/Field'
import { Line } from '../models/Line'
import { Coordinate } from '../models/Coordinate'

interface CanvasProps {
    width: number,
    height: number
}

const CanvasComponent: FC<CanvasProps> = ({ width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [isPainting, setIsPainting] = useState<boolean>(false)
    const mousePosition = useMousePosition(canvasRef)

    const [line, setLine] = useState<Line>(new Line())
    const [field, setField] = useState<Field>(new Field())


    const startPaint = () => {
        if (isPainting) return
        setIsPainting(true)
        if (mousePosition)
            line.setStart(mousePosition)


    }

    const drawIntersections = useCallback((line: Line) => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d')
        if (!context) return
        field.findIntersections(line).forEach(intersection => {
            const { x, y } = intersection
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(x, y, 2, 0, 2 * Math.PI);
            context.fill();
        });
    }, [field])
    const clear = useCallback(() => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d')
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);

            field.lines.forEach(line => {
                const start = line.start as Coordinate
                const end = line.end as Coordinate
                context.beginPath();
                context.moveTo(start.x, start.y);
                context.lineTo(end.x, end.y);
                context.stroke()

                drawIntersections(line)

            })
        }
    }, [drawIntersections, field.lines])

    const paint = () => {
        if (!isPainting) return
        clear()
        if (mousePosition) {
            line.setEnd(mousePosition)
            drawLine(line.start as Coordinate, line.end as Coordinate);
            drawIntersections(line)

        }

    }

    const exitPaint = (event: number) => {
        if (!isPainting || event === 2) {
            setIsPainting(false);
            clear()
            return
        }
        setIsPainting(false);
        mousePosition && line.setEnd(mousePosition)
        field.addLine(line)
        clear()
        field.addIntersections(line)
        setLine(new Line())
    }
    const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef?.current;
        const context = canvas.getContext('2d')
        if (!context) return
        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(originalMousePosition.x, originalMousePosition.y);
        context.lineTo(newMousePosition.x, newMousePosition.y);

        context.stroke()
    }

    const requestRef = useRef<NodeJS.Timer>();
    const [timer, setTimer] = useState(0)

    const animate = () => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d')
        if (!context) return
        const frame = 1000 / 60
        const scale = 1 - 0.025
        requestRef.current = setInterval(() => {

            context.clearRect(0, 0, canvas.width, canvas.height)
            context.scale(scale, scale)
            context.translate(canvas.width * 0.0128, canvas.height * 0.0128)
            setTimer(prev => prev + frame)
            clear()
        }, frame)
    }
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d')
        if (timer > 3000) {
            context?.resetTransform()
            clearInterval(requestRef.current)
            setTimer(0)
            setField(new Field())
        }
    }, [timer])


    return (
        <>
            <canvas onMouseMove={() => { paint() }}
                onClick={(e) => { isPainting ? exitPaint(e.button) : startPaint() }}
                onContextMenu={(event) => { event.preventDefault(); exitPaint(event.button) }}
                ref={canvasRef}
                width={width}
                height={height} />
            <button disabled={timer !== 0 ? true : false}
                onClick={() => { animate() }}>
                collapse lines
            </button>

        </>

    )
}
CanvasComponent.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight,
};
export default CanvasComponent