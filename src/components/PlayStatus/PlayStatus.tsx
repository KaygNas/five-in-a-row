import Stone from "../Stone/Stone"
import "./PlayStatus.css"
import { Winner } from "../GoBoard/GoBoard"

type Props = {
    currentPlayer: "white" | "black"
    winner?: Winner
}

export default function PlayStatus({ currentPlayer, winner }: Props) {
    return (
        <div className="play-status-wrapper">
            {!winner?.hasWinner ? (
                <div className="play-status__current">
                    等待
                    <span className="play-status__player">
                        <Stone type={currentPlayer}></Stone>
                    </span>
                    下子
                </div>
            ) : (
                <div className="play-status__winner">
                    🎉🎉
                    <span className="play-status__player">
                        <Stone type={winner.winner}></Stone>
                    </span>
                    赢了！
                </div>
            )}
        </div>
    )
}
