import Entity from './Entity';
import { IId } from '../types/Base';

class ViberEntity extends Entity implements IId<string> {
  id?: string;

  constructor(props: Partial<ViberEntity>) {
    super(props._id);
    this.id = props.id;
  }
}

export default ViberEntity;
