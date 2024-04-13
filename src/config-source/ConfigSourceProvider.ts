import { EnvConfigSource } from 'src/implementations/ConfigSource/Env';
import { IConfigSource } from '../interfaces/IConfigSource';


export class ConfigSourceProvider implements IConfigSource {
    private configSource: IConfigSource = new EnvConfigSource();

    public static instance = new ConfigSourceProvider()
    
    get(key: string): string {
        return this.configSource.get(key)
    }

}
