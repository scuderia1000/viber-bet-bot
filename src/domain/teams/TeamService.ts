import svg2img from 'svg2img';
import common = require('oci-common');
// eslint-disable-next-line import/no-extraneous-dependencies
import { ObjectStorageClient, UploadManager } from 'oci-objectstorage';
import { IService } from '../common/IService';
import { ITeam, Team } from './Team';
import AbstractService from '../common/AbstractService';
import { ITeamDao } from './TeamDao';
import { ICommonDao } from '../common/ICommonDao';
import { ICompetitionListeners } from '../../types/base';
import { ICompetition } from '../competitions/Competition';
import logger from '../../util/logger';
import { ITeamShort } from './TeamShort';

export interface ITeamService extends IService<ITeam> {
  getAllTeamsShort(): Promise<Record<number, ITeamShort>>;
}

export class TeamService
  extends AbstractService<ITeam>
  implements ITeamService, ICompetitionListeners {
  private OCI_BUCKET_NAME = process.env.OCI_BUCKET_NAME || '';

  private OCI_BUCKET_NAMESPACE = process.env.OCI_BUCKET_NAMESPACE || '';

  private OCI_BUCKET_PREFIX = process.env.OCI_BUCKET_PREFIX || '';

  // Oracle Cloud Infrastructure
  private uploadManager: UploadManager;

  private readonly dao: ITeamDao;

  constructor(dao: ITeamDao) {
    super();
    this.dao = dao;
    const provider: common.ConfigFileAuthenticationDetailsProvider = new common.ConfigFileAuthenticationDetailsProvider();
    const client = new ObjectStorageClient({ authenticationDetailsProvider: provider });
    this.uploadManager = new UploadManager(client, { enforceMD5: true });
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

    const existTeams = await this.getAllTeams();
    const teams = await Promise.all(
      competitionTeams.teams.map(async (competitionTeam) => {
        const team = new Team(competitionTeam);
        const currentExistTeam = existTeams[team.id];

        if (currentExistTeam?.crestImageUrl) {
          team.crestImageUrl = currentExistTeam.crestImageUrl;
        } else if (team.crestUrl) {
          const imageName = `${team.crestUrl.substring(
            team.crestUrl.lastIndexOf('/') + 1,
            team.crestUrl.lastIndexOf('.'),
          )}.png`;
          try {
            const imageData = await this.convertSvg(team.crestUrl);
            const crestImageUrl = await this.uploadImage(imageName, imageData);
            if (crestImageUrl) {
              team.crestImageUrl = crestImageUrl;
            }
          } catch (err) {
            logger.error('Error processing team crest image: %s', err);
            logger.error('Error team: %s', team);
          }
        }
        return team;
      }),
    );
    await this.updateEntities(existTeams, teams);
  }

  private convertSvg(svgUrl: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      svg2img(svgUrl, (error, buffer) => {
        if (error) {
          reject(error);
        }
        resolve(buffer);
      });
    });
  }

  // Oracle upload
  private async uploadImage(imageName: string, data: Uint8Array): Promise<string | undefined> {
    let imageUrl = '';
    try {
      const callback = (res: any) => {
        logger.debug('Blob was uploaded successfully. Response: %s', res);

        imageUrl = `${this.OCI_BUCKET_PREFIX}${imageName}`;
      };
      await this.uploadManager.upload(
        {
          content: {
            stream: data,
          },
          requestDetails: {
            namespaceName: this.OCI_BUCKET_NAMESPACE,
            bucketName: this.OCI_BUCKET_NAME,
            objectName: imageName,
          },
        },
        callback,
      );
    } catch (err: any) {
      logger.error(
        'uploadFile failed, requestId - %s, statusCode - %n, errorCode - %n',
        err.details.requestId,
        err.statusCode,
        err.details.errorCode,
      );
    }
    return imageUrl;
  }

  async getAllTeamsShort(): Promise<Record<number, ITeamShort>> {
    const teamsResult = await this.dao.getAllTeamsShort();
    return teamsResult.reduce((acc, team) => ({ ...acc, [team.id]: team }), {});
  }
}
