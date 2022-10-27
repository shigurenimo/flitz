import { rpcHandler } from "@blitzjs/rpc"
import { api } from "integrations/blitz-server"

export default api(rpcHandler({ onError: console.log }))
