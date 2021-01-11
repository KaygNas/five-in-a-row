import "./GoBoard.css"
import StonePoint from "../StonePoint/StonePoint"
import {
    GoBoardSize,
    STAR_POINTS_POS,
    stoneRecords,
    Point,
    Action,
    playWhiteStoneOn,
    playBlackStoneOn
} from "../../App"
import _ from "lodash"

type Props = {
    size: GoBoardSize
    stoneRecords: stoneRecords
    dispatch: React.Dispatch<Action>
}

const STONE_POINT_SIZE = {
    width: 40,
    height: 40
}

export default function GoBoard({ size, stoneRecords, dispatch }: Props) {
    const range: number[] = _.range(size.value)
    const goBoardSize = {
        width: (size.value - 1) * STONE_POINT_SIZE.width,
        height: (size.value - 1) * STONE_POINT_SIZE.height
    }
    const pointsRange: Point[][] = range.map((x) =>
        range.map((y) => {
            return { isWithStone: false, isStarPoint: false, x, y } as Point
        })
    )
    // temporially in mutable way
    stoneRecords.forEach((record) => {
        const matchPoint = pointsRange[record.x][record.y]
        pointsRange[record.x][record.y] = {
            ...matchPoint,
            ...record,
            isWithStone: true
        }
    })
    STAR_POINTS_POS[size.name].forEach((startPoint) => {
        pointsRange[startPoint.x][startPoint.y].isStarPoint = true
    })

    function handlePlayOn(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { x, y } = (e.target as HTMLElement).dataset
        if (x && y) {
            stoneRecords.length % 2 === 0
                ? dispatch(playWhiteStoneOn(x, y))
                : dispatch(playBlackStoneOn(x, y))
        }
    }

    return (
        <div className="go-board-warper" style={goBoardSize}>
            <div className="go-board" onClick={handlePlayOn}>
                {pointsRange.map((row, index) => (
                    <GoBoardRow key={index} row={row} />
                ))}
            </div>
        </div>
    )
}

function GoBoardRow({ row }: { row: Point[] }) {
    return (
        <div className="go-board__row">
            {row.map((point, index) => (
                <StonePoint
                    key={index}
                    className={`${
                        point.isWithStone
                            ? "with-stone--" + point.stoneType
                            : ""
                    } ${point.isStarPoint ? "star-point" : ""}`}
                    dataset={{
                        x: point.x,
                        y: point.y
                    }}
                />
            ))}
        </div>
    )
}
