import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {PageHeader} from '~/components/PageHeader';
import {cn} from '~/lib/utils';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : 'Welcome to your account'
    : 'Account';

  return (
    <div className="bg-canvas">
      <PageHeader title={heading} border={false} />
      <div className="container-page">
        <AccountMenu />
      </div>
      <div className="container-page section-y account-shell">
        <Outlet context={{customer}} />
      </div>
    </div>
  );
}

function AccountMenu() {
  const linkClass = ({isActive}: {isActive: boolean}) =>
    cn(
      'inline-flex h-10 items-center border-b-2 px-1 type-caption-strong transition-colors',
      isActive
        ? 'border-ink text-ink'
        : 'border-transparent text-ink-subtle hover:text-ink',
    );

  return (
    <nav
      role="navigation"
      className="flex items-center gap-6 border-b border-hairline"
    >
      <NavLink to="/account/orders" className={linkClass}>
        Orders
      </NavLink>
      <NavLink to="/account/profile" className={linkClass}>
        Profile
      </NavLink>
      <NavLink to="/account/addresses" className={linkClass}>
        Addresses
      </NavLink>
      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form className="ml-auto" method="POST" action="/account/logout">
      <button
        type="submit"
        className="type-caption-strong text-ink-subtle transition-colors hover:text-primary"
      >
        Sign out
      </button>
    </Form>
  );
}
