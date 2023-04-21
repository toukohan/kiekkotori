import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    // if we already have a client, return it
    if (this._client) {
      return;
    }

    // create a new client
    this._client = nats.connect(clusterId, clientId, { url });

    // return a promise that resolves when the client connects
    return new Promise<void>((resolve, reject) => {
      // if the client connects, resolve the promise
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      // if the client fails to connect, reject the promise
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();