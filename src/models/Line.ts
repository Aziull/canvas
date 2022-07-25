import { Coordinate } from "./Coordinate"

export class Line {
    start?: Coordinate;
    end?: Coordinate;

    setStart(start: Coordinate) {
        this.start = start
    }
    setEnd(end: Coordinate) {
        this.end = end
    }

}