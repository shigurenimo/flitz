import { rpcHandler } from "@blitzjs/rpc"
import { api } from "interface/blitz-server"

export default api(rpcHandler({ onError: console.log }))
