import Link from 'next/link';

export default function Header({ currentUser }) {
  const links = [
    !currentUser && { label: 'Sign Up', url: '/auth/signup' },
    !currentUser && { label: 'Sign In', url: '/auth/signin' },
    currentUser && { label: 'Sell Ticket', url: '/tickets/new' },
    currentUser && { label: 'My Orders', url: '/orders' },
    currentUser && { label: 'Sign Out', url: '/auth/signout' },
  ];

  return (
    <header>
      <nav className='navbar navbar-light bg-light'>
        <Link href='/'>
          <a className='navbar-brand'>GitTix</a>
        </Link>

        <div className='d-flex justify-content-end'>
          <ul className='nav d-flex align-items-center'>
            {links
              .filter((l) => l)
              .map(({ url, label }) => (
                <li key={url}>
                  <Link href={url}>
                    <a className='nav-link' href={url}>
                      {label}
                    </a>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
