import { LeagueCodes, LeagueCodesStageMapper, LeagueFinalPartMapper, Stages } from '../const';
import { IUsersPredictionsResults } from '../domain/matches/MatchService';

export const getFinalPartOfLeagueIndex = (code: LeagueCodes): number =>
  Object.values(LeagueCodesStageMapper[code]).indexOf(LeagueFinalPartMapper[code]);

export const getPrevStage = (code: LeagueCodes, matchStage: Stages): Stages => {
  const leagueStages = LeagueCodesStageMapper[code];
  const stageIndex = Object.values(leagueStages).indexOf(matchStage);
  if (stageIndex === 0) return leagueStages.NONE;

  return Object.values(leagueStages)[stageIndex - 1];
};

export const userResultsText = (result: IUsersPredictionsResults[]): string => {
  let text = '';
  result.forEach((userResult, index) => {
    text += `${userResult.name} - ${userResult.score}`;
    if (index !== result.length - 1) {
      text += '\r';
    }
  });
  return text;
};
