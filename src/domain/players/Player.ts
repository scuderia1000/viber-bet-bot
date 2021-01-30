import { DateTimeISOString, IId, IMongoId, PlayerRole } from '../types/Base';
import Collection from '../../annotation/Collection';
import ApiEntity from '../common/ApiEntity';

interface IBasePlayer {
  name: string;
  position: string;
  dateOfBirth: DateTimeISOString;
  countryOfBirth: string;
  nationality: string;
  shirtNumber: number | null;
  role: PlayerRole;
}

export type IPlayer = IBasePlayer & IId<number> & IMongoId;

@Collection('players')
export class Player extends ApiEntity implements IPlayer {
  countryOfBirth: string;

  dateOfBirth: DateTimeISOString;

  name: string;

  nationality: string;

  position: string;

  role: PlayerRole;

  shirtNumber: number | null;

  constructor(props: IPlayer) {
    super(props._id, props.id);
    this.countryOfBirth = props.countryOfBirth;
    this.dateOfBirth = props.dateOfBirth;
    this.name = props.name;
    this.nationality = props.nationality;
    this.position = props.position;
    this.role = props.role;
    this.shirtNumber = props.shirtNumber;
  }

  equals(player: IPlayer): boolean {
    return (
      this.id === player.id &&
      this.name === player.name &&
      this.position === player.position &&
      this.role === player.role &&
      this.shirtNumber === player.shirtNumber
    );
  }
}
