import { IId, IMongoId } from '../types/Base';
import ApiEntity from '../common/ApiEntity';

interface IBaseTeamShort {
  name: string;
  crestUrl: string;
}

export type ITeamShort = IBaseTeamShort & IId<number> & IMongoId;

export class TeamShort extends ApiEntity implements ITeamShort {
  name: string;

  crestUrl: string;

  constructor(props: ITeamShort) {
    super(props.id, props._id);
    this.name = props.name;
    this.crestUrl = props.crestUrl;
  }

  equals(team: ITeamShort): boolean {
    return this.id === team.id && this.name === team.name;
  }
}
