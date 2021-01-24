import { DateTimeISOString, IApiId, IMongoIdNum, IObject, PlayerRole } from '../types/Base';
import Mongo from '../types/Mongo';

interface IBasePlayer {
  name: string;
  position: string;
  dateOfBirth: DateTimeISOString;
  countryOfBirth: string;
  nationality: string;
  shirtNumber: number | null;
  role: PlayerRole;
}

export type IPlayer = IBasePlayer & IMongoIdNum & IObject;
export type IApiPlayer = IBasePlayer & IApiId;

export class Player extends Mongo implements IPlayer {
  countryOfBirth: string;

  dateOfBirth: DateTimeISOString;

  name: string;

  nationality: string;

  position: string;

  role: PlayerRole;

  shirtNumber: number | null;

  constructor(props: IPlayer | IApiPlayer) {
    super(props);
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
      this._id === player._id &&
      this.name === player.name &&
      this.position === player.position &&
      this.role === player.role &&
      this.shirtNumber === player.shirtNumber
    );
  }
}
