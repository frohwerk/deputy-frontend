import { Pipe, PipeTransform } from '@angular/core';
import { Artifact } from 'src/app/model/artifact';

@Pipe({
  name: 'unassigned'
})
export class UnassignedPipe implements PipeTransform {

  transform(artifacts: Artifact[]): Artifact[] {
    console.log(`UnassignedPipe: ${artifacts.length}`);
    // TODO: Implement actual filtering
    return artifacts.filter(a => {
      console.log(JSON.stringify(a))
      // return a.name != 'ocrproxy';
      // return false;
      return true;
    });
  }

}
