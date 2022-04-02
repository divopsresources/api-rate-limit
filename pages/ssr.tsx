import { useState } from 'react';
import useSWR from 'swr';
import {
  Layout,
  Page,
  Button,
  Input,
  Text,
  Link,
  Code,
} from '@vercel/examples-ui';
import fetchAPI from '@lib/fetch-api';

const fetcher = (url) => fetch(url).then((res) => res.json());

export async function getServerSideProps() {
  const initialData = await fetcher('https://api.github.com/repos/vercel/swr');
  return { props: { initialData } };
}

export default function Ssr({ initialData }) {
  const [loading, setLoading] = useState<boolean>(false);
  const { myIp, rules } = data || {};

  const { data, error } = useSWR(
    'https://api.github.com/repos/vercel/swr',
    fetcher,
    { initialData }
  );

  console.log(data);

  if (error) return "An error has occurred.";
  if (!data) return "Loading...";
  return (
  // there should be no `undefined` state

  return (
    <Page>
      <div>
        <h1>{data.name}</h1>
        <p>{data.description}</p>
        <strong>👀 {data.subscribers_count}</strong>{" "}
        <strong>✨ {data.stargazers_count}</strong>{" "}
        <strong>🍴 {data.forks_count}</strong>
      </div>

      <form
        className="flex py-8"
        onSubmit={async (e) => {
          e.preventDefault();

          const form: any = e.target;
          const ip = form.ip.value;

          setLoading(true);
          await fetchAPI('/rules/ip', {
            method: 'PUT',
            data: { ip, action: 'block' },
          }).finally(() => {
            setLoading(false);
            form.reset();
          });
          await mutate();
        }}
      >
        <Input name="ip" placeholder={myIp || 'IP'} />
        <Button type="submit" className="ml-4" width="120px" loading={loading}>
          Block IP
        </Button>
      </form>

      <div>
        {rules ? (
          rules.length ? (
            <ul className="border-accents-2 border rounded-md bg-white divide-y divide-accents-2 my-6">
              {rules.map(([ip, { action }]: any) => (
                <li
                  key={ip}
                  className="flex items-center justify-content py-6 px-6"
                >
                  <span className="flex-1">
                    <h3 className="font-semibold text-black">{ip}</h3>
                    <p className="font-medium text-accents-4">{action}</p>
                  </span>
                  <span className="w-48 flex justify-end">
                    <Button
                      onClick={async () => {
                        await fetchAPI(`/rules/ip?ip=${ip}`, {
                          method: 'DELETE',
                        });
                        await mutate();
                      }}
                      size="sm"
                      variant="secondary"
                    >
                      Remove Rule
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          ) : null
        ) : error ? (
          <div>Failed to load rules</div>
        ) : (
          <div>Loading Rules...</div>
        )}
      </div>
    </Page>
  );
}

Index.Layout = Layout;

export default Index;
