import { IConfigSource } from "src/interfaces/IConfigSource";

export class EnvConfigSource implements IConfigSource {
    get(key: string): string {
        return process.env[key]
    }
}