import nats, {Stan} from 'node-nats-streaming'

class NatsWrapper {
    private _client?: Stan;

    get client() {
        if (!this._client) throw new Error("Cant get NATS client before connection")
        
        return this._client;
    }

    connect(cluserId: string, clientId: string, url: string) {
        this._client = nats.connect(cluserId, clientId, {url});

        return new Promise ((resolve, reject) => {
            this.client.on('connect', () => {
                console.log("connected to nats")
                resolve('connected')
            });
            this.client.on('error', (err) => reject(err))

        });
    }
}

export const natsWrapper = new NatsWrapper();