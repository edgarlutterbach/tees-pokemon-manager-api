import { tokenProvider } from './providers';
import { makeEnsureAuthenticated } from '@infrastructure/http/middlewares/ensure-authenticated';

const ensureAuthenticated = makeEnsureAuthenticated(tokenProvider);

export { ensureAuthenticated };
