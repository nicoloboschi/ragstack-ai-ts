import {AstraLibArgs} from "@langchain/community/dist/vectorstores/astradb";
import {getRequiredEnv} from "./config";


export interface VectorStoreHandler {

    beforeTest: () => void;
    afterTest: () => void;
    getBaseAstraLibArgs: () => AstraLibArgs;

}


export class AstraDBVectorStoreHandler implements VectorStoreHandler {

    token: string;
    endpoint: string;
    collectionName: string | undefined;
    constructor() {
        this.token = getRequiredEnv("ASTRA_DB_TOKEN")
        this.endpoint = getRequiredEnv("ASTRA_DB_ENDPOINT")
    }

    afterTest(): void {
    }

    beforeTest(): void {
        this.collectionName = "documents_" + Math.random().toString(36).substring(7)
    }


    getBaseAstraLibArgs() {
        const astraConfig: AstraLibArgs = {
            token: this.token,
            endpoint: this.endpoint,
            collection: this.collectionName as string
        };
        return astraConfig
    }





}