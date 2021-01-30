import { IId, IMongoId } from '../types/Base';
import ApiEntity from '../common/ApiEntity';

interface IBaseTeamShort {
  name: string;
}

export type ITeamShort = IBaseTeamShort & IId<number> & IMongoId;

export class TeamShort extends ApiEntity implements ITeamShort {
  name: string;

  constructor(props: ITeamShort) {
    super(props._id, props.id);
    this.name = props.name;
  }

  equals(team: ITeamShort): boolean {
    return this.id === team.id && this.name === team.name;
  }
}
