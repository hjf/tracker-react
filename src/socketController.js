import socketIOClient from "socket.io-client";
const ENDPOINT = "/";

export default class SocketController {
  constructor() {
    this.socket = socketIOClient(ENDPOINT);
    this.subscribers = {
      log: [],
      new_schedules: [],
      tracker: []
    };

    Object.keys(this.subscribers).forEach(
      topic => {
        this.socket.on(topic, data => {
          if (this.subscribers[topic])
            this.subscribers[topic].forEach(x => { x(data) })
          else
            console.warn(`Warning: got event ${topic}, which is not recognized`)
        });
      }
    )
  }

  subscribe(subscriber, topic) {
    this.subscribers[topic].push(subscriber)
  }
  unsubscribe(subscriber, topic) {
    let idx = this.subscribers[topic].indexOf(subscriber)
    if (idx > -1) {
      this.subscribers[topic].splice(idx, 1)
    } else {
      console.warn(`Warning: called unsub but object did not exist`)
    }

  }
}