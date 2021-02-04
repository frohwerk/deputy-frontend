import { Injectable } from "@angular/core";
import { EMPTY, Observable, Subject } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { WatchEvent } from "../watch/types";
import { Artifact } from "./artifact";

@Injectable()
export class ArtifactService {

    watch(): Observable<WatchEvent<Artifact>> {
        return fromFetch('/api/apps/example/artifacts', {
            selector: response => {
                console.log('Response incoming:', response.status, response.statusText);
                const reader = response.body?.getReader();
                if (!reader) return EMPTY; // TODO: subject.error({message: '...'});
                const subject = new Subject<WatchEvent<Artifact>>();
                // Asynchronous iteration over all chunks received by the server
                console.log('submitting read loop...');
                const taskid = setTimeout(this.createReadLoop(reader, subject), 0);
                console.log('returning observable...');
                return new Observable(observer => subject.subscribe(observer)
                    .add(() => console.log('And now my watch has ended'))
                    .add(() => clearTimeout(taskid))
                );
            }
        });
    }

    private createReadLoop(reader: ReadableStreamDefaultReader<Uint8Array>, subject: Subject<WatchEvent<Artifact>>) {
        return async () => {
            console.log('starting read loop...');
            try {
                const decoder = new TextDecoder('utf-8');
                // TODO: Make cancelable with Promise.race. Second promise is fulfilled by a cancelation request
                for (let result = await reader.read(); !result.done; result = await reader.read()) {
                    console.log('received async reading result...');
                    const chunk = decoder.decode(result.value);
                    if (chunk?.length == 0) continue;
                    for (const line of chunk.split(/\r?\n/).filter(line => line?.length > 0)) {
                        console.log('received line:\n', line);
                        const event = JSON.parse(line);
                        subject.next(event);
                    }
                }
            } catch (err) {
                // TODO: How to accept canceled reads but nothing else...
                console.log(`error in read loop`, err);
                subject.error(err);
            }
            subject.complete();
            console.log('read loop complete!');
        };
    }

}
