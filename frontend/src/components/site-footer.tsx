import Link from 'next/link';

const FOOTER_LINKS = [
  {
    href: '/about',
    label: 'About',
  },
  {
    href: '/privacy',
    label: 'Privacy',
  },
  {
    href: '/terms',
    label: 'Terms',
  },
  {
    href: 'mailto:iamyeshar@gmail.com',
    label: 'Support',
  },
  {
    href: 'https://github.com/CodeHealthy',
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/iamyeshar',
    label: 'LinkedIn',
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 px-6 py-8 text-sm text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} FormFit. Built by Muhammad Yeshar.</p>

        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
