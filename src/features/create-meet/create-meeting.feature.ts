import { Feature } from '@shared/features';

export class CreateMeetingFeature extends Feature {
  execute(dto: string): void {
    console.log(dto);
  }
}
