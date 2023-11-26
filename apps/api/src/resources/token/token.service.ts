import db from 'db';
import { securityUtil } from 'utils';
import { DatabaseService } from 'services';

import { DATABASE_DOCUMENTS, TOKEN_SECURITY_LENGTH } from 'app-constants';
import { Token, TokenType } from 'types';

const service = new DatabaseService<Token>(db, DATABASE_DOCUMENTS.TOKENS);

const createToken = async (userId: number, type: TokenType, isShadow?: boolean) => {
  const value = await securityUtil.generateSecureToken(TOKEN_SECURITY_LENGTH);

  return service.insertOne({
    type,
    value,
    userId,
    isShadow: isShadow || null,
  });
};

const createAuthTokens = async ({
  userId,
  isShadow,
}: { userId: number, isShadow?: boolean }) => {
  const accessTokenEntity = await createToken(userId, TokenType.ACCESS, isShadow);

  return {
    accessToken: accessTokenEntity?.value,
  };
};

const findTokenByValue = async (token: string) => {
  const tokenEntity = await service.findOne({ value: token });

  return tokenEntity && {
    userId: tokenEntity.userId,
    isShadow: tokenEntity.isShadow,
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
