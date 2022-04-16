import { readFileSync } from 'fs';
import { join } from 'path';

const config = {
     getPrivateKey(): Buffer {
        return  readFileSync(join(process.cwd(), 'src/keys/private.pem'));
      },
     getPublicKey(): Buffer {
        return readFileSync(join(process.cwd(), 'src/keys/public.pem'));
    }
}

export default config;