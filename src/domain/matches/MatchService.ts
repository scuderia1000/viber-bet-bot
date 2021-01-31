import { IService } from '../common/IService';
import { IMatch } from './Match';
import AbstractService from '../common/AbstractService';
import { ICompetitionListeners } from '../../types/base';
import { IMatchDao } from './MatchDao';
import { ICommonDao } from '../common/ICommonDao';
import { ICompetition } from '../competitions/Competition';

export type IMatchService = IService<IMatch>;

export class MatchService
  extends AbstractService<IMatch>
  implements IMatchService, ICompetitionListeners {
  private readonly dao: IMatchDao;

  constructor(dao: IMatchDao) {
    super();
    this.dao = dao;
  }

  getDao(): ICommonDao<IMatch> {
    return this.dao;
  }

  async update(competition: ICompetition): Promise<void> {
    const { matches, currentSeason } = competition;

    if (!matches) return;

    const newMatches: IMatch[] = [];
    const updateMatches: IMatch[] = [];
    const existMatches = await this.dao.getMatchesBySeasonId(currentSeason?.id);
    const existMatchesIds = Object.keys(existMatches);
    if (existMatchesIds.length) {
      matches.forEach((match) => {
        if (!match.id) return;

        if (existMatches[match.id]) {
          if (!match.equals(existMatches[match.id])) {
            // Заменяем _id на существующий в базе, т.к. при создании объекта из api создается новый _id (в api нет этого поля)
            // eslint-disable-next-line no-param-reassign
            match._id = existMatches[match.id]._id;
            updateMatches.push(match);
          }
        } else {
          newMatches.push(match);
        }
      });
      if (updateMatches.length) await this.replaceMany(updateMatches);
      if (newMatches.length) await this.insertMany(newMatches);
    } else {
      await this.insertMany(matches);
    }
  }
}
