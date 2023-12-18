import { securityUtil } from 'utils';

import { DATABASE_DOCUMENTS, TOKEN_SECURITY_LENGTH } from 'app-constants';
import { Token } from 'types';

import DatabaseService from 'services/database/database.service';

const service = new DatabaseService<Token>(DATABASE_DOCUMENTS.TOKENS);

const createToken = async (userId: number) => {
  const value = await securityUtil.generateSecureToken(TOKEN_SECURITY_LENGTH);

  return service.insertOne({
    value,
    userId,
  });
};

const createAuthTokens = async ({ userId }: { userId: number }) => {
  const accessTokenEntity = await createToken(userId);

  return {
    accessToken: accessTokenEntity?.value,
  };
};

const findTokenByValue = async (token: string) => {
  const tokenEntity = await service.findOne({ value: token });

  return tokenEntity && {
    userId: tokenEntity.userId,
  };
};

const removeAuthTokens = async (accessToken: string) => {
  return service.deleteMany({ value: accessToken });
};

export default Object.assign(service, {
  createAuthTokens,
  findTokenByValue,
  removeAuthTokens,
});
