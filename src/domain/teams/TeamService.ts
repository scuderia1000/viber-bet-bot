import svg2img from 'svg2img';
import { BlobServiceClient } from '@azure/storage-blob';
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
  private AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || '';

  private AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || '';

  private AZURE_STORAGE_CONTAINER_PREFIX = process.env.AZURE_STORAGE_CONTAINER_PREFIX || '';

  // Get a reference to a container
  private containerClient;

  private readonly dao: ITeamDao;

  constructor(dao: ITeamDao) {
    super();
    this.dao = dao;
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      this.AZURE_STORAGE_CONNECTION_STRING,
    );
    this.containerClient = blobServiceClient.getContainerClient(this.AZURE_STORAGE_CONTAINER_NAME);
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
          if (
            team.crestUrl ===
            'https://upload.wikimedia.org/wikipedia/commons/b/b5/Legia_Warszawa.svg'
          ) {
            team.crestUrl = 'https://upload.wikimedia.org/wikipedia/de/b/b5/Legia_Warszawa.svg';
          }
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

  private convertSvg(svgUrl: string): Promise<ArrayBufferView> {
    return new Promise((resolve, reject) => {
      svg2img(svgUrl, (error, buffer) => {
        if (error) {
          reject(error);
        }
        resolve(buffer);
      });
    });
  }

  private async uploadImage(imageName: string, data: ArrayBufferView): Promise<string | undefined> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(imageName);
    let imageUrl = '';
    try {
      const uploadBlobResponse = await blockBlobClient.uploadData(data);
      logger.debug('Blob was uploaded successfully. requestId: %s', uploadBlobResponse.requestId);

      imageUrl = `${this.AZURE_STORAGE_CONTAINER_PREFIX}/${this.AZURE_STORAGE_CONTAINER_NAME}/${imageName}`;
    } catch (err) {
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
