import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'ee4ae103-9c1f-4005-aba9-633736b512e4',
};

export const sampleWithPartialData: IAuthority = {
  name: 'befe9c46-37c8-40fb-9f82-f6808117ee7a',
};

export const sampleWithFullData: IAuthority = {
  name: '7744b785-67df-4364-870a-ae324d9b06e5',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
