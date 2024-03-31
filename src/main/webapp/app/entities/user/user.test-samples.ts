import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 7059,
  login: '`@-\\@2v',
};

export const sampleWithPartialData: IUser = {
  id: 19894,
  login: '_LH.',
};

export const sampleWithFullData: IUser = {
  id: 2781,
  login: 'XUEU',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
