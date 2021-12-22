const bus1 = require('./data/bus1.json')
const bus2 = require('./data/bus2.json')
const bus3 = require('./data/bus3.json')
const bus4 = require('./data/bus4.json')
const {Kafka} = require('kafkajs')

const main = async (val)=>{
    console.log(val)
    try{
  
      const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['localhost:9092']
      })
  
      const producer = kafka.producer()
  
      await producer.connect()
      await producer.send({
        topic: 'position-tracker',
        messages: [
          { value:  val},
        ],
      })
  
      await producer.disconnect()
    }
      
    catch(e){
      console.log('Something went wrong'+e)
    }
  }

let Arr1 = bus1.features[0].geometry.coordinates;
let Arr2 = bus2.features[0].geometry.coordinates;
let Arr3 = bus3.features[0].geometry.coordinates;
let Arr4 = bus4.features[0].geometry.coordinates;

let index = 0;
setInterval(() => {
    let _max = Math.max(Arr1.length, Arr2.length, Arr3.length, Arr4.length)
    // console.log(_max)
    if (index <= _max){
        for(let i = 1; i<= 4; i++){
            let newData;
            if(i === 1){
                newData = index < Arr1.length ? JSON.stringify([...Arr1[index], 1]): JSON.stringify([...Arr1[Arr1.length - 1], 1])
                main(newData)
            }
            else if(i === 2){
                newData = index < Arr2.length? JSON.stringify([...Arr2[index], 2]): JSON.stringify([...Arr2[Arr2.length - 1], 2])
                main(newData)
            }
            else if(i === 3){
                newData = index < Arr3.length? JSON.stringify([...Arr3[index], 3]): JSON.stringify([...Arr3[Arr3.length - 1], 3])
                main(newData)
            }
            else if(i === 4){
                newData = index < Arr4.length? JSON.stringify([...Arr4[index], 4]): JSON.stringify([...Arr4[Arr4.length - 1], 4])
                main(newData)
            }
        }
    }
    
    
    // Uncomment 👇🏿 if you want an infinite loop
    // if(index == _max-1){
    //     index = 0
    // }
      
      index++
    
}, 400);
