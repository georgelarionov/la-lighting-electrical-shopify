import {redirect} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';

// Legacy path: /blogs/<blogHandle>/<articleHandle> → the flat /blog/<articleHandle> (301).
export async function loader({params}: Route.LoaderArgs) {
  return redirect(`/blog/${params.articleHandle}`, 301);
}

export default function ArticleRedirect() {
  return null;
}
