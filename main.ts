import express, {Application, Request, Response} from "express"
import authRouter from "./routers/auth.router"
import PRouter from "./routers/product.router"
import cors from "cors"
import eventRouter from "./routers/event.router"
import TRouter from "./routers/transaction.router"
import ProRouter from "./routers/profile.router"
import ctrRouter from "./routers/ctr.router"
import { scheduleTask } from "./cron/schedule"
const app : Application = express ()

const PORT : number = 5670

app.use(cors())
app.use(express.urlencoded({extended :false}))
app.use(express.json())

scheduleTask()

app.use("/api/auth", authRouter)
app.use("/api/event", eventRouter)
app.use("/api/product", PRouter)
app.use("/api/transaction", TRouter)
app.use("/api/profile", ProRouter)
app.use("/api/ctr", ctrRouter)

app.get("/api/", (req : Request, res : Response)=> {
    return res.status(200).send({
        message: "ok",
        data: "hello world"
    })
})
app.listen(PORT, ()=>{
    console.log("app run on port ", PORT)
})