const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/crosslifechristianfellowship?igsh=MTc4MmM1YmI2Ng==',
    path: 'M12 2.2c2.7 0 3 .01 4.1.06 1 .05 1.6.2 2 .36.5.2.9.4 1.3.8.4.4.6.8.8 1.3.16.4.3 1 .36 2 .05 1.1.06 1.4.06 4.1s-.01 3-.06 4.1c-.05 1-.2 1.6-.36 2-.2.5-.4.9-.8 1.3-.4.4-.8.6-1.3.8-.4.16-1 .3-2 .36-1.1.05-1.4.06-4.1.06s-3-.01-4.1-.06c-1-.05-1.6-.2-2-.36-.5-.2-.9-.4-1.3-.8-.4-.4-.6-.8-.8-1.3-.16-.4-.3-1-.36-2C2.21 15 2.2 14.7 2.2 12s.01-3 .06-4.1c.05-1 .2-1.6.36-2 .2-.5.4-.9.8-1.3.4-.4.8-.6 1.3-.8.4-.16 1-.3 2-.36C9 2.21 9.3 2.2 12 2.2zm0 1.8c-2.67 0-2.97.01-4.02.06-.87.04-1.34.18-1.65.3-.42.16-.71.36-1.02.67-.31.31-.5.6-.67 1.02-.12.31-.26.78-.3 1.65C4.29 8.03 4.28 8.33 4.28 11s.01 2.97.06 4.02c.04.87.18 1.34.3 1.65.16.42.36.71.67 1.02.31.31.6.5 1.02.67.31.12.78.26 1.65.3 1.05.05 1.35.06 4.02.06s2.97-.01 4.02-.06c.87-.04 1.34-.18 1.65-.3.42-.16.71-.36 1.02-.67.31-.31.5-.6.67-1.02.12-.31.26-.78.3-1.65.05-1.05.06-1.35.06-4.02s-.01-2.97-.06-4.02c-.04-.87-.18-1.34-.3-1.65a2.7 2.7 0 0 0-.67-1.02 2.7 2.7 0 0 0-1.02-.67c-.31-.12-.78-.26-1.65-.3C14.97 4.01 14.67 4 12 4zm0 3.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2zm0 1.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zm4.8-2a1.08 1.08 0 1 1 0 2.16 1.08 1.08 0 0 1 0-2.16z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@crosslifeGPC',
    path: 'M21.6 7.2s-.21-1.5-.87-2.16c-.83-.87-1.76-.87-2.19-.92C15.4 4 12 4 12 4h-.01s-3.4 0-6.54.12c-.43.05-1.36.05-2.19.92-.66.66-.87 2.16-.87 2.16S2.18 9 2.18 10.8v1.68C2.18 14.28 2.4 16.08 2.4 16.08s.21 1.5.86 2.16c.83.87 1.92.84 2.4.93 1.75.17 7.34.22 7.34.22s3.4 0 6.55-.13c.43-.05 1.36-.05 2.19-.92.66-.66.87-2.16.87-2.16s.22-1.8.22-3.6v-1.68c0-1.8-.22-3.6-.22-3.6zM9.98 14.6V8.99l5.4 2.81-5.4 2.8z',
  },
  {
    label: 'Spotify',
    href: 'https://open.spotify.com/show/6Id4sva6LhINXQFgXQIcNG?si=d224bad13b5a4395',
    path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.59 14.4a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.78-.96a.62.62 0 1 1-.28-1.22c3.81-.87 7.08-.5 9.71 1.1.3.19.4.58.21.87zm1.22-2.72a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.63-1.1 8.14-.57 11.23 1.32.37.23.49.72.26 1.08zm.11-2.83C14.95 8.97 9.6 8.79 6.53 9.73a.93.93 0 1 1-.54-1.78c3.53-1.07 9.4-.86 13.1 1.35a.93.93 0 0 1-.96 1.59z',
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-16 text-center">
        <p className="font-serif text-lg tracking-[0.15em]">CROSSLIFE</p>
        <div className="flex flex-col gap-1 text-sm text-cream/70">
          <p>crosslifechristianfellowship@gmail.com</p>
          <p>Gardena, CA 90247</p>
        </div>
        <div className="mt-2 flex items-center gap-5">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-cream/70 transition-colors hover:text-cream"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 fill-current"
              >
                <path d={social.path} />
              </svg>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-cream/40">
          &copy; {new Date().getFullYear()} Crosslife Christian Fellowship
        </p>
      </div>
    </footer>
  );
}
