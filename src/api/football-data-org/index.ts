import { API } from '../../const';
import { ICompetition } from '../../domain/competitions/Competition';
import { ITeam } from '../../domain/teams/Team';
import { IMatch } from '../../domain/matches/Match';
import { options, sendRequest } from '../index';
import logger from '../../util/logger';

const prefix = API.FOOTBALL_DATA_ORG.PREFIX;
// List one particular competition.
const competitions = API.FOOTBALL_DATA_ORG.COMPETITIONS;
const matches = API.FOOTBALL_DATA_ORG.MATCHES;
const teams = API.FOOTBALL_DATA_ORG.TEAMS;

export interface ICompetitionWithMatches {
  competition: Pick<ICompetition, 'id' | 'area' | 'name' | 'code'>;
  matches: IMatch[];
}

export interface IFootballDataOrgApi {
  getCompetition(code: string): Promise<ICompetition>;
  getCompetitionMatches(code: string): Promise<ICompetitionWithMatches>;
  getCompetitionTeams(code: string): Promise<ITeam>;
}

const getApiFootballDataOrg = (): IFootballDataOrgApi => {
  const requestOptions = options(
    API.FOOTBALL_DATA_ORG.URL,
    process.env.X_AUTH_TOKEN_API_FOOTBALL_DATA,
  );

  const getCompetition = async (code: string): Promise<ICompetition> => {
    const responseData = await sendRequest(
      requestOptions.get(`/${prefix}/${competitions}/${code}/`),
    );
    return responseData;
  };

  const getCompetitionMatches = async (code: string): Promise<ICompetitionWithMatches> => {
    const responseData = await sendRequest(
      requestOptions.get(`/${prefix}/${competitions}/${code}/${matches}/`),
    );
    return responseData;
  };

  const getCompetitionTeams = async (code: string): Promise<ITeam> => {
    const responseData = await sendRequest(
      requestOptions.get(`/${prefix}/${competitions}/${code}/${teams}/`),
    );
    return responseData;
  };

  return {
    getCompetition,
    getCompetitionMatches,
    getCompetitionTeams,
  };
};

export default getApiFootballDataOrg;
