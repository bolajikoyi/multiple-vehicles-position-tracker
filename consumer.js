const {Kafka} = require('kafkajs')
const express = require('express')
const app = express()
const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});
const PORT = 3100

io.on('connection', (socket)=>{
    console.log('Client connected')

    const _consumer = async ()=>{
        const kafka = new Kafka({
            clientId: 'tracker',
            brokers: ['localhost:9092']
        })
        const consumer = kafka.consumer({groupId: 'vehicles'})

        await consumer.connect()
        await consumer.subscribe({topic: 'position-tracker', fromBeginning: false})
        await consumer.run({
            eachMessage: async ({topic, partition, message})=>{
                console.log(message.value.toString())
                socket.emit('vehicle-coordinate', message.value.toString())
            }
        })
    }
    _consumer()

    socket.on('disconnect',()=>{
        console.log('Client disconnected')
    })
})

server.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})