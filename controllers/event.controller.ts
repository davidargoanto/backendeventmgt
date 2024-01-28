import express, {Request, Response}from "express"
import { PrismaClient } from "@prisma/client";
import { title } from "process";
import { connect } from "http2";

const prisma = new PrismaClient()


export async function createEvent( req : Request, res : Response){
    try{
        const {userID, title, availableseats, price, description, location, datetime} = req.body
        const finduser = await prisma.user.findFirst({
            where : {id : userID}
        })

        if (!finduser ){
            console.log("user found")
            return res.status(400).send({
                message : "User does not exist",
                data : {}
                
            })
        }
        console.log(userID)

        const createEvents = await prisma.event.create({
            data :{
                title : title,
                description : description,
                location : location,
                datetime : datetime,
                availableseats :  availableseats,
                price : price,
                organizer: {
                    connect: { id: userID },
                  }

            }
        })

        const updateUser = await prisma.user.update({
            where :{id : userID},
            data :{
                eventcreate :{
                    connect :[{ id : createEvents.id}]
                }
            },
            include :{
                eventcreate : true,
                transaction : true
            }
        })
        return res.status(200).send({
            message : "OK",
            data : createEvents,
            data1 : updateUser

        })   

    }
    catch(error){
        console.log(error)
        return res.status(500).send({
            message :JSON.stringify(error),
            data :req.body
        })

    }

}


export async function getEvent(req : Request, res : Response){
    try{
        const getEventData = await prisma.event.findMany()
        return res.status(200).send({
            message : "OK",
            data : getEventData
        })
    }
    catch (error){
        return res.status(500).send({
            message : JSON.stringify(error),
            data : "error getting data"
        })
    }
}
export async function getOneEvent(req : Request, res : Response){
    try{
        const date = new Date()
        const day = date.getDate()
        const month = date.getMonth() +1
        const year = date.getFullYear() 
        const ym = year.toString() + "/" +month.toString()
        const ymd = ym + "/"+ day.toString()
        const {eventid, userID} = req.body

        console.log(req.body)
        const getEventData = await prisma.event.findUnique({
            where:{
                id :   eventid
            }
        })
        const findCtr = await prisma.cTR.findFirst({
            where:{
                eventid : eventid,
                ymd : ymd,
                yearmonth : ym,
                year : year.toString()
            }
        })
        if(!findCtr){
            const createCTR = await prisma.cTR.create({
                data :{
                    clicks : 1,
                    year : year.toString(),
                    yearmonth : ym,
                    ymd : ymd,
                    event :{ 
                        connect : {id : eventid},
                    }
                }
            })
            const updateEvent = await prisma.event.update({
                where : {id : eventid},
                data : {
                    ctr :{
                        connect :[{id : createCTR.id}]
                    }
                },
                include :{
                    ctr :true
                }
            })

        }else{
            const updateCtr = await prisma.cTR.update({
                where :{
                    id : findCtr.id,
                },
                data :{
                    clicks : findCtr.clicks + 1

                }
            })
            const updateEvent = await prisma.event.update({
                where : {id : eventid},
                data : {
                    ctr :{
                        connect :[{id : updateCtr.id}]
                    }
                },
                include :{
                    ctr :true
                }
            })

        }
        
        return res.status(200).send({
            message : "OK",
            event: getEventData
        })
    }
    catch (error){
        return res.status(500).send({
            message : JSON.stringify(error),
            data : "error getting data"
        })
    }
}export async function getmyevent(req : Request, res : Response){
    try{
        const {userID} = req.body
        const getmyevents = await prisma.event.findMany({
            where: { organizerId : userID
            },
            include :{
                ctr : true
            }
        })
        return res.status(200).send({
            message : "ok",
            data : getmyevents
        })
    }catch(error){
        return res.status(500).send({
            message : JSON.stringify(error),
            data : "error getting data"
        })

    }
}