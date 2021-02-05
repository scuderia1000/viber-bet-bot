import { IService } from '../common/IService';
import { ITeam, Team } from './Team';
import AbstractService from '../common/AbstractService';
import { ITeamDao } from './TeamDao';
import { ICommonDao } from '../common/ICommonDao';
import { ICompetitionListeners } from '../../types/base';
import { ICompetition } from '../competitions/Competition';

export type ITeamService = IService<ITeam>;

export class TeamService
  extends AbstractService<ITeam>
  implements ITeamService, ICompetitionListeners {
  private readonly dao: ITeamDao;

  constructor(dao: ITeamDao) {
    super();
    this.dao = dao;
  }

  getDao(): ICommonDao<ITeam> {
    return this.dao;
  }

  async getAllTeams(): Promise<Record<number, ITeam>> {
    const teams = await this.getAll();
    if (!teams) return Promise.reject();

    const result: Record<number, ITeam> = {};
    teams.forEach((teamDocument) => {
      const team = new Team(teamDocument);
      if (team && team.id) {
        result[team.id] = team;
      }
    });
    return result;
  }

  async update(competitionTeams: ICompetition): Promise<void> {
    if (!competitionTeams || !competitionTeams.teams) return;

    const teams = competitionTeams.teams.map((competitionTeam) => {
      return new Team(competitionTeam);
    });
    console.log('teams: ', teams);

    const existTeams = await this.getAllTeams();
    await this.updateEntities(existTeams, teams);
  }
}
