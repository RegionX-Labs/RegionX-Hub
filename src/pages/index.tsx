import Home from './Home/page';

interface HomePageProps {
  theme: 'light' | 'dark';
}

export default function HomePage({ theme }: HomePageProps) {
  return <Home theme={theme} />;
}
