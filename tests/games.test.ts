import app from "../src/app";
import { faker } from '@faker-js/faker';
import prisma from "../src/config/database"
import httpStatus from "http-status";
import supertest from "supertest";
import { createGame, createManyJogos, generateValidConsoleId } from "./factories/games.factories";
import { ConsoleInput } from "services/consoles-service";




beforeAll(async () => {
    await prisma.game.deleteMany({});
    await prisma.console.deleteMany({});
});

beforeEach(async () => {
    await prisma.game.deleteMany({});
    await prisma.console.deleteMany({});
});

const server = supertest(app);

describe("GET /games", () =>{
    it("should status 200, and games from table games",async () => {
        const console = await generateValidConsoleId()
        await createManyJogos(console.id);

        const response = await server.get("/games")

        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).toEqual( expect.arrayContaining([
            expect.objectContaining({
                id:expect.any(Number),
                title:expect.any(String),
                consoleId: expect.any(Number)
            })
        ]))
    })
})

describe("GET /games/:id", ()=>{
    it("should status 404 than id params not valid",async () => {
        const response = await server.get("/games/0")

        expect(response.status).toBe(httpStatus.NOT_FOUND)
    })

    describe("when id params is valid", () =>{
        it("should 404, but idGame not exist",async () => {
            const response = await server.get("/games/1")

            expect(response.status).toBe(httpStatus.NOT_FOUND)
        })
        it("should 200 when id exists",async () => {
            const console = await generateValidConsoleId();
            const game = await createGame(console.id)

            const response = await server.get(`/games/${game.id}`)

            expect(response.body).toEqual({
                id: game.id,
                title: game.title,
                consoleId: game.consoleId
            })
        })
    })
})


describe("POST /console", ()=>{
    it("should status 422 when body is invalid",async () => {
        const response = await server.post(`/consoles`).send({})

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })

    describe("when body is valid",() => {
        it("shold status 409, when name of console already exist",async () => {
            const console = await generateValidConsoleId()

            const response = await server.post(`/consoles`).send({name: console.name})
    
            expect(response.status).toBe(httpStatus.CONFLICT)
        })

        it("should status 201, when body is valid and not exist equal name on table consoles",async () => {
            const console:ConsoleInput ={
                name: faker.animal.bird()
            }
            const response = await server.post(`/consoles`).send(console)

            expect(response.status).toBe(httpStatus.CREATED)
        })
    })
})
