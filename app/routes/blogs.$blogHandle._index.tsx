import {redirect} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle._index';

// Legacy path: /blogs/<blogHandle> → the flat /blog listing (301).
export async function loader(_args: Route.LoaderArgs) {
  return redirect('/blog', 301);
}

export default function BlogHandleRedirect() {
  return null;
}
