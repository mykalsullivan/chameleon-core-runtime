type EngineMessage =
{
    type: number;
    payloadLen: number;
    payload: Int32Array;
}

export default EngineMessage;