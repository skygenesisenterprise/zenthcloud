import { DurableObject, WorkerEntrypoint } from "zenthcloud:workers";
import * as exports from "./index.js";

class Entrypoint extends WorkerEntrypoint {}

$HANDLERS

export default Entrypoint;
