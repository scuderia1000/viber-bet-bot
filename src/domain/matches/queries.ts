import { ObjectId } from 'mongodb';
import { MatchStatus } from '../types/Base';
import { ChampionsLeagueStages } from '../../const';

export const getScheduledMatchesAggregateQuery = (
  seasonId: ObjectId,
  status: MatchStatus[] | MatchStatus,
  matchday?: number,
  stage?: ChampionsLeagueStages,
) => [
  {
    $match: {
      'season._id': seasonId,
      status: status instanceof Array ? { $in: status } : status,
      ...(stage && { stage }),
      ...(matchday && { matchday }),
    },
  },
  {
    $sort: { utcDate: 1, group: 1 },
  },
  {
    $lookup: {
      from: 'teams',
      let: { team_id: '$homeTeam.id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$id', '$$team_id'] } } },
        { $project: { _id: 1, id: 1, name: 1, crestImageUrl: 1 } },
      ],
      as: 'homeTeam',
    },
  },
  {
    $unwind: '$homeTeam',
  },
  {
    $lookup: {
      from: 'teams',
      let: { team_id: '$awayTeam.id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$id', '$$team_id'] } } },
        { $project: { _id: 1, id: 1, name: 1, crestImageUrl: 1 } },
      ],
      as: 'awayTeam',
    },
  },
  {
    $unwind: '$awayTeam',
  },
];

export const prevStageUsersResultQuery = (
  stage?: ChampionsLeagueStages,
  matchday?: number,
  // eslint-disable-next-line @typescript-eslint/ban-types
): object[] => [
  {
    $lookup: {
      from: 'competitions',
      let: {
        seasonId: '$season.id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$currentSeason.id', '$$seasonId'],
            },
          },
        },
        {
          $project: {
            currentSeasonViberId: '$currentSeason.id',
            _id: 0,
          },
        },
      ],
      as: 'competition',
    },
  },
  {
    $match: {
      competition: {
        $exists: true,
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          {
            $arrayElemAt: ['$competition', 0],
          },
          '$$ROOT',
        ],
      },
    },
  },
  {
    $project: {
      competition: 0,
      season: 0,
    },
  },
  {
    $lookup: {
      from: 'seasons',
      let: {
        seasonId: '$currentSeasonViberId',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$id', '$$seasonId'],
            },
          },
        },
        {
          $project: {
            currentMatchday: 1,
            _id: 0,
          },
        },
      ],
      as: 'season',
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          {
            $arrayElemAt: ['$season', 0],
          },
          '$$ROOT',
        ],
      },
    },
  },
  stage && matchday
    ? {
        $match: {
          stage,
          matchday,
        },
      }
    : {},
  {
    $lookup: {
      from: 'predictions',
      let: {
        matchId: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$matchId', '$$matchId'],
            },
            userViberId: {
              $ne: 'SSVns+yDcC2J1clVg581Lg==',
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            let: {
              userId: '$userViberId',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$id', '$$userId'],
                  },
                },
              },
              {
                $project: {
                  name: 1,
                  _id: 0,
                },
              },
            ],
            as: 'user',
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ['$user', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            userScoreHomeTeam: '$score.regularTime.homeTeam',
            userScoreAwayTeam: '$score.regularTime.awayTeam',
            userPredictScore: 1,
          },
        },
      ],
      as: 'predictions',
    },
  },
  {
    $sort: {
      group: 1,
      utcDate: 1,
    },
  },
  {
    $project: {
      group: 1,
      _id: 0,
      stage: 1,
      currentMatchday: 1,
      matchDate: {
        $convert: {
          input: '$utcDate',
          to: 'string',
        },
      },
      homeTeam: '$homeTeam.name',
      awayTeam: '$awayTeam.name',
      scoreHomeTeam: '$score.fullTime.homeTeam',
      scoreAwayTeam: '$score.fullTime.awayTeam',
      z_predictions: '$predictions',
    },
  },
  {
    $unwind: {
      path: '$z_predictions',
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: ['$z_predictions', '$$ROOT'],
      },
    },
  },
  {
    $project: {
      z_predictions: 0,
    },
  },
  {
    $group: {
      _id: '$name',
      stage_result: {
        $sum: '$userPredictScore',
      },
    },
  },
  {
    $project: {
      name: '$_id',
      score: '$stage_result',
      _id: 0,
    },
  },
  {
    $sort: {
      stage_result: -1,
    },
  },
];
