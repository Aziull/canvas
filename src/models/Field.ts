import { Coordinate } from './Coordinate';
import { Line } from './Line';

export class Field {
    lines: Line[] = []
    intersections: Coordinate[] = []

    addLine(line: Line) {
        this.lines = [...this.lines, line]
    }
    addIntersections(newLine: Line) {
        if (this.lines.length === 0) return []
        this.intersections = [...this.intersections, ...this.findIntersections(newLine)]
    }
    findIntersections(newLine: Line): Coordinate[] {
        if (this.lines.length === 0) return []

        const { start: p1, end: p2 } = newLine
        let { x: x1, y: y1 } = p1 as Coordinate
        let { x: x2, y: y2 } = p2 as Coordinate

        const k1 = (y2 - y1) / (x2 - x1)
        const d1 = (x2 * y1 - x1 * y2) / (x2 - x1)

        return this.lines.reduce((accumulator: Coordinate[], line: Line): Coordinate[] => {
            const { start: p3, end: p4 } = line
            let { x: x3, y: y3 } = p3 as Coordinate
            let { x: x4, y: y4 } = p4 as Coordinate

            const k2 = (y4 - y3) / (x4 - x3)
            const d2 = (x4 * y3 - x3 * y4) / (x4 - x3)

            const x = (d2 - d1) / (k1 - k2)
            const y = k1 * (d2 - d1) / (k1 - k2) + d1

            if (isNaN(x) || isNaN(y) || y < 0 || x < 0) return accumulator;

            [x1, x2] = x1 > x2 ? [x2, x1] : [x1, x2];
            [x3, x4] = x3 > x4 ? [x4, x3] : [x3, x4];

            [y1, y2] = y1 > y2 ? [y2, y1] : [y1, y2];
            [y3, y4] = y3 > y4 ? [y4, y3] : [y3, y4];

            if (x1 > x || x2 < x ||
                x3 > x || x4 < x) return [...accumulator]

            return [...accumulator, { x, y }]
        }, []);

    }

}