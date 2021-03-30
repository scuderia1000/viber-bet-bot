import { ObjectId } from 'mongodb';
import { IService } from '../common/IService';
import { IMatch, Match } from './Match';
import AbstractService from '../common/AbstractService';
import { ICompetitionListeners, MatchTeamType } from '../../types/base';
import { IMatchDao } from './MatchDao';
import { ICommonDao } from '../common/ICommonDao';
import { ICompetition } from '../competitions/Competition';
import { ICompetitionService } from '../competitions/CompetitionService';
import { MatchStatus } from '../types/Base';
import { ISeasonService } from '../seasons/SeasonService';
import { ITeamShort, TeamShort } from '../teams/TeamShort';
import { ITeamService } from '../teams/TeamService';
import { API, getFinalPartOfLeagueIndex, LeagueCodes, LeagueCodesStageMapper, Stages } from '../../const';

type PagedMatches = { matches: IMatch[]; totalMatchesCount: number };

export interface IMatchService extends IService<IMatch> {
  getScheduledMatches(competitionCode: LeagueCodes): Promise<IMatch[]>;
  getMatchTeamByType(matchId: ObjectId, matchTeamType: MatchTeamType): Promise<ITeamShort | null>;
  isMatchBegan(matchId: ObjectId): Promise<boolean>;
  getMatchesByIds(matchIds: ObjectId[]): Promise<IMatch[]>;
  getMatchesBySeasonAndStage(seasonMongoId: ObjectId, stage: Stages): Promise<IMatch[]>;
  getMatchesIdsByMatchday(matchday: number, competitionCode?: string): Promise<ObjectId[]>;
  getPagedScheduledMatches(competitionCode: LeagueCodes, pageNumber: number): Promise<PagedMatches>;
  isFinalPart(leagueCode: LeagueCodes, matchStage: Stages): boolean;
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

  async update(competitionWithMatches: ICompetition): Promise<void> {
    if (!competitionWithMatches || !competitionWithMatches.matches) return;

    const currentSeason = await this.seasonService.getById(
      competitionWithMatches.matches[0].season.id,
    );
    if (!currentSeason) return;

    const allTeams = await this.teamService.getAllTeamsShort();
    const matches = competitionWithMatches.matches.map(
      (match) =>
        new Match({
          ...match,
          season: currentSeason,
          homeTeam: allTeams[match.homeTeam.id] ?? new TeamShort(match.homeTeam),
          awayTeam: allTeams[match.awayTeam.id] ?? new TeamShort(match.awayTeam),
        }),
    );
    const existMatches = await this.dao.matchesBySeasonId(currentSeason.id);
    await this.updateEntities(existMatches, matches);
  }

  async getScheduledMatches(competitionCode = LeagueCodes.CL): Promise<IMatch[]> {
    const competition = await this.competitionService.getCompetitionByCode(competitionCode);
    if (!competition || !competition.currentSeason._id) return Promise.resolve([]);

    const matches = await this.dao.seasonMatchesByStatus(
      competition.currentSeason._id,
      MatchStatus.SCHEDULED,
    );
    return matches;
  }

  async getPagedScheduledMatches(
    competitionCode = LeagueCodes.CL,
    pageNumber = 0,
  ): Promise<PagedMatches> {
    const emptyResult = {
      matches: [],
      totalMatchesCount: 0,
    };
    const competition = await this.competitionService.getCompetitionByCode(competitionCode);
    if (!competition || !competition.currentSeason._id) return emptyResult;

    const allScheduledMatchesCount = await this.dao.seasonMatchesByStatusCount(
      competition.currentSeason._id,
      MatchStatus.SCHEDULED,
    );

    const matches = await this.dao.seasonMatchesByStatusPaged(
      competition.currentSeason._id,
      MatchStatus.SCHEDULED,
      pageNumber,
    );

    return {
      matches,
      totalMatchesCount: allScheduledMatchesCount,
    };
  }

  async getMatchTeamByType(
    matchId: ObjectId,
    matchTeamType: MatchTeamType,
  ): Promise<ITeamShort | null> {
    const teamShort = await this.dao.matchTeamByType(matchId, matchTeamType);
    let team = null;
    if (teamShort) {
      team = await this.teamService.getByMongoId(teamShort._id);
    }
    return team;
  }

  async isMatchBegan(matchId: ObjectId): Promise<boolean> {
    const match = await this.dao.getByMongoId(matchId);
    if (!match) return true;
    const nowDateMS = new Date().getTime();
    const matchDateMS = new Date(match.utcDate).getTime();
    return nowDateMS > matchDateMS;
  }

  getMatchesByIds(matchIds: ObjectId[]): Promise<IMatch[]> {
    return this.getAllByIds(matchIds);
  }

  getMatchesBySeasonAndStage(seasonMongoId: ObjectId, stage: Stages): Promise<IMatch[]> {
    return this.dao.matchesBySeasonAndStage(seasonMongoId, stage);
  }

  async getMatchesIdsByMatchday(matchday: number, competitionCode?: string): Promise<ObjectId[]> {
    const competition = await this.competitionService.getCompetitionByCode(competitionCode);
    if (!competition) return Promise.reject();

    const stage = API.FOOTBALL_DATA_ORG.CHAMPIONS_LEAGUE.AVAILABLE_STAGES[matchday];
    const currentSeasonId = competition.currentSeason._id;
    const matches = await this.getMatchesBySeasonAndStage(currentSeasonId, stage);
    return matches.map((match) => match._id);
  }

  // eslint-disable-next-line class-methods-use-this
  isFinalPart(leagueCode: LeagueCodes, matchStage: Stages): boolean {
    const leagueStages = LeagueCodesStageMapper[leagueCode];
    const stageIndex = Object.values(leagueStages).indexOf(matchStage);
    const leagueFinalPartIndex = getFinalPartOfLeagueIndex(leagueCode);
    return stageIndex >= leagueFinalPartIndex;
  }
}
