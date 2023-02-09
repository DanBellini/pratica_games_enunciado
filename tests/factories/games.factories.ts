import prisma from "config/database";
import { faker } from '@faker-js/faker';
import { Game } from "@prisma/client";

export function generateValidConsoleId(){
    return prisma.console.create({
        data:{
            name: faker.music.genre()
        }
    })
}
export function createManyJogos(consoleId: number) {
    return prisma.game.createMany({
        data:[{
            consoleId: consoleId,
            title: faker.animal.dog()
        },
        {
            consoleId:consoleId,
            title:faker.animal.dog()
        }]
    });
};

export function createGame(consoleId: number){
    return prisma.game.create({
        data:{
            consoleId:consoleId,
            title:faker.animal.dog()
        }
    })
}

