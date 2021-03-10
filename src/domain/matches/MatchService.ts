import { ObjectId } from 'mongodb';
import { IService } from '../common/IService';
import { IMatch, Match } from './Match';
import AbstractService from '../common/AbstractService';
import { ICompetitionListeners, MatchTeamType, MatchTeamTypeMapper } from '../../types/base';
import { IMatchDao } from './MatchDao';
import { ICommonDao } from '../common/ICommonDao';
import { ICompetition } from '../competitions/Competition';
import { ICompetitionService } from '../competitions/CompetitionService';
import { MatchStatus } from '../types/Base';
import { ISeasonService } from '../seasons/SeasonService';
import { ITeamShort, TeamShort } from '../teams/TeamShort';
import { ITeamService } from '../teams/TeamService';

export interface IMatchService extends IService<IMatch> {
  getScheduledMatches(competitionCode: string): Promise<IMatch[]>;
  getMatchTeamByType(matchId: ObjectId, matchTeamType: MatchTeamType): Promise<ITeamShort | null>;
}

export class MatchService
  extends AbstractService<IMatch>
  implements IMatchService, ICompetitionListeners {
  private readonly dao: IMatchDao;

  private readonly competitionService: ICompetitionService;

  private readonly seasonService: ISeasonService;

  private readonly teamService: ITeamService;

  constructor(
    dao: IMatchDao,
    competitionService: ICompetitionService,
    seasonService: ISeasonService,
    teamService: ITeamService,
  ) {
    super();
    this.dao = dao;
    this.competitionService = competitionService;
    this.seasonService = seasonService;
    this.teamService = teamService;
  }

  getDao(): ICommonDao<IMatch> {
    return this.dao;
  }

  // TODO подумать, как изменить параметр, приходит не объект класса Competition, а просто объект с полями как в Competition
  async update(competitionWithMatches: ICompetition): Promise<void> {
    if (!competitionWithMatches || !competitionWithMatches.matches) return;

    const currentSeason = await this.seasonService.getById(
      competitionWithMatches.matches[0].season.id,
    );

    if (!currentSeason) return;

    const allTeams = await this.teamService.getAllTeamsShort();
    const matches = await Promise.all(
      competitionWithMatches.matches.map(
        async (match) =>
          new Match({
            ...match,
            season: currentSeason,
            homeTeam: allTeams[match.homeTeam.id] ?? new TeamShort(match.homeTeam),
            awayTeam: allTeams[match.awayTeam.id] ?? new TeamShort(match.awayTeam),
          }),
      ),
    );
    const existMatches = await this.dao.getMatchesBySeasonId(currentSeason.id);
    await this.updateEntities(existMatches, matches);
  }

  async getScheduledMatches(competitionCode: string): Promise<IMatch[]> {
    const competition = await this.competitionService.getCompetitionByCode(competitionCode);
    if (!competition || !competition.currentSeason._id) return Promise.resolve([]);

    const matches = await this.dao.getSeasonMatchesByStatus(
      competition.currentSeason._id,
      MatchStatus.SCHEDULED,
    );
    return matches;
  }

  async getMatchTeamByType(
    matchId: ObjectId,
    matchTeamType: MatchTeamType,
  ): Promise<ITeamShort | null> {
    const matchTeamTypeProperty = MatchTeamTypeMapper[matchTeamType];
    const teamShort = await this.dao.getMatchTeamByType(matchId, matchTeamTypeProperty);
    let team = null;
    // eslint-disable-next-line no-prototype-builtins
    if (teamShort) {
      team = await this.teamService.getByMongoId(teamShort._id);
      console.log('getMatchTeamByType team', team);
    }
    return team;
  }
}
