import '../styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppComponent } from 'next/dist/next-server/lib/router/router';
const queryClient = new QueryClient();

const MyApp: AppComponent = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default MyApp;
