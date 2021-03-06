import { IId, IMongoId } from '../types/Base';
import ApiEntity from '../common/ApiEntity';

interface IBaseTeamShort {
  name: string;
  /**
   * Герб в формате svg
   */
  crestUrl: string;
  /**
   * Герб в формате png
   */
  crestImageUrl: string;
}

export type ITeamShort = IBaseTeamShort & IId<number> & IMongoId;

export class TeamShort extends ApiEntity implements ITeamShort {
  name: string;

  crestUrl: string;

  crestImageUrl: string;

  constructor(props: ITeamShort) {
    super(props.id, props._id);
    this.name = props.name;
    this.crestUrl = props.crestUrl;
    this.crestImageUrl = props.crestImageUrl;
  }

  equals(team: ITeamShort): boolean {
    return (
      this.id === team.id && this.name === team.name && this.crestImageUrl === team.crestImageUrl
    );
  }
}
