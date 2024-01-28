import cron from "node-cron"
import express, {Response, Request} from "express";
import { PrismaClient } from "@prisma/client";

export const scheduleTask = ( ) =>{
    const prisma = new PrismaClient()
    cron.schedule('* * * * * *', async() => {
        const date = new Date()
        const expiredUsers = await prisma.user.findMany({
            where: {
              pointsexp: {
                lt: date,
              },
            },
          });
          
          const exp =await prisma.user.updateMany({
            where: {
              id: {
                in: expiredUsers.map(user => user.id),
              },
            },
            data: {
              points: 0,
            },
          });
          const expiredUsersDisc = await prisma.user.findMany({
            where: {
              discexp: {
                lt: date,
              },
            },
          });
          
          const expdisc =await prisma.user.updateMany({
            where: {
              id: {
                in: expiredUsersDisc.map(user => user.id),
              },
            },
            data: {
              discount: 0,
            },
          });
          console.log(date)
          
    })

}