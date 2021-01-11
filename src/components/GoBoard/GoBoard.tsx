import "./GoBoard.css"
import StonePoint from "../StonePoint/StonePoint"
import PlayStatus from "../../components/PlayStatus/PlayStatus"
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
import { useEffect, useState } from "react"

type Props = {
    size: GoBoardSize
    stoneRecords: stoneRecords
    dispatch: React.Dispatch<Action>
}

export type Winner = {
    hasWinner: boolean
    winner?: "white" | "black"
}

const NO_WINNER = { hasWinner: false } as Winner

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
    // 默认白方先行，即下子数量为双数时轮到白方
    const currentPlayer =
        stoneRecords.steps.length % 2 === 0 ? "white" : "black"

    const records = stoneRecords.records
    const pointsRange: Point[][] = range.map((x) =>
        range.map((y) => {
            if (records[x] && records[x][y]) {
                return records[x][y]
            }
            return { isWithStone: false, isStarPoint: false, x, y } as Point
        })
    )
    STAR_POINTS_POS[size.name].forEach((startPoint) => {
        pointsRange[startPoint.x][startPoint.y].isStarPoint = true
    })

    const winner = checkHasWinner(pointsRange)

    function checkHasWinner(pointsRange: Point[][]): Winner {
        const pointsWithStone = pointsRange
            .map((row) => row.filter((point) => point.isWithStone))
            .filter((row) => row.length > 0)

        for (let x = 0; x < pointsWithStone.length; x++) {
            for (let y = 0; y < pointsWithStone.length; y++) {
                const res = [
                    checkIfStonesLinkedOnX([x, y], pointsWithStone),
                    checkIfStonesLinkedOnY([x, y], pointsWithStone),
                    checkIfStonesLinkedOnXY([x, y], pointsWithStone)
                ]
                const winner = res.find((val) => val.hasWinner)
                if (winner) return winner
            }
        }

        return NO_WINNER
    }

    function handlePlayOn(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { x, y } = (e.target as HTMLDivElement).dataset
        if (x && y) {
            currentPlayer === "white"
                ? dispatch(playWhiteStoneOn(x, y))
                : dispatch(playBlackStoneOn(x, y))
        }
    }

    return (
        <div className="go-board-wrapper">
            <PlayStatus currentPlayer={currentPlayer} winner={winner} />
            <div className="go-board-border" style={goBoardSize}>
                <div className="go-board" onClick={handlePlayOn}>
                    {pointsRange.map((row, index) => (
                        <GoBoardRow key={index} row={row} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function GoBoardRow({ row }: { row: Point[] }) {
    return (
        <div className="go-board__row">
            {row.map((point, index) => (
                <StonePoint key={index} point={point} />
            ))}
        </div>
    )
}

/**
 * 如何检查是否有五子相连？
 * 1.筛选出所有下了棋子的点
 * 2.从左上到右下，依次检查右方、下方、右下方是否有五子相连
 *   1.如果有相连，返回结果
 *   2.否则，重复直至到达最后一个棋子，返回结果
 *
 * 检查的具体实现？
 * 1.取出对应方向的五个子
 * 2.如果不足五个子，未相连
 * 3.如果有五个子
 *   1.如果五个字颜色全部相同，有相连
 *   2.否则，无相连
 *
 */

function checkIfStonesLinked(points: Point[]): Winner {
    const noWinner = { hasWinner: false } as Winner
    if (points.length !== 5) {
        return noWinner
    }

    const players = ["white", "black"]
    return players.reduce((res, player) => {
        if (points.every((point) => point.stoneType === player)) {
            return { hasWinner: true, winner: player } as Winner
        }
        return res
    }, noWinner)
}

type GetPoints = (startPos: [number, number], points: Point[][]) => Point[]

const getPointsOnX: GetPoints = (startPos, points) => {
    const [x, y] = startPos
    return points.slice(x, x + 5).map((row) => row[y])
}

const getPointsOnY: GetPoints = (startPos, points) => {
    const [x, y] = startPos
    return points[x].slice(y, y + 5)
}

const getPointsOnXY: GetPoints = (startPos, points) => {
    const [x, y] = startPos
    let res = []
    let i = 0
    while (points[x + i] && i < 5) {
        res.push(points[x][y])
        i++
    }
    return res
}

const checkIfStonesLinkedOnX = _.flow(getPointsOnX, checkIfStonesLinked)
const checkIfStonesLinkedOnY = _.flow(getPointsOnY, checkIfStonesLinked)
const checkIfStonesLinkedOnXY = _.flow(getPointsOnXY, checkIfStonesLinked)
