import SignInPage from './ClientSignIn';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | NFIS Portfolio Access',
  description: 'Log in to your NFIS dashboard to manage your franchise profile, portfolio, or exhibition details.',
};

export default function Page() {
  return <SignInPage />;
}
