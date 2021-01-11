import { useReducer, useState } from "react"
import "./App.css"
import GoBoard from "./components/GoBoard/GoBoard"

export type GoBoardSize = {
    name: string
    value: number
}

type GoBoardSizes = {
    readonly [size: string]: GoBoardSize
}

const GOBOARD_SIZES: GoBoardSizes = {
    small: { name: "small", value: 13 },
    large: { name: "large", value: 19 }
}

type StarPointsPos = {
    [type: string]: { x: number; y: number }[]
}
export type stoneRecords = {
    [x: string]: {
        [y: string]: Point
    }
}

export interface Point {
    isWithStone?: boolean
    stoneType?: "white" | "black"
    isStarPoint?: boolean
    x: number
    y: number
}

export const STAR_POINTS_POS: StarPointsPos = {
    small: [
        { x: 3, y: 3 },
        { x: 3, y: 9 },
        { x: 9, y: 3 },
        { x: 9, y: 9 },
        { x: 6, y: 6 }
    ],
    large: [
        { x: 3, y: 3 },
        { x: 3, y: 15 },
        { x: 15, y: 3 },
        { x: 15, y: 15 },
        { x: 9, y: 9 }
    ]
}

function App() {
    const [stoneRecords, dispatch] = useReducer(stoneRecordsReducer, [])
    return (
        <div>
            <GoBoard
                size={GOBOARD_SIZES.small}
                stoneRecords={stoneRecords}
                dispatch={dispatch}
            />
        </div>
    )
}

export type Action = {
    type: string
    payload?: { x: string | number; y: string | number }
}

function stoneRecordsReducer(
    state: stoneRecords,
    action: Action
): stoneRecords {
    if (action.payload && action.payload.x && action.payload.y) {
        const x = action.payload.x
        const y = action.payload.y
        const point = {
            isWithStone: true,
            x,
            y
        } as Point

        const pushInRecordsWith: (stoneType: string) => stoneRecords = (
            stoneType
        ) => {
            return {
                ...state,
                [x]: {
                    ...state[x],
                    [y]: {
                        ...point,
                        stoneType
                    }
                }
            } as stoneRecords
        }

        // 该点已经有子时不做操作
        if (state[x][y]) {
            return state
        }

        // 在对应位置下子
        let newState: stoneRecords
        switch (action.type) {
            case "paly white stone on board":
                newState = pushInRecordsWith("white")
                break
            case "paly black stone on board":
                newState = pushInRecordsWith("black")
                break
            default:
                throw new Error(`action type ${action.type} is unavailable`)
        }

        return newState
    }

    return state
}

export const playWhiteStoneOn: (
    x: number | string,
    y: number | string
) => Action = (x, y) => {
    return {
        type: "paly white stone on board",
        payload: { x, y }
    }
}

export const playBlackStoneOn: (
    x: number | string,
    y: number | string
) => Action = (x, y) => {
    return {
        type: "paly black stone on board",
        payload: { x, y }
    }
}

export default App
