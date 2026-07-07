import {redirect} from 'react-router';
import type {Route} from './+types/blogs._index';

// Legacy path: the blog now lives at the flat /blog. 301 so old links and any
// indexed URLs carry over to the new structure.
export async function loader(_args: Route.LoaderArgs) {
  return redirect('/blog', 301);
}

export default function BlogsRedirect() {
  return null;
}
