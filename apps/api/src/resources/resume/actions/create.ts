import _ from 'lodash';
import { z } from 'zod';

import { resumeService } from 'resources/resume';

import { validateMiddleware } from 'middlewares';

import { AppKoaContext, AppRouter } from 'types';

const schema = z.object({
  title: z.string().min(1, 'Please enter application title').max(255),
  content: z.string().min(1, 'Please application content').max(10_000),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  ctx.body = await resumeService.insertOne({
    userId: ctx.state.user.id,
    ..._.pickBy(ctx.validatedData),
  });
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), handler);
};
