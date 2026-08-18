import Link from 'next/link';
import { Container } from './ui';

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white mt-auto">
      <Container className="py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-600">
          <p>© {currentYear} Finance Agent HQ. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-neutral-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-900 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
