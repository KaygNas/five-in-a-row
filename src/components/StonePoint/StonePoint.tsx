import "./StonePoint.css"
import Stone from "../Stone/Stone"

type Props = {
    className: string
    dataset: {
        x: number
        y: number
    }
}

export default function StonePoint({ className, dataset }: Props) {
    return (
        <div
            className={`stone-point-wraper ${className}`}
            data-x={dataset.x}
            data-y={dataset.y}
            onClick={(e) => (e.target = e.currentTarget)}
        >
            <div className="stone-point__hr-line"></div>
            <div className="stone-point__v-line"></div>
            <Stone></Stone>
        </div>
    )
}
