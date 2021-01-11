import "./Stone.css"

type Props = {
    type?: "white" | "black"
}

export default function Stone({ type }: Props) {
    return <div className={`stone ${type ? "stone-color--" + type : ""}`}></div>
}
