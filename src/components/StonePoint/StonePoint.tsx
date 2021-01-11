import "./StonePoint.css"
import Stone from "../Stone/Stone"
import { Point } from "../../App"

type Props = {
    point: Point
}

export default function StonePoint({ point }: Props) {
    return (
        <div
            className={`stone-point-wrapper ${
                point.isStarPoint ? "star-point" : ""
            }`}
            data-x={point.x}
            data-y={point.y}
            onClick={(e) => (e.target = e.currentTarget)}
        >
            <div className="stone-point__hr-line"></div>
            <div className="stone-point__v-line"></div>
            {point.isWithStone && <Stone type={point.stoneType}></Stone>}
        </div>
    )
}
