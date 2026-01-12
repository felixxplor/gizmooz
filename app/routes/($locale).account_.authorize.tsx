import type {Route} from '../+types/root';

export async function loader({context}: Route.LoaderArgs) {
  return context.customerAccount.authorize();
}
