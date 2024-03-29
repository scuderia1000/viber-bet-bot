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
import {
  API,
  ChampionsLeagueStages,
  ChampionsLeagueStagesMatchdays,
  LeagueCodes,
  LeagueCodesStageMapper,
  Stages,
} from '../../const';
import logger from '../../util/logger';
import { getFinalPartOfLeagueIndex, getPrevStage } from '../../util';

type PagedMatches = { matches: IMatch[]; totalMatchesCount: number };

export interface IUsersPredictionsResults {
  name: string;
  score: number;
}

export interface IMatchService extends IService<IMatch> {
  getScheduledMatches(competitionCode: LeagueCodes): Promise<IMatch[]>;
  getMatchTeamByType(matchId: ObjectId, matchTeamType: MatchTeamType): Promise<ITeamShort | null>;
  isMatchBegan(matchId: ObjectId): Promise<boolean>;
  getMatchesByIds(matchIds: ObjectId[]): Promise<IMatch[]>;
  getMatchesBySeasonAndStage(
    seasonMongoId: ObjectId,
    stage: ChampionsLeagueStages,
    statuses?: MatchStatus[],
  ): Promise<IMatch[]>;
  getMatchesIdsByMatchday(matchday: number, competitionCode?: string): Promise<ObjectId[]>;
  getPagedMatchesByStatuses(
    competitionCode: LeagueCodes,
    pageNumber: number,
    statuses: MatchStatus[],
  ): Promise<PagedMatches>;
  isFinalPart(leagueCode: LeagueCodes, matchStage: Stages): boolean;
  getCurrentStage(leagueCode?: LeagueCodes): Promise<Stages>;
  getCurrentMatchday(leagueCode?: LeagueCodes): Promise<number>;
  getCurrentSeasonMatchesIdsByStage(competitionCode: LeagueCodes): Promise<ObjectId[]>;
  prevStageMatchIds(competitionCode: LeagueCodes): Promise<ObjectId[]>;
  allUsersResultPrevStage(competitionCode: LeagueCodes): Promise<IUsersPredictionsResults[]>;
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
    if (!competition || !competition.currentSeason.id) return Promise.resolve([]);

    const currentSeason = await this.seasonService.getById(competition.currentSeason.id);
    if (!currentSeason) return Promise.resolve([]);

    const matches = await this.dao.seasonMatchesByStatus(currentSeason._id, MatchStatus.SCHEDULED);
    return matches;
  }

  async getPagedMatchesByStatuses(
    competitionCode = LeagueCodes.CL,
    pageNumber = 0,
    statuses: MatchStatus[],
  ): Promise<PagedMatches> {
    const emptyResult = {
      matches: [],
      totalMatchesCount: 0,
    };
    const competition = await this.competitionService.getCompetitionByCode(competitionCode);
    if (!competition || !competition.currentSeason.id) return emptyResult;

    const currentSeason = await this.seasonService.getById(competition.currentSeason.id);
    if (!currentSeason) return emptyResult;

    const stage = await this.getCurrentStage();
    if (!stage) return emptyResult;

    // TODO разобраться, за что еще отвечает currentMatchday в api football
    //  узнать, может быть значение 0 или нет
    const currentMatchday = await this.getCurrentMatchday(competitionCode);
    if (!currentMatchday) return emptyResult;

    const allScheduledMatchesCount = await this.dao.matchesByStatusCount(
      currentSeason._id,
      statuses,
      currentMatchday,
      stage,
    );
    const matches = await this.dao.matchesByStatusPaged(
      currentSeason._id,
      statuses,
      currentMatchday,
      stage,
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

  getMatchesBySeasonAndStage(
    seasonMongoId: ObjectId,
    stage: Stages,
    statuses?: MatchStatus[],
  ): Promise<IMatch[]> {
    return this.dao.matchesBySeasonAndStage(seasonMongoId, stage, statuses);
  }

  // Deprecated
  async getMatchesIdsByMatchday(matchday: number, competitionCode?: string): Promise<ObjectId[]> {
    const competition = await this.competitionService.getCompetitionByCode(competitionCode);
    if (!competition) return Promise.reject();

    const currentSeason = await this.seasonService.getById(competition.currentSeason.id);
    if (!currentSeason) return Promise.reject();

    const stage = API.FOOTBALL_DATA_ORG.CHAMPIONS_LEAGUE.AVAILABLE_STAGES[matchday];
    const currentSeasonId = currentSeason._id;
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

  async getCurrentStage(competitionCode = LeagueCodes.CL): Promise<Stages> {
    const competition = await this.competitionService.getCompetitionByCode(competitionCode);
    if (!competition) return ChampionsLeagueStages.NONE;

    const currentSeason = await this.seasonService.getById(competition.currentSeason.id);
    if (!currentSeason) return ChampionsLeagueStages.NONE;

    let matches: IMatch[] = await this.dao.seasonMatchesByStatus(
      currentSeason._id,
      MatchStatus.SCHEDULED,
    );

    let nearestMatch = matches?.[0];
    if (!nearestMatch) {
      matches = await this.dao.seasonMatchesByStatus(currentSeason._id, MatchStatus.FINISHED);
      nearestMatch = matches?.[matches.length - 1];
    }
    logger.debug('Current stage: %s', nearestMatch?.stage);

    if (!nearestMatch) {
      return ChampionsLeagueStages.NONE;
    }
    return nearestMatch?.stage;
  }

  async getCurrentSeasonMatchesIdsByStage(competitionCode = LeagueCodes.CL): Promise<ObjectId[]> {
    const competition = await this.competitionService.getCompetitionByCode(competitionCode);
    if (!competition) return Promise.reject();

    const currentSeason = await this.seasonService.getById(competition.currentSeason.id);
    if (!currentSeason) return Promise.reject();

    const stage = await this.getCurrentStage(competitionCode);
    const currentSeasonId = currentSeason._id;
    const matches = await this.getMatchesBySeasonAndStage(currentSeasonId, stage);
    return matches.map((match) => match._id);
  }

  async prevStageMatchIds(competitionCode = LeagueCodes.CL): Promise<ObjectId[]> {
    const competition = await this.competitionService.getCompetitionByCode(competitionCode);
    if (!competition) return Promise.reject();

    const currentSeason = await this.seasonService.getById(competition.currentSeason.id);
    if (!currentSeason) return Promise.reject();

    const stage = await this.getCurrentStage(competitionCode);
    let currentMatchday = await this.getCurrentMatchday(competitionCode);
    const allScheduledMatchesCount = await this.dao.matchesByStatusCount(
      currentSeason._id,
      [MatchStatus.SCHEDULED],
      currentMatchday,
      stage,
    );
    // Если есть запланированные матчи, то этап тура еще не закончился, уменьшаем этап на 1
    if (currentMatchday > 1 && allScheduledMatchesCount) {
      currentMatchday -= 1;
    }
    const matches = await this.dao.matchesByStatusPaged(
      currentSeason._id,
      [MatchStatus.FINISHED],
      currentMatchday,
      stage,
    );
    logger.debug('prevStageMatchIds currentMatchday: %s', currentMatchday);
    return matches?.map((match) => match._id);
  }

  async getCurrentMatchday(competitionCode = LeagueCodes.CL): Promise<number> {
    const competition = await this.competitionService.getCompetitionByCode(competitionCode);
    if (!competition || !competition.currentSeason.id) return 0;

    const currentSeason = await this.seasonService.getById(competition.currentSeason.id);
    if (!currentSeason) return 0;

    return currentSeason.currentMatchday;
  }

  async allUsersResultPrevStage(
    competitionCode = LeagueCodes.CL,
  ): Promise<IUsersPredictionsResults[]> {
    let result: IUsersPredictionsResults[] = [];
    const competition = await this.competitionService.getCompetitionByCode(competitionCode);
    if (!competition) return result;

    const currentSeason = await this.seasonService.getById(competition.currentSeason.id);
    if (!currentSeason) return result;

    let stage = await this.getCurrentStage(competitionCode);
    if (stage === ChampionsLeagueStages.NONE) return result;

    let matchday = await this.getCurrentMatchday(competitionCode);
    if (!matchday) return result;

    const allScheduledMatchesCount = await this.dao.matchesByStatusCount(
      currentSeason._id,
      [MatchStatus.SCHEDULED],
      matchday,
      stage,
    );

    // тур еще не закончен, показываем результаты пред. тура
    if (allScheduledMatchesCount) {
      const stageMatchDaysInterval = ChampionsLeagueStagesMatchdays[stage];
      // если сейчас начало нового этапа турнира, берем предыдущий этап
      if (matchday === stageMatchDaysInterval?.min) {
        stage = getPrevStage(competitionCode, stage);
      }
      matchday -= 1;
    }
    result = await this.dao.allUsersResultByStage(stage, matchday);

    return result;
  }

  private async lastMatchDayOfStage(seasonMongoId: ObjectId, stage: Stages): Promise<number> {
    const finishedMatches = await this.getMatchesBySeasonAndStage(seasonMongoId, stage, [
      MatchStatus.FINISHED,
    ]);
    if (!finishedMatches || !finishedMatches.length || !finishedMatches[0].matchday) return 0;

    console.log('finishedMatches[0]', finishedMatches[0]);
    return finishedMatches[0].matchday;
  }
}
