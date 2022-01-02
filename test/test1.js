const a = require('./appHandler/interface_spawn_process')
let b = new a()

b.spawn("py", ["./akShareSer.py"], 1, "test")
setTimeout(() => {
    console.log(b.map_process_register_pid_port)
}, 5 * 1000);